package org.englishapp.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "words")
@Getter @Setter @NoArgsConstructor
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // YOLO detection class name, e.g. "cup", "cat", "laptop"
    @Column(name = "coco_class", nullable = false, unique = true, length = 50)
    private String cocoClass;

    @Column(name = "en_word", nullable = false, length = 100)
    private String enWord;

    @Column(length = 100)
    private String phonetic;

    @Column(length = 20)
    private String pos;

    @Column(columnDefinition = "TEXT")
    private String definition;

    @Column(nullable = false, length = 200)
    private String translation;

    @Column(name = "example_en", columnDefinition = "TEXT")
    private String exampleEn;

    @Column(name = "example_vn", columnDefinition = "TEXT")
    private String exampleVn;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
