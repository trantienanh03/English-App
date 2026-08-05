package org.englishapp.backend.controller;

import lombok.RequiredArgsConstructor;
import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.service.WordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    /**
     * Returns all 80 COCO words.
     * The app calls this once on first launch and caches everything in SQLite.
     */
    @GetMapping
    public ResponseEntity<List<WordDto>> getAll() {
        return ResponseEntity.ok(wordService.findAll());
    }

    /**
     * Looks up a word by its YOLO detection class name.
     * Example: GET /api/words/cup
     */
    @GetMapping("/{cocoClass}")
    public ResponseEntity<WordDto> getByCocoClass(@PathVariable String cocoClass) {
        return ResponseEntity.ok(wordService.findByCocoClass(cocoClass));
    }
}
