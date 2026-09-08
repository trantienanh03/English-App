package org.englishapp.backend.dto;

import java.util.List;

public record LessonDto(
        String id,
        String name,
        String description,
        String difficulty,
        String category,
        String icon,
        int progress,
        List<WordDto> words
) {}
