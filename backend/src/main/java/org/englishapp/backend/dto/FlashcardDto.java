package org.englishapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record FlashcardDto(
        Long id,
        WordDto word,
        double easinessFactor,
        int repetitions,
        int intervalDays,
        Instant nextReviewAt,
        Instant createdAt
) {
    @JsonProperty("interval")
    public int interval() {
        return intervalDays;
    }
}

