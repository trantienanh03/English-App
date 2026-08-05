package org.englishapp.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SyncRequest {

    @NotBlank(message = "deviceUuid is required")
    @Size(max = 36, message = "deviceUuid must be a valid UUID")
    private String deviceUuid;

    @NotBlank(message = "displayName is required")
    @Size(max = 100)
    private String displayName;

    @Min(0)
    private int totalXp;

    @Min(0)
    private int currentStreak;

    @Min(0)
    private int longestStreak;

    @Min(0)
    private int wordsLearned;

    public SyncRequest() {}

    public String getDeviceUuid() { return deviceUuid; }
    public void setDeviceUuid(String deviceUuid) { this.deviceUuid = deviceUuid; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getTotalXp() { return totalXp; }
    public void setTotalXp(int totalXp) { this.totalXp = totalXp; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public int getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(int wordsLearned) { this.wordsLearned = wordsLearned; }
}
