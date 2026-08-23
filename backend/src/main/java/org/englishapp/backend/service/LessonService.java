package org.englishapp.backend.service;

import org.englishapp.backend.dto.LessonDto;
import org.englishapp.backend.entity.Lesson;
import org.englishapp.backend.entity.UserLessonProgress;
import org.englishapp.backend.entity.UserLessonProgressId;
import org.englishapp.backend.repository.LessonRepository;
import org.englishapp.backend.repository.UserLessonProgressRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class LessonService {
    private final LessonRepository lessons;
    private final UserLessonProgressRepository progress;
    private final WordService words;

    public LessonService(LessonRepository lessons, UserLessonProgressRepository progress, WordService words) {
        this.lessons = lessons;
        this.progress = progress;
        this.words = words;
    }

    @Transactional(readOnly = true)
    public List<LessonDto> findAll(UUID userId) {
        Map<String, UserLessonProgress> byLesson = progress.findAllByIdUserId(userId).stream()
                .collect(Collectors.toMap(p -> p.getId().getLessonId(), Function.identity()));
        return lessons.findAll().stream().map(lesson -> toDto(lesson, byLesson.get(lesson.getId()))).toList();
    }

    @Transactional
    public LessonDto recordScore(UUID userId, String lessonId, int score) {
        Lesson lesson = lessons.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
        UserLessonProgressId id = new UserLessonProgressId(userId, lessonId);
        UserLessonProgress state = progress.findById(id).orElseGet(() -> new UserLessonProgress(id));
        state.setLastScore(score);
        state.setBestScore(Math.max(state.getBestScore(), score));
        if (score >= 70 && state.getCompletedAt() == null) state.setCompletedAt(Instant.now());
        return toDto(lesson, progress.save(state));
    }

    private LessonDto toDto(Lesson lesson, UserLessonProgress state) {
        return new LessonDto(lesson.getId(), lesson.getName(), lesson.getDescription(), lesson.getDifficulty(),
                lesson.getCategory(), lesson.getIcon(), state == null ? 0 : state.getBestScore(),
                lesson.getWords().stream().map(words::toDto).toList());
    }
}
