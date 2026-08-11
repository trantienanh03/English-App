package org.englishapp.backend.controller;

import org.englishapp.backend.dto.LeaderboardEntryDto;
import org.englishapp.backend.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    /**
     * Returns the top 50 users globally, sorted by XP descending.
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }
}
