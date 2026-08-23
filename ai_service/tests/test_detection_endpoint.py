import asyncio
import io
import unittest

import numpy as np
from fastapi import HTTPException, UploadFile
from PIL import Image
from starlette.datastructures import Headers

import main


class FakeBox:
    def __init__(self, class_id, confidence, coordinates):
        self.cls = np.array([class_id])
        self.conf = np.array([confidence])
        self.xyxy = np.array([coordinates])


class FakeResult:
    def __init__(self, boxes):
        self.boxes = boxes


class FakeModel:
    names = {0: "cup", 1: "not-canonical"}

    def __init__(self, results=None, error=None):
        self.results = results or []
        self.error = error

    def __call__(self, _image, conf):
        if self.error:
            raise self.error
        return self.results


def image_upload(width=320, height=180, content_type="image/png"):
    data = io.BytesIO()
    Image.new("RGB", (width, height), "white").save(data, format="PNG")
    data.seek(0)
    return UploadFile(file=data, filename="test.png", headers=Headers({"content-type": content_type}))


class DetectionEndpointTest(unittest.TestCase):
    def setUp(self):
        self.original_model = main.model

    def tearDown(self):
        main.model = self.original_model

    def predict(self, upload, confidence=0.25):
        return asyncio.run(main.predict_multi_objects(upload, confidence, False))

    def test_no_object_is_a_valid_empty_result(self):
        main.model = FakeModel([FakeResult([])])
        result = self.predict(image_upload())
        self.assertTrue(result.success)
        self.assertEqual([], result.predictions)
        self.assertEqual(0, result.total_detected)

    def test_multiple_boxes_keep_dimensions_and_filter_unknown_labels(self):
        main.model = FakeModel([FakeResult([
            FakeBox(0, 0.91, [10, 20, 100, 120]),
            FakeBox(0, 0.82, [120, 30, 260, 160]),
            FakeBox(1, 0.99, [0, 0, 20, 20]),
        ])])
        result = self.predict(image_upload(2000, 300))
        self.assertEqual((2000, 300), (result.image_width, result.image_height))
        self.assertEqual(2, result.total_detected)
        self.assertEqual(["cup", "cup"], [item.label for item in result.predictions])
        self.assertEqual(260, result.predictions[1].box.x2)

    def test_invalid_file_type_is_rejected(self):
        main.model = FakeModel()
        with self.assertRaises(HTTPException) as raised:
            self.predict(image_upload(content_type="text/plain"))
        self.assertEqual(400, raised.exception.status_code)

    def test_model_failure_is_a_safe_service_unavailable_error(self):
        main.model = FakeModel(error=RuntimeError("provider secret must not leak"))
        with self.assertRaises(HTTPException) as raised:
            self.predict(image_upload())
        self.assertEqual(503, raised.exception.status_code)
        self.assertNotIn("provider secret", str(raised.exception.detail))


if __name__ == "__main__":
    unittest.main()
