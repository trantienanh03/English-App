package org.englishapp.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "user_progress")
@Getter @Setter @NoArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UUID generated on first app launch, stored in AsyncStorage on the device
    @Column(name = "device_uuid", nullable = false, unique = true, length = 36)
    private String deviceUuid;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName = "Người dùng";

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private Integer longestStreak = 0;

    @Column(name = "words_learned", nullable = false)
    private Integer wordsLearned = 0;

    @Column(name = "last_sync_at")
    private Instant lastSyncAt;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
