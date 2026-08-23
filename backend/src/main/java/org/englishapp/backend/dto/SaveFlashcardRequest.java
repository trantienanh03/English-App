package org.englishapp.backend.dto;

import jakarta.validation.constraints.NotNull;

public class SaveFlashcardRequest {
    @NotNull
    private Long vocabularyId;

    public Long getVocabularyId() { return vocabularyId; }
    public void setVocabularyId(Long vocabularyId) { this.vocabularyId = vocabularyId; }
}
