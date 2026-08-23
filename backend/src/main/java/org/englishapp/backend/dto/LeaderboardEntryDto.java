package org.englishapp.backend.dto;

public class LeaderboardEntryDto {
    private int rank;
    private String deviceUuid;
    private String displayName;
    private int totalXp;
    private int currentStreak;
    private int wordsLearned;
    private String status;

    public LeaderboardEntryDto() {}

    public LeaderboardEntryDto(int rank, String deviceUuid, String displayName, int totalXp, int currentStreak, int wordsLearned, String status) {
        this.rank = rank;
        this.deviceUuid = deviceUuid;
        this.displayName = displayName;
        this.totalXp = totalXp;
        this.currentStreak = currentStreak;
        this.wordsLearned = wordsLearned;
        this.status = status;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public String getDeviceUuid() { return deviceUuid; }
    public void setDeviceUuid(String deviceUuid) { this.deviceUuid = deviceUuid; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getTotalXp() { return totalXp; }
    public void setTotalXp(int totalXp) { this.totalXp = totalXp; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(int wordsLearned) { this.wordsLearned = wordsLearned; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
