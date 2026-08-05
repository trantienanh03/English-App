package org.englishapp.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.englishapp.backend.dto.SyncRequest;
import org.englishapp.backend.dto.SyncResponse;
import org.englishapp.backend.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {

    private final LeaderboardService leaderboardService;

    /**
     * Receives the user's accumulated local progress and upserts it.
     * Called by the app whenever network becomes available.
     */
    @PostMapping("/progress")
    public ResponseEntity<SyncResponse> syncProgress(@Valid @RequestBody SyncRequest request) {
        SyncResponse response = leaderboardService.sync(request);
        return ResponseEntity.ok(response);
    }
}
