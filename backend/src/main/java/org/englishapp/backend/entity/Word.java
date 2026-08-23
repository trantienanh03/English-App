package org.englishapp.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "words")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // YOLO detection class name, e.g. "cup", "cat", "laptop" (Canonical Label — Protected)
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

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Word() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCocoClass() { return cocoClass; }
    public void setCocoClass(String cocoClass) { this.cocoClass = cocoClass; }

    public String getEnWord() { return enWord; }
    public void setEnWord(String enWord) { this.enWord = enWord; }

    public String getPhonetic() { return phonetic; }
    public void setPhonetic(String phonetic) { this.phonetic = phonetic; }

    public String getPos() { return pos; }
    public void setPos(String pos) { this.pos = pos; }

    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }

    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }

    public String getExampleEn() { return exampleEn; }
    public void setExampleEn(String exampleEn) { this.exampleEn = exampleEn; }

    public String getExampleVn() { return exampleVn; }
    public void setExampleVn(String exampleVn) { this.exampleVn = exampleVn; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
