package org.englishapp.backend.dto;

public class SyncRequest {
    private String displayName;
    private int wordsSaved;
    private int wordsLearned;

    public SyncRequest() {}

    public SyncRequest(String displayName, int wordsSaved, int wordsLearned) {
        this.displayName = displayName;
        this.wordsSaved = wordsSaved;
        this.wordsLearned = wordsLearned;
    }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getWordsSaved() { return wordsSaved; }
    public void setWordsSaved(int wordsSaved) { this.wordsSaved = wordsSaved; }

    public int getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(int wordsLearned) { this.wordsLearned = wordsLearned; }
}
