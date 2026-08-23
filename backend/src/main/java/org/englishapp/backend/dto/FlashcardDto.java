package org.englishapp.backend.dto;

import java.time.Instant;

public record FlashcardDto(
        Long id,
        WordDto word,
        double easinessFactor,
        int repetitions,
        int intervalDays,
        Instant nextReviewAt,
        Instant createdAt
) {}
