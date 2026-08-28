package org.englishapp.backend.service;

import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.entity.Word;
import org.englishapp.backend.repository.WordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WordService {

    private final WordRepository wordRepository;

    public WordService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public List<WordDto> findAll() {
        return wordRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public WordDto findByDetectionLabel(String detectionLabel) {
        return wordRepository.findByDetectionLabel(normalizeLabel(detectionLabel))
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No vocabulary found for detector label: " + detectionLabel
                ));
    }

    public long count() {
        return wordRepository.count();
    }

    public WordDto createWord(WordDto dto) {
        Word word = new Word();
        if (dto.getDetectionLabel() == null || dto.getDetectionLabel().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "detectionLabel is required");
        }
        word.setDetectionLabel(normalizeLabel(dto.getDetectionLabel()));
        updateEntityFromDto(word, dto);
        Word saved = wordRepository.save(word);
        return toDto(saved);
    }

    public WordDto updateWord(Long id, WordDto dto) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Word not found: " + id));
        
        // Canonical coco_class label is protected and read-only to preserve YOLO mapping!
        updateEntityFromDto(word, dto);
        Word updated = wordRepository.save(word);
        return toDto(updated);
    }

    private void updateEntityFromDto(Word word, WordDto dto) {
        if (dto.getEnWord() != null) word.setEnWord(dto.getEnWord().trim());
        if (dto.getPhonetic() != null) word.setPhonetic(dto.getPhonetic().trim());
        if (dto.getPos() != null) word.setPos(dto.getPos().trim());
        if (dto.getDefinition() != null) word.setDefinition(dto.getDefinition().trim());
        if (dto.getTranslation() != null) word.setTranslation(dto.getTranslation().trim());
        if (dto.getExampleEn() != null) word.setExampleEn(dto.getExampleEn().trim());
        if (dto.getExampleVn() != null) word.setExampleVn(dto.getExampleVn().trim());
        if (dto.getImageUrl() != null) word.setImageUrl(dto.getImageUrl().trim());
    }

    public WordDto toDto(Word w) {
        return new WordDto(
                w.getId(),
                w.getDetectionLabel(),
                w.getEnWord(),
                w.getPhonetic(),
                w.getPos(),
                w.getDefinition(),
                w.getTranslation(),
                w.getExampleEn(),
                w.getExampleVn(),
                w.getImageUrl()
        );
    }

    public void updateExampleSentences(String detectionLabel, String exampleEn, String exampleVn) {
        wordRepository.findByDetectionLabel(normalizeLabel(detectionLabel)).ifPresent(word -> {
            word.setExampleEn(exampleEn.trim());
            word.setExampleVn(exampleVn.trim());
            wordRepository.save(word);
        });
    }

    public void updateFullDetails(String detectionLabel, String translation, String phonetic, String pos, String definition, String exampleEn, String exampleVn) {
        wordRepository.findByDetectionLabel(normalizeLabel(detectionLabel)).ifPresent(word -> {
            if (translation != null) word.setTranslation(translation.trim());
            if (phonetic != null) word.setPhonetic(phonetic.trim());
            if (pos != null) word.setPos(pos.trim());
            if (definition != null) word.setDefinition(definition.trim());
            if (exampleEn != null) word.setExampleEn(exampleEn.trim());
            if (exampleVn != null) word.setExampleVn(exampleVn.trim());
            wordRepository.save(word);
        });
    }

    private String normalizeLabel(String label) {
        return label.toLowerCase().trim().replaceAll("\\s+", " ");
    }
}
