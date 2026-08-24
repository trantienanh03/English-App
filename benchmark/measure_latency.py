# -*- coding: utf-8 -*-
"""
Script đo thời gian suy luận (Inference Latency) của YOLO-World v2
Dùng cho Chương 4 — Luận văn Vocam
"""

import time
import csv
import numpy as np
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent.parent
AI_DIR = BASE_DIR / "ai_service"
RESULTS_DIR = BASE_DIR / "benchmark" / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

IMAGE_PATH = AI_DIR / "bus.jpg"
CANONICAL_LABELS = [line.strip().lower() for line in (AI_DIR / "canonical-labels.txt").read_text(encoding="utf-8").splitlines() if line.strip()]

MODELS = {
    "yolov8s-worldv2": AI_DIR / "yolov8s-worldv2.pt",
    "yolov8m-worldv2": AI_DIR / "yolov8m-worldv2.pt"
}

def measure_latency():
    raw_records = []
    summary_results = {}

    for model_name, model_path in MODELS.items():
        if not model_path.exists():
            print(f"⚠️ Model file {model_path} không tồn tại.")
            continue

        print(f"\n🚀 Đang khởi tạo & nạp model: {model_name}...")
        model = YOLO(str(model_path))
        model.set_classes(CANONICAL_LABELS)

        # Warm-up 5 lần (không tính vào kết quả)
        print("🔥 Warm-up 5 lần...")
        for _ in range(5):
            model.predict(source=str(IMAGE_PATH), conf=0.25, verbose=False)

        # Đo chính thức 10 lần
        print("⏱️ Đo thời gian suy luận 10 lần...")
        latencies = []
        for run_idx in range(1, 11):
            t0 = time.perf_counter()
            results = model.predict(source=str(IMAGE_PATH), conf=0.25, verbose=False)
            t1 = time.perf_counter()
            inf_ms = (t1 - t0) * 1000.0
            latencies.append(inf_ms)

            # Record raw
            raw_records.append({
                "model": model_name,
                "image": IMAGE_PATH.name,
                "threshold": 0.25,
                "run": run_idx,
                "inference_ms": round(inf_ms, 2),
                "total_api_ms": "N/A (Standalone Inference)"
            })
            print(f"  Run {run_idx}: {inf_ms:.2f} ms")

        arr = np.array(latencies)
        summary_results[model_name] = {
            "mean": float(np.mean(arr)),
            "median": float(np.median(arr)),
            "p95": float(np.percentile(arr, 95)),
            "min": float(np.min(arr)),
            "max": float(np.max(arr))
        }

    # Xuất file CSV raw
    csv_file = RESULTS_DIR / "latency_raw.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["model", "image", "threshold", "run", "inference_ms", "total_api_ms"])
        writer.writeheader()
        writer.writerows(raw_records)

    print(f"\n✅ Đã lưu dữ liệu latency thô vào: {csv_file}")

    print("\n=== TỔNG HỢP THỜI GIAN SUY LUẬN (INFERENCE LATENCY) ===")
    for model_name, stats in summary_results.items():
        print(f"Model: {model_name}")
        print(f"  Mean:   {stats['mean']:.2f} ms")
        print(f"  Median: {stats['median']:.2f} ms")
        print(f"  P95:    {stats['p95']:.2f} ms")
        print(f"  Min:    {stats['min']:.2f} ms")
        print(f"  Max:    {stats['max']:.2f} ms")

if __name__ == "__main__":
    measure_latency()
