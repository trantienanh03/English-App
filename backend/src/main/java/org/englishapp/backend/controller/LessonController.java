package org.englishapp.backend.controller;

import jakarta.validation.Valid;
import org.englishapp.backend.dto.LessonDto;
import org.englishapp.backend.dto.LessonProgressRequest;
import org.englishapp.backend.security.AuthenticatedUser;
import org.englishapp.backend.service.LessonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonService service;
    public LessonController(LessonService service) { this.service = service; }

    @GetMapping
    public List<LessonDto> findAll() { return service.findAll(AuthenticatedUser.id()); }

    @PutMapping("/{lessonId}/progress")
    public LessonDto recordScore(@PathVariable String lessonId, @Valid @RequestBody LessonProgressRequest request) {
        return service.recordScore(AuthenticatedUser.id(), lessonId, request.getScore());
    }
}
