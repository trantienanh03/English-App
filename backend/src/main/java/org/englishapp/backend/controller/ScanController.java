package org.englishapp.backend.controller;

import org.englishapp.backend.dto.WordDto;
import org.englishapp.backend.service.WordService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/scan")
public class ScanController {

    private final WordService wordService;
    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public ScanController(WordService wordService) {
        this.wordService = wordService;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5_000);
        requestFactory.setReadTimeout(45_000);
        this.restTemplate = new RestTemplate(requestFactory);
    }

    /**
     * POST /api/scan — Spring Boot Gateway forwarding image to FastAPI AI Service.
     * Enriches YOLO detected labels with PostgreSQL 365 vocabulary data (IPA, translation, definition, example sentences).
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> scanImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "confidence", defaultValue = "0.25") float confidence
    ) {
        if (file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "INVALID_IMAGE", "message", "A non-empty image file is required."));
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "scan.jpg";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileAsResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String targetUrl = aiServiceUrl + "/predict-multi?confidence_threshold=" + confidence + "&generate_sentence=true";
            ResponseEntity<Map> aiResponse = restTemplate.exchange(targetUrl, HttpMethod.POST, requestEntity, Map.class);

            if (!aiResponse.getStatusCode().is2xxSuccessful() || aiResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "AI Service Unavailable"));
            }

            Map<String, Object> aiBody = aiResponse.getBody();
            List<Map<String, Object>> rawPredictions = (List<Map<String, Object>>) aiBody.get("predictions");

            List<Map<String, Object>> enrichedPredictions = new ArrayList<>();
            if (rawPredictions != null) {
                for (Map<String, Object> pred : rawPredictions) {
                    String label = (String) pred.get("label");
                    Map<String, Object> enriched = new HashMap<>(pred);

                    try {
                        WordDto wordDto = wordService.findByDetectionLabel(label);
                        String geminiSentenceEn = (String) pred.get("sentence_en");
                        String geminiSentenceVn = (String) pred.get("sentence_vn");
                        if (geminiSentenceEn != null && !geminiSentenceEn.isEmpty()) {
                            wordDto.setExampleEn(geminiSentenceEn);
                            wordDto.setExampleVn(geminiSentenceVn);
                            wordService.updateExampleSentences(label, geminiSentenceEn, geminiSentenceVn);
                        }
                        enriched.put("wordData", wordDto);
                    } catch (org.springframework.web.server.ResponseStatusException notMapped) {
                        // Keep the detection visible, but never present fabricated vocabulary as a real DB record.
                    }

                    enrichedPredictions.add(enriched);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageWidth", aiBody.getOrDefault("image_width", 1920));
            response.put("imageHeight", aiBody.getOrDefault("image_height", 1080));
            response.put("predictions", enrichedPredictions);
            response.put("contextualSentence", aiBody.get("contextual_sentence"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "AI_SERVICE_UNAVAILABLE", "message", "The object detection service is temporarily unavailable."));
        }
    }
}
