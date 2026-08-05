package org.englishapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class SyncResponse {
    private String status;   // "ok"
    private int rank;        // user's current leaderboard rank
}
