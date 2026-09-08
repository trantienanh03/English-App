package org.englishapp.backend.service;

import org.englishapp.backend.dto.UserEntryDto;
import org.englishapp.backend.dto.UserProfileDto;
import org.englishapp.backend.entity.AppUser;
import org.englishapp.backend.repository.AppUserRepository;
import org.englishapp.backend.repository.SavedFlashcardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final AppUserRepository appUserRepository;
    private final SavedFlashcardRepository savedFlashcardRepository;

    public UserService(AppUserRepository appUserRepository, SavedFlashcardRepository savedFlashcardRepository) {
        this.appUserRepository = appUserRepository;
        this.savedFlashcardRepository = savedFlashcardRepository;
    }

    /**
     * Bootstrap User Profile & Progress if user record does not exist yet.
     */
    @Transactional
    public AppUser bootstrapUserIfAbsent(UUID userId, String defaultDisplayName, String defaultEmail) {
        return appUserRepository.findById(userId).orElseGet(() -> {
            String name = (defaultDisplayName != null && !defaultDisplayName.isBlank())
                    ? defaultDisplayName.trim()
                    : (defaultEmail != null && defaultEmail.contains("@"))
                        ? defaultEmail.split("@")[0]
                        : "Học Viên Vocam";

            AppUser newUser = new AppUser(userId, name, "LEARNER");
            return appUserRepository.save(newUser);
        });
    }

    /** GET /api/me — Returns User Profile & Learning Stats */
    @Transactional
    public UserProfileDto getUserProfile(UUID userId) {
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user is not registered"));

        if (Boolean.TRUE.equals(appUser.getLocked())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED");
        }

        int wordsSaved = Math.toIntExact(savedFlashcardRepository.countByUserId(userId));
        // wordsLearned: cards đạt thuộc thành thạo = repetitions >= 2 AND intervalDays >= 6
        int wordsLearned = Math.toIntExact(savedFlashcardRepository
                .countByUserIdAndRepetitionsGreaterThanEqualAndIntervalDaysGreaterThanEqual(userId, 2, 6));
        int dueCards = Math.toIntExact(savedFlashcardRepository.countByUserIdAndNextReviewAtLessThanEqual(userId, Instant.now()));

        return new UserProfileDto(
                appUser.getUserId(),
                appUser.getDisplayName(),
                appUser.getRole(),
                Boolean.TRUE.equals(appUser.getLocked()),
                wordsSaved,
                wordsLearned,
                dueCards
        );
    }

    /** POST /api/admin/users/{userId}/toggle-lock */
    @Transactional
    public String toggleUserLock(UUID userId) {
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        boolean newLockStatus = !Boolean.TRUE.equals(appUser.getLocked());
        appUser.setLocked(newLockStatus);
        appUserRepository.save(appUser);

        return newLockStatus ? "LOCKED" : "ACTIVE";
    }

    /** GET /api/admin/users — Returns list of registered users for Admin User Management */
    @Transactional(readOnly = true)
    public List<UserEntryDto> getAllUsers() {
        return appUserRepository.findAll().stream()
                .map(u -> {
                    int saved = Math.toIntExact(savedFlashcardRepository.countByUserId(u.getUserId()));
                    // wordsLearned: repetitions >= 2 AND intervalDays >= 6
                    int learned = Math.toIntExact(savedFlashcardRepository
                            .countByUserIdAndRepetitionsGreaterThanEqualAndIntervalDaysGreaterThanEqual(
                                    u.getUserId(), 2, 6));
                    return new UserEntryDto(
                            u.getUserId(),
                            u.getDisplayName(),
                            u.getRole(),
                            Boolean.TRUE.equals(u.getLocked()),
                            saved,
                            learned
                    );
                })
                .toList();
    }

    public long countUsers() {
        return appUserRepository.count();
    }

    public long countActiveUsers() {
        return appUserRepository.countByLockedFalse();
    }

    public long countLockedUsers() {
        return appUserRepository.countByLockedTrue();
    }
}
