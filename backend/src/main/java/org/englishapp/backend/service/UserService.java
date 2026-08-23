package org.englishapp.backend.service;

import org.englishapp.backend.dto.SyncRequest;
import org.englishapp.backend.dto.SyncResponse;
import org.englishapp.backend.dto.UserProfileDto;
import org.englishapp.backend.entity.AppUser;
import org.englishapp.backend.entity.UserProgress;
import org.englishapp.backend.repository.AppUserRepository;
import org.englishapp.backend.repository.UserProgressRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class UserService {

    private final AppUserRepository appUserRepository;
    private final UserProgressRepository userProgressRepository;

    public UserService(AppUserRepository appUserRepository, UserProgressRepository userProgressRepository) {
        this.appUserRepository = appUserRepository;
        this.userProgressRepository = userProgressRepository;
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
            AppUser savedUser = appUserRepository.save(newUser);

            UserProgress newProgress = new UserProgress(userId);
            newProgress.setAppUser(savedUser);
            userProgressRepository.save(newProgress);

            return savedUser;
        });
    }

    /** GET /api/me — Returns User Profile & Learning Stats */
    @Transactional
    public UserProfileDto getUserProfile(UUID userId, String defaultDisplayName, String defaultEmail) {
        AppUser appUser = bootstrapUserIfAbsent(userId, defaultDisplayName, defaultEmail);

        if (Boolean.TRUE.equals(appUser.getLocked())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED");
        }

        UserProgress progress = userProgressRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProgress p = new UserProgress(userId);
                    p.setAppUser(appUser);
                    return userProgressRepository.save(p);
                });

        return new UserProfileDto(
                appUser.getUserId(),
                appUser.getDisplayName(),
                appUser.getRole(),
                Boolean.TRUE.equals(appUser.getLocked()),
                progress.getWordsSaved(),
                progress.getWordsLearned()
        );
    }

    /** POST /api/sync/progress — Sync learning progress securely */
    @Transactional
    public SyncResponse syncProgress(UUID userId, SyncRequest req) {
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (Boolean.TRUE.equals(appUser.getLocked())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ACCOUNT_LOCKED");
        }

        UserProgress progress = userProgressRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProgress p = new UserProgress(userId);
                    p.setAppUser(appUser);
                    return p;
                });

        if (req.getDisplayName() != null && !req.getDisplayName().isBlank()) {
            appUser.setDisplayName(req.getDisplayName().trim());
            appUserRepository.save(appUser);
        }

        progress.setWordsSaved(req.getWordsSaved());
        progress.setWordsLearned(req.getWordsLearned());
        progress.setLastSyncAt(Instant.now());

        userProgressRepository.save(progress);

        return new SyncResponse("ok");
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
