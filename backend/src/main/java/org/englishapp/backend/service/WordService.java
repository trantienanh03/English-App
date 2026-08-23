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

    public WordDto findByCocoClass(String cocoClass) {
        return wordRepository.findByCocoClass(cocoClass.toLowerCase().trim())
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No vocabulary found for class: " + cocoClass
                ));
    }

    public long count() {
        return wordRepository.count();
    }

    public WordDto createWord(WordDto dto) {
        Word word = new Word();
        if (dto.getCocoClass() != null) {
            word.setCocoClass(dto.getCocoClass().toLowerCase().trim());
        }
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

    private WordDto toDto(Word w) {
        return new WordDto(
                w.getId(),
                w.getCocoClass(),
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
}
