package org.englishapp.backend.dto;

import java.util.UUID;

public class LeaderboardEntryDto {
    private int rank;
    private UUID userId;
    private String displayName;
    private int totalXp;
    private int currentStreak;
    private int wordsLearned;
    private String role;
    private boolean locked;

    public LeaderboardEntryDto() {}

    public LeaderboardEntryDto(int rank, UUID userId, String displayName, int totalXp, int currentStreak, int wordsLearned, String role, boolean locked) {
        this.rank = rank;
        this.userId = userId;
        this.displayName = displayName;
        this.totalXp = totalXp;
        this.currentStreak = currentStreak;
        this.wordsLearned = wordsLearned;
        this.role = role;
        this.locked = locked;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getTotalXp() { return totalXp; }
    public void setTotalXp(int totalXp) { this.totalXp = totalXp; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(int wordsLearned) { this.wordsLearned = wordsLearned; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }
}
