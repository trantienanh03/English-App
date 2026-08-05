package org.englishapp.backend.service;

import lombok.RequiredArgsConstructor;
import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.entity.Word;
import org.englishapp.backend.repository.WordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

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
