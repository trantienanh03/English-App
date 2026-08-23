package org.englishapp.backend.dto;

public class WordDto {
    private Long id;
    private String cocoClass;
    private String enWord;
    private String phonetic;
    private String pos;
    private String definition;
    private String translation;
    private String exampleEn;
    private String exampleVn;

    public WordDto() {}

    public WordDto(Long id, String cocoClass, String enWord, String phonetic,
                   String pos, String definition, String translation,
                   String exampleEn, String exampleVn) {
        this.id = id;
        this.cocoClass = cocoClass;
        this.enWord = enWord;
        this.phonetic = phonetic;
        this.pos = pos;
        this.definition = definition;
        this.translation = translation;
        this.exampleEn = exampleEn;
        this.exampleVn = exampleVn;
    }

    // Getters and setters
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
}
