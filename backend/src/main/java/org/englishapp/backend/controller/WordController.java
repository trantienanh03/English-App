package org.englishapp.backend.controller;

import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.service.WordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    /** Returns the canonical Objects365 vocabulary. */
    @GetMapping
    public ResponseEntity<List<WordDto>> getAll() {
        return ResponseEntity.ok(wordService.findAll());
    }

    /**
     * Looks up a word by its YOLO detection class name.
     * Example: GET /api/words/cup
     */
    @GetMapping("/{detectionLabel}")
    public ResponseEntity<WordDto> getByDetectionLabel(@PathVariable String detectionLabel) {
        return ResponseEntity.ok(wordService.findByDetectionLabel(detectionLabel));
    }
}
