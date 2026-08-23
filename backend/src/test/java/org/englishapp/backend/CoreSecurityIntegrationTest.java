package org.englishapp.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.englishapp.backend.entity.AppUser;
import org.englishapp.backend.entity.Lesson;
import org.englishapp.backend.entity.Word;
import org.englishapp.backend.repository.AppUserRepository;
import org.englishapp.backend.repository.LessonRepository;
import org.englishapp.backend.repository.SavedFlashcardRepository;
import org.englishapp.backend.repository.UserLessonProgressRepository;
import org.englishapp.backend.repository.WordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:vocam;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.flyway.enabled=false",
        "server.port=0",
        "supabase.jwt.secret=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "supabase.jwt.issuer=https://vocam-test.supabase.co/auth/v1",
        "supabase.jwt.audience=authenticated"
})
@AutoConfigureMockMvc
class CoreSecurityIntegrationTest {
    private static final String SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired AppUserRepository users;
    @Autowired LessonRepository lessons;
    @Autowired SavedFlashcardRepository flashcards;
    @Autowired UserLessonProgressRepository lessonProgress;
    @Autowired WordRepository words;

    @BeforeEach
    void cleanDatabase() {
        flashcards.deleteAll();
        lessonProgress.deleteAll();
        lessons.deleteAll();
        users.deleteAll();
        words.deleteAll();
    }

