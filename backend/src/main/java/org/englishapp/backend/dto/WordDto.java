package org.englishapp.backend.dto;

import jakarta.validation.constraints.Size;

public class WordDto {
    private Long id;
    private String detectionLabel;
    @Size(min = 1, max = 100)
    private String enWord;
    private String phonetic;
    private String pos;
    private String definition;
    @Size(min = 1, max = 200)
    private String translation;
    private String exampleEn;
    private String exampleVn;
    private String imageUrl;

    public WordDto() {}

    public WordDto(Long id, String detectionLabel, String enWord, String phonetic, String pos, String definition, String translation, String exampleEn, String exampleVn, String imageUrl) {
        this.id = id;
        this.detectionLabel = detectionLabel;
        this.enWord = enWord;
        this.phonetic = phonetic;
        this.pos = pos;
        this.definition = definition;
        this.translation = translation;
        this.exampleEn = exampleEn;
        this.exampleVn = exampleVn;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDetectionLabel() { return detectionLabel; }
    public void setDetectionLabel(String detectionLabel) { this.detectionLabel = detectionLabel; }

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
}
