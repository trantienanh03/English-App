package org.englishapp.backend.dto;

import java.util.UUID;

public class UserProfileDto {
    private UUID userId;
    private String displayName;
    private String role;
    private boolean locked;
    private int wordsSaved;
    private int wordsLearned;
    private int dueCards;

    public UserProfileDto() {}

    public UserProfileDto(UUID userId, String displayName, String role, boolean locked, int wordsSaved, int wordsLearned, int dueCards) {
        this.userId = userId;
        this.displayName = displayName;
        this.role = role;
        this.locked = locked;
        this.wordsSaved = wordsSaved;
        this.wordsLearned = wordsLearned;
        this.dueCards = dueCards;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }

    public int getWordsSaved() { return wordsSaved; }
    public void setWordsSaved(int wordsSaved) { this.wordsSaved = wordsSaved; }

    public int getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(int wordsLearned) { this.wordsLearned = wordsLearned; }
    public int getDueCards() { return dueCards; }
    public void setDueCards(int dueCards) { this.dueCards = dueCards; }
}