    @Test
    void learnerJwtCannotCallAdminEndpoint() throws Exception {
        String token = token(UUID.randomUUID(), "learner@example.com");
        mvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void signedTokenWithWrongIssuerIsRejected() throws Exception {
        Instant now = Instant.now();
        String wrongIssuer = Jwts.builder().subject(UUID.randomUUID().toString())
                .issuer("https://another-project.supabase.co/auth/v1").audience().add("authenticated").and()
                .issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(3600)))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8))).compact();
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + wrongIssuer))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("INVALID_TOKEN")));
    }

    @Test
    void privateLearningRoutesRejectMissingAuthentication() throws Exception {
        mvc.perform(get("/api/flashcards")).andExpect(status().isForbidden());
        mvc.perform(get("/api/lessons")).andExpect(status().isForbidden());
    }

    @Test
    void lockedUserIsRejectedOnSubsequentAuthenticatedRequest() throws Exception {
        UUID userId = UUID.randomUUID();
        String token = token(userId, "locked@example.com");
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + token)).andExpect(status().isOk());
        AppUser user = users.findById(userId).orElseThrow();
        user.setLocked(true);
        users.saveAndFlush(user);

        mvc.perform(get("/api/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("ACCOUNT_LOCKED")));
    }

    @Test
    void adminLockAndUnlockChangesSubsequentLearnerAccess() throws Exception {
        UUID adminId = UUID.randomUUID();
        UUID learnerId = UUID.randomUUID();
        users.saveAndFlush(new AppUser(adminId, "Admin", "ADMIN"));
        String adminToken = token(adminId, "admin-lock@example.com");
        String learnerToken = token(learnerId, "learner-lock@example.com");
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + learnerToken)).andExpect(status().isOk());

        mvc.perform(post("/api/admin/users/{id}/toggle-lock", learnerId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("LOCKED"));
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + learnerToken))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/admin/users/{id}/toggle-lock", learnerId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ACTIVE"));
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + learnerToken)).andExpect(status().isOk());
    }

    @Test
    void flashcardsAreOwnedDeduplicatedPersistedAndDueFiltered() throws Exception {
        UUID userA = UUID.randomUUID();
        UUID userB = UUID.randomUUID();
        String tokenA = token(userA, "a@example.com");
        String tokenB = token(userB, "b@example.com");
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + tokenA)).andExpect(status().isOk());
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + tokenB)).andExpect(status().isOk());
        Word word = canonicalWord("cup");

        String request = json.writeValueAsString(Map.of("vocabularyId", word.getId()));
        String first = mvc.perform(post("/api/flashcards").header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        mvc.perform(post("/api/flashcards").header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated());
        assertThat(flashcards.countByUserId(userA)).isEqualTo(1);

        mvc.perform(get("/api/flashcards").header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
        mvc.perform(get("/api/flashcards?due=true").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));

        long cardId = json.readTree(first).get("id").asLong();
        String reviewed = mvc.perform(post("/api/flashcards/{id}/review", cardId)
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"rating\":\"GOOD\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.repetitions").value(1))
                .andReturn().getResponse().getContentAsString();
        JsonNode reviewedCard = json.readTree(reviewed);
        assertThat(Instant.parse(reviewedCard.get("nextReviewAt").asText())).isAfter(Instant.now());
        mvc.perform(get("/api/flashcards?due=true").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));

        mvc.perform(post("/api/flashcards/{id}/review", cardId)
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"rating\":\"EASY\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.repetitions").value(2))
                .andExpect(jsonPath("$.interval").value(8));
        mvc.perform(post("/api/flashcards/{id}/review", cardId)
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"rating\":\"AGAIN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.repetitions").value(0))
                .andExpect(jsonPath("$.interval").value(1));
        mvc.perform(delete("/api/flashcards/{id}", cardId).header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound());
    }

    @Test
    void lessonVocabularyAndProgressRemainScopedToSelectedLessonAndUser() throws Exception {
        UUID userA = UUID.randomUUID();
        UUID userB = UUID.randomUUID();
        String tokenA = token(userA, "lesson-a@example.com");
        String tokenB = token(userB, "lesson-b@example.com");
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + tokenA)).andExpect(status().isOk());
        mvc.perform(get("/api/me").header("Authorization", "Bearer " + tokenB)).andExpect(status().isOk());

        Word cup = canonicalWord("cup");
        Lesson lesson = new Lesson();
        lesson.setId("kitchen-test");
        lesson.setName("Kitchen test");
        lesson.setDescription("Kitchen vocabulary");
        lesson.setDifficulty("Sơ cấp");
        lesson.setCategory("Kitchen");
        lesson.setIcon("coffee");
        lesson.getWords().add(cup);
        lessons.saveAndFlush(lesson);

        mvc.perform(get("/api/lessons").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("kitchen-test"))
                .andExpect(jsonPath("$[0].progress").value(0))
                .andExpect(jsonPath("$[0].words.length()").value(1))
                .andExpect(jsonPath("$[0].words[0].detectionLabel").value("cup"));

        mvc.perform(put("/api/lessons/kitchen-test/progress")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":80}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.progress").value(80));
        mvc.perform(get("/api/lessons").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].progress").value(80));
        mvc.perform(get("/api/lessons").header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].progress").value(0));
        mvc.perform(put("/api/lessons/kitchen-test/progress")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":101}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void adminVocabularyUpdateIsVisibleWhileCanonicalLabelCannotChange() throws Exception {
        UUID adminId = UUID.randomUUID();
        users.saveAndFlush(new AppUser(adminId, "Admin", "ADMIN"));
        Word word = canonicalWord("cup");
        String payload = """
                {"detectionLabel":"tampered-label","enWord":"cup","translation":"chiếc cốc mới"}
                """;

        mvc.perform(put("/api/admin/words/{id}", word.getId())
                        .header("Authorization", "Bearer " + token(adminId, "admin@example.com"))
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.translation").value("chiếc cốc mới"))
                .andExpect(jsonPath("$.detectionLabel").value("cup"));
        mvc.perform(get("/api/words/cup"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.translation").value("chiếc cốc mới"));
        mvc.perform(put("/api/admin/words/{id}", word.getId())
                        .header("Authorization", "Bearer " + token(adminId, "admin@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"enWord\":\"cup\",\"translation\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    private Word canonicalWord(String label) {
        Word word = new Word();
        word.setDetectionLabel(label);
        word.setEnWord(label);
        word.setTranslation("cái cốc");
        word.setPos("Noun");
        return words.saveAndFlush(word);
    }

    private String token(UUID subject, String email) {
        Instant now = Instant.now();
        return Jwts.builder().subject(subject.toString()).claim("email", email)
                .claim("user_metadata", Map.of("display_name", email.split("@")[0]))
                .issuer("https://vocam-test.supabase.co/auth/v1").audience().add("authenticated").and()
                .issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(3600)))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8))).compact();
    }
}
