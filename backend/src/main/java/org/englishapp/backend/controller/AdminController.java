package org.englishapp.backend.controller;

import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.service.LeaderboardService;
import org.englishapp.backend.service.WordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final WordService wordService;
    private final LeaderboardService leaderboardService;

    public AdminController(WordService wordService, LeaderboardService leaderboardService) {
        this.wordService = wordService;
        this.leaderboardService = leaderboardService;
    }

    /** GET /api/admin/stats — returns total system stats */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "users", leaderboardService.countUsers(),
                "words", wordService.count(),
                "totalXp", leaderboardService.sumTotalXp()
        ));
    }

    /** POST /api/admin/words — create a new word */
    @PostMapping("/words")
    public ResponseEntity<WordDto> createWord(@RequestBody WordDto dto) {
        return ResponseEntity.ok(wordService.createWord(dto));
    }

    /** PUT /api/admin/words/{id} — update an existing word */
    @PutMapping("/words/{id}")
    public ResponseEntity<WordDto> updateWord(@PathVariable Long id, @RequestBody WordDto dto) {
        return ResponseEntity.ok(wordService.updateWord(id, dto));
    }

    /** DELETE /api/admin/words/{id} — delete a word */
    @DeleteMapping("/words/{id}")
    public ResponseEntity<Map<String, String>> deleteWord(@PathVariable Long id) {
        wordService.deleteWord(id);
        return ResponseEntity.ok(Map.of("message", "Word deleted successfully", "id", String.valueOf(id)));
    }

    /** POST /api/admin/users/{deviceUuid}/toggle-lock — lock or unlock user account */
    @PostMapping("/users/{deviceUuid}/toggle-lock")
    public ResponseEntity<Map<String, String>> toggleUserLock(@PathVariable String deviceUuid) {
        String newStatus = leaderboardService.toggleUserLock(deviceUuid);
        return ResponseEntity.ok(Map.of("deviceUuid", deviceUuid, "status", newStatus));
    }
}
