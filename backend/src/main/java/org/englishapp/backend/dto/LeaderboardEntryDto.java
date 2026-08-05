package org.englishapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class LeaderboardEntryDto {
    private int rank;
    private String deviceUuid;
    private String displayName;
    private int totalXp;
    private int currentStreak;
    private int wordsLearned;
}
