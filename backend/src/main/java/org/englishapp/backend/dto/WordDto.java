package org.englishapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
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
}
