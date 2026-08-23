package org.englishapp.backend.repository;

import org.englishapp.backend.entity.SavedFlashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SavedFlashcardRepository extends JpaRepository<SavedFlashcard, Long> {
    List<SavedFlashcard> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    List<SavedFlashcard> findAllByUserIdAndNextReviewAtLessThanEqualOrderByNextReviewAt(UUID userId, Instant now);
    Optional<SavedFlashcard> findByIdAndUserId(Long id, UUID userId);
    Optional<SavedFlashcard> findByUserIdAndWordId(UUID userId, Long wordId);
    long countByUserId(UUID userId);
    long countByUserIdAndRepetitionsGreaterThanEqual(UUID userId, int repetitions);
    long countByUserIdAndRepetitionsGreaterThanEqualAndIntervalDaysGreaterThanEqual(UUID userId, int repetitions, int intervalDays);
    long countByUserIdAndNextReviewAtLessThanEqual(UUID userId, Instant now);
    void deleteByIdAndUserId(Long id, UUID userId);
}
