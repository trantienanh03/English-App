package org.englishapp.backend.repository;

import org.englishapp.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {

    Optional<UserProgress> findByUserId(UUID userId);

    /** Top N users sorted by XP for global leaderboard */
    @Query("SELECT u FROM UserProgress u ORDER BY u.totalXp DESC LIMIT :limit")
    List<UserProgress> findTopByXp(int limit);

    /** Count users with strictly more XP than :xp */
    long countByTotalXpGreaterThan(int xp);

    @Query("SELECT COALESCE(SUM(u.totalXp), 0) FROM UserProgress u")
    long sumTotalXp();
}
