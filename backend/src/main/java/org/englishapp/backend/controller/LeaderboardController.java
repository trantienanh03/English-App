package org.englishapp.backend.controller;

import lombok.RequiredArgsConstructor;
import org.englishapp.backend.dto.LeaderboardEntryDto;
import org.englishapp.backend.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    /**
     * Returns the top 50 users globally, sorted by XP descending.
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }
}
