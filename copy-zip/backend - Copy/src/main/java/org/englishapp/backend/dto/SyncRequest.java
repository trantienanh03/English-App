package org.englishapp.backend.dto;

public class SyncRequest {
    private String displayName;
    private int totalXp;
    private int currentStreak;
    private int longestStreak;
    private int wordsSaved;
    private int wordsLearned;

    public SyncRequest() {}

    public SyncRequest(String displayName, int totalXp, int currentStreak, int longestStreak, int wordsSaved, int wordsLearned) {
        this.displayName = displayName;
        this.totalXp = totalXp;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.wordsSaved = wordsSaved;
        this.wordsLearned = wordsLearned;
    }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

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
