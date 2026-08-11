package org.englishapp.backend.service;

import org.englishapp.backend.dto.LeaderboardEntryDto;
import org.englishapp.backend.dto.SyncRequest;
import org.englishapp.backend.dto.SyncResponse;
import org.englishapp.backend.entity.UserProgress;
import org.englishapp.backend.repository.UserProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LeaderboardService {

    private static final int TOP_LIMIT = 50;

    private final UserProgressRepository userProgressRepository;

    public LeaderboardService(UserProgressRepository userProgressRepository) {
        this.userProgressRepository = userProgressRepository;
    }

    @Transactional
    public SyncResponse sync(SyncRequest req) {
        // Upsert: create or update the user's progress record
        UserProgress progress = userProgressRepository
                .findByDeviceUuid(req.getDeviceUuid())
                .orElseGet(() -> {
                    UserProgress p = new UserProgress();
                    p.setDeviceUuid(req.getDeviceUuid());
                    return p;
                });

        progress.setDisplayName(req.getDisplayName());
        progress.setTotalXp(req.getTotalXp());
        progress.setCurrentStreak(req.getCurrentStreak());
        progress.setWordsLearned(req.getWordsLearned());
        progress.setLastSyncAt(Instant.now());

        // Keep the longest streak recorded
        if (req.getLongestStreak() > progress.getLongestStreak()) {
            progress.setLongestStreak(req.getLongestStreak());
        }

        userProgressRepository.save(progress);

        // Calculate current rank for the response
        int rank = calculateRank(req.getDeviceUuid(), req.getTotalXp());
        return new SyncResponse("ok", rank);
    }

    public List<LeaderboardEntryDto> getLeaderboard() {
        List<UserProgress> top = userProgressRepository.findTopByXp(TOP_LIMIT);

        AtomicInteger counter = new AtomicInteger(1);
        return top.stream()
                .map(u -> new LeaderboardEntryDto(
                        counter.getAndIncrement(),
                        u.getDeviceUuid(),
                        u.getDisplayName(),
                        u.getTotalXp(),
                        u.getCurrentStreak(),
                        u.getWordsLearned()
                ))
                .toList();
    }

    // Count how many users have more XP than this user (+1 = their rank)
    private int calculateRank(String deviceUuid, int xp) {
        long ahead = userProgressRepository.findAll()
                .stream()
                .filter(u -> !u.getDeviceUuid().equals(deviceUuid) && u.getTotalXp() > xp)
                .count();
        return (int) ahead + 1;
    }
}
