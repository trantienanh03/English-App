package org.englishapp.backend.repository;

import org.englishapp.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    Optional<UserProgress> findByDeviceUuid(String deviceUuid);

    /** Top N users sorted by XP for global leaderboard */
    @Query("SELECT u FROM UserProgress u ORDER BY u.totalXp DESC LIMIT :limit")
    List<UserProgress> findTopByXp(int limit);

    /** Count users with more XP than :xp — used for efficient rank calculation */
    long countByTotalXpGreaterThan(int xp);

    @Query("SELECT COALESCE(SUM(u.totalXp), 0) FROM UserProgress u")
    long sumTotalXp();
}
