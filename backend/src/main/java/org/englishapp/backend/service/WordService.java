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
        return wordRepository.findByCocoClass(cocoClass.toLowerCase())
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
        updateEntityFromDto(word, dto);
        Word saved = wordRepository.save(word);
        return toDto(saved);
    }

    public WordDto updateWord(Long id, WordDto dto) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Word not found: " + id));
        updateEntityFromDto(word, dto);
        Word updated = wordRepository.save(word);
        return toDto(updated);
    }

    public void deleteWord(Long id) {
        if (!wordRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Word not found: " + id);
        }
        wordRepository.deleteById(id);
    }

    private void updateEntityFromDto(Word word, WordDto dto) {
        if (dto.cocoClass() != null) word.setCocoClass(dto.cocoClass().toLowerCase().trim());
        if (dto.enWord() != null) word.setEnWord(dto.enWord().trim());
        if (dto.phonetic() != null) word.setPhonetic(dto.phonetic().trim());
        if (dto.pos() != null) word.setPos(dto.pos().trim());
        if (dto.definition() != null) word.setDefinition(dto.definition().trim());
        if (dto.translation() != null) word.setTranslation(dto.translation().trim());
        if (dto.exampleEn() != null) word.setExampleEn(dto.exampleEn().trim());
        if (dto.exampleVn() != null) word.setExampleVn(dto.exampleVn().trim());
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
                w.getExampleVn()
        );
    }
}
