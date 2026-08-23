package org.englishapp.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgress {
    @EmbeddedId
    private UserLessonProgressId id;

    @Column(name = "best_score", nullable = false)
    private Integer bestScore = 0;

    @Column(name = "last_score", nullable = false)
    private Integer lastScore = 0;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public UserLessonProgress() {}
    public UserLessonProgress(UserLessonProgressId id) { this.id = id; }

    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
    public UserLessonProgressId getId() { return id; }
    public Integer getBestScore() { return bestScore; }
    public void setBestScore(Integer bestScore) { this.bestScore = bestScore; }
    public Integer getLastScore() { return lastScore; }
    public void setLastScore(Integer lastScore) { this.lastScore = lastScore; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
