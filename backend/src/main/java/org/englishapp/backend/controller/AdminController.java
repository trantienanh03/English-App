package org.englishapp.backend.controller;

import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.service.UserService;
import org.englishapp.backend.service.WordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final WordService wordService;
    private final UserService userService;

    public AdminController(WordService wordService, UserService userService) {
        this.wordService = wordService;
        this.userService = userService;
    }

    /** GET /api/admin/stats — returns total system stats for mobile admin dashboard */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalUsers", userService.countUsers(),
                "activeUsers", userService.countActiveUsers(),
                "lockedUsers", userService.countLockedUsers(),
                "totalWords", wordService.count()
        ));
    }

    /** POST /api/admin/words — create or update canonical word */
    @PostMapping("/words")
    public ResponseEntity<WordDto> createWord(@RequestBody WordDto dto) {
        return ResponseEntity.ok(wordService.createWord(dto));
    }

    /** PUT /api/admin/words/{id} — update canonical word content/image */
    @PutMapping("/words/{id}")
    public ResponseEntity<WordDto> updateWord(@PathVariable Long id, @RequestBody WordDto dto) {
        return ResponseEntity.ok(wordService.updateWord(id, dto));
    }

    /** POST /api/admin/users/{userId}/toggle-lock — lock or unlock user account */
    @PostMapping("/users/{userId}/toggle-lock")
    public ResponseEntity<Map<String, String>> toggleUserLock(@PathVariable UUID userId) {
        String newStatus = userService.toggleUserLock(userId);
        return ResponseEntity.ok(Map.of("userId", userId.toString(), "status", newStatus));
    }
}
