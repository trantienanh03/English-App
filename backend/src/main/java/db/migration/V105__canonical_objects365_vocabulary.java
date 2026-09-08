package db.migration;

import org.flywaydb.core.api.FlywayException;
import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

public class V105__canonical_objects365_vocabulary extends BaseJavaMigration {
    @Override
    public void migrate(Context context) throws Exception {
        List<String> labels;
        try (var stream = getClass().getResourceAsStream("/canonical-labels.txt")) {
            if (stream == null) throw new FlywayException("canonical-labels.txt is missing");
            try (var reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                labels = reader.lines().map(String::trim).filter(s -> !s.isEmpty()).distinct().toList();
            }
        }
        if (labels.size() != 365) {
            throw new FlywayException("Expected 365 unique canonical detector labels, found " + labels.size());
        }

        try (Statement statement = context.getConnection().createStatement()) {
            statement.execute("ALTER TABLE words RENAME COLUMN coco_class TO detection_label");
            statement.execute("ALTER TABLE words ALTER COLUMN detection_label TYPE VARCHAR(100)");
            statement.execute("CREATE TEMP TABLE canonical_detection_labels (label VARCHAR(100) PRIMARY KEY) ON COMMIT DROP");
        }
        try (PreparedStatement insert = context.getConnection()
                .prepareStatement("INSERT INTO canonical_detection_labels(label) VALUES (?)")) {
            for (String label : labels) {
                insert.setString(1, label);
                insert.addBatch();
            }
            insert.executeBatch();
        }
        try (Statement statement = context.getConnection().createStatement()) {
            statement.executeUpdate("DELETE FROM words WHERE detection_label NOT IN (SELECT label FROM canonical_detection_labels)");
            statement.executeUpdate("""
                    INSERT INTO words (detection_label, en_word, pos, definition, translation, example_en, example_vn)
                    SELECT label, label, 'Noun', 'Canonical Objects365 detector category: ' || label,
                           label, 'The image contains ' || label || '.', 'Hình ảnh có đối tượng ' || label || '.'
                    FROM canonical_detection_labels c
                    WHERE NOT EXISTS (SELECT 1 FROM words w WHERE w.detection_label = c.label)
                    """);
        }
    }
}
