package org.englishapp.backend.dto;

import java.util.UUID;

public class UserProfileDto {
    private UUID userId;
    private String displayName;
    private String role;
    private boolean locked;
    private int totalXp;
    private int currentStreak;
    private int longestStreak;
    private int wordsSaved;
    private int wordsLearned;

    public UserProfileDto() {}

    public UserProfileDto(UUID userId, String displayName, String role, boolean locked, int totalXp, int currentStreak, int longestStreak, int wordsSaved, int wordsLearned) {
        this.userId = userId;
        this.displayName = displayName;
        this.role = role;
        this.locked = locked;
        this.totalXp = totalXp;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.wordsSaved = wordsSaved;
        this.wordsLearned = wordsLearned;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }

    public int getTotalXp() { return totalXp; }
    public void setTotalXp(int totalXp) { this.totalXp = totalXp; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public int getWordsSaved() { return wordsSaved; }
    public void setWordsSaved(int wordsSaved) { this.wordsSaved = wordsSaved; }

    public int getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(int wordsLearned) { this.wordsLearned = wordsLearned; }
}
