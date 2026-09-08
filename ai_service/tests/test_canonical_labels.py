import unittest
from pathlib import Path
import re


class CanonicalLabelsTest(unittest.TestCase):
    def test_objects365_labels_are_unique_and_aligned_with_backend(self):
        ai_root = Path(__file__).resolve().parents[1]
        ai_labels = [line.strip() for line in (ai_root / "canonical-labels.txt").read_text(encoding="utf-8").splitlines() if line.strip()]
        backend_labels = [line.strip() for line in (ai_root.parent / "backend" / "src" / "main" / "resources" / "canonical-labels.txt").read_text(encoding="utf-8").splitlines() if line.strip()]
        self.assertEqual(365, len(ai_labels))
        self.assertEqual(365, len(set(ai_labels)))
        self.assertEqual(ai_labels, backend_labels)

        lesson_migration = (ai_root.parent / "backend" / "src" / "main" / "resources" / "db" / "migration" / "V106__learning_persistence.sql").read_text(encoding="utf-8")
        lesson_labels = re.findall(r"\('(?:office|kitchen|transport|animals)', '([^']+)', \d+\)", lesson_migration)
        self.assertEqual(20, len(lesson_labels))
        self.assertEqual([], sorted(set(lesson_labels) - set(ai_labels)))


if __name__ == "__main__":
    unittest.main()
