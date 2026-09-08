package org.englishapp.backend.controller;

import jakarta.validation.Valid;
import org.englishapp.backend.dto.FlashcardDto;
import org.englishapp.backend.dto.ReviewFlashcardRequest;
import org.englishapp.backend.dto.SaveFlashcardRequest;
import org.englishapp.backend.security.AuthenticatedUser;
import org.englishapp.backend.service.FlashcardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {
    private final FlashcardService service;

    public FlashcardController(FlashcardService service) { this.service = service; }

    @GetMapping
    public List<FlashcardDto> findAll(@RequestParam(defaultValue = "false") boolean due) {
        return service.findAll(AuthenticatedUser.id(), due);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FlashcardDto save(@Valid @RequestBody SaveFlashcardRequest request) {
        return service.save(AuthenticatedUser.id(), request.getVocabularyId());
    }

    @PostMapping("/{id}/review")
    public FlashcardDto review(@PathVariable Long id, @Valid @RequestBody ReviewFlashcardRequest request) {
        return service.review(AuthenticatedUser.id(), id, request.getRating());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(AuthenticatedUser.id(), id); }
}
