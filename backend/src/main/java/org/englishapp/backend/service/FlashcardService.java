package org.englishapp.backend.service;

import org.englishapp.backend.dto.FlashcardDto;
import org.englishapp.backend.dto.ReviewFlashcardRequest;
import org.englishapp.backend.entity.SavedFlashcard;
import org.englishapp.backend.repository.AppUserRepository;
import org.englishapp.backend.repository.SavedFlashcardRepository;
import org.englishapp.backend.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class FlashcardService {
    private final SavedFlashcardRepository flashcards;
    private final AppUserRepository users;
    private final WordRepository words;
    private final WordService wordService;
    private final Clock clock;

    @Autowired
    public FlashcardService(SavedFlashcardRepository flashcards, AppUserRepository users,
                            WordRepository words, WordService wordService) {
        this(flashcards, users, words, wordService, Clock.systemUTC());
    }

    FlashcardService(SavedFlashcardRepository flashcards, AppUserRepository users,
                     WordRepository words, WordService wordService, Clock clock) {
        this.flashcards = flashcards;
        this.users = users;
        this.words = words;
        this.wordService = wordService;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<FlashcardDto> findAll(UUID userId, boolean dueOnly) {
        List<SavedFlashcard> cards = dueOnly
                ? flashcards.findAllByUserIdAndNextReviewAtLessThanEqualOrderByNextReviewAt(userId, clock.instant())
                : flashcards.findAllByUserIdOrderByCreatedAtDesc(userId);
        return cards.stream().map(this::toDto).toList();
    }

    @Transactional
    public FlashcardDto save(UUID userId, Long vocabularyId) {
        return flashcards.findByUserIdAndWordId(userId, vocabularyId)
                .map(this::toDto)
                .orElseGet(() -> {
                    users.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
                    var word = words.findById(vocabularyId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vocabulary not found: " + vocabularyId));
                    SavedFlashcard card = new SavedFlashcard();
                    card.setUserId(userId);
                    card.setWordId(vocabularyId);
                    card.setWord(word);
                    card.setNextReviewAt(clock.instant());
                    try {
                        return toDto(flashcards.saveAndFlush(card));
                    } catch (DataIntegrityViolationException race) {
                        return flashcards.findByUserIdAndWordId(userId, vocabularyId)
                                .map(this::toDto)
                                .orElseThrow(() -> race);
                    }
                });
    }

    @Transactional
    public FlashcardDto review(UUID userId, Long cardId, ReviewFlashcardRequest.Rating rating) {
        SavedFlashcard card = ownedCard(userId, cardId);
        int repetitions = card.getRepetitions();
        int interval = card.getIntervalDays();
        double ease = card.getEasinessFactor();

        switch (rating) {
            case AGAIN -> {
                repetitions = 0;
                interval = 1;
                ease = Math.max(1.3, ease - 0.2);
            }
            case GOOD -> {
                repetitions += 1;
                interval = repetitions == 1 ? 1 : repetitions == 2 ? 6 : Math.max(1, (int) Math.round(interval * ease));
            }
            case EASY -> {
                repetitions += 1;
                ease += 0.15;
                interval = repetitions == 1 ? 4 : repetitions == 2 ? 8 : Math.max(1, (int) Math.round(interval * ease));
            }
        }

        card.setRepetitions(repetitions);
        card.setIntervalDays(interval);
        card.setEasinessFactor(ease);
        card.setNextReviewAt(clock.instant().plus(interval, ChronoUnit.DAYS));
        return toDto(flashcards.save(card));
    }

    @Transactional
    public void delete(UUID userId, Long cardId) {
        SavedFlashcard card = ownedCard(userId, cardId);
        flashcards.delete(card);
    }

    private SavedFlashcard ownedCard(UUID userId, Long cardId) {
        return flashcards.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard not found"));
    }

    private FlashcardDto toDto(SavedFlashcard card) {
        return new FlashcardDto(card.getId(), wordService.toDto(card.getWord()), card.getEasinessFactor(),
                card.getRepetitions(), card.getIntervalDays(), card.getNextReviewAt(), card.getCreatedAt());
    }
}
