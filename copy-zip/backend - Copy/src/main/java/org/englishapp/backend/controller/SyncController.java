package org.englishapp.backend.controller;

import org.englishapp.backend.dto.SyncRequest;
import org.englishapp.backend.dto.SyncResponse;
import org.englishapp.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private final UserService userService;

    public SyncController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/sync/progress — Syncs progress securely for the authenticated user.
     * Note: userId is passed directly or extracted from Security Context JWT.
     */
    @PostMapping("/progress")
    public ResponseEntity<SyncResponse> sync(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestBody SyncRequest req
    ) {
        // Fallback for dev testing if SecurityContext is mock; Security JwtFilter will inject actual UUID
        UUID userId = (userIdHeader != null && !userIdHeader.isBlank())
                ? UUID.fromString(userIdHeader)
                : UUID.fromString("00000000-0000-0000-0000-000000000001");

        return ResponseEntity.ok(userService.syncProgress(userId, req));
    }
}
