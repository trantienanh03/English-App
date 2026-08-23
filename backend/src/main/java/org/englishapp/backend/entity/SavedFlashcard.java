package org.englishapp.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "saved_flashcards", uniqueConstraints =
        @UniqueConstraint(name = "uk_saved_flashcard_user_word", columnNames = {"user_id", "word_id"}))
public class SavedFlashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private AppUser appUser;

    @Column(name = "word_id", nullable = false)
    private Long wordId;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "word_id", insertable = false, updatable = false)
    private Word word;

    @Column(name = "easiness_factor", nullable = false)
    private Double easinessFactor = 2.5;

    @Column(nullable = false)
    private Integer repetitions = 0;

    @Column(name = "interval_days", nullable = false)
    private Integer intervalDays = 0;

    @Column(name = "next_review_at", nullable = false)
    private Instant nextReviewAt = Instant.now();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public Long getWordId() { return wordId; }
    public void setWordId(Long wordId) { this.wordId = wordId; }
    public Word getWord() { return word; }
    public void setWord(Word word) { this.word = word; }
    public Double getEasinessFactor() { return easinessFactor; }
    public void setEasinessFactor(Double easinessFactor) { this.easinessFactor = easinessFactor; }
    public Integer getRepetitions() { return repetitions; }
    public void setRepetitions(Integer repetitions) { this.repetitions = repetitions; }
    public Integer getIntervalDays() { return intervalDays; }
    public void setIntervalDays(Integer intervalDays) { this.intervalDays = intervalDays; }
    public Instant getNextReviewAt() { return nextReviewAt; }
    public void setNextReviewAt(Instant nextReviewAt) { this.nextReviewAt = nextReviewAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
