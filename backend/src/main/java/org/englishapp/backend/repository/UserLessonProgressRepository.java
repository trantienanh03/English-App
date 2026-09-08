package org.englishapp.backend.repository;

import org.englishapp.backend.entity.UserLessonProgress;
import org.englishapp.backend.entity.UserLessonProgressId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, UserLessonProgressId> {
    List<UserLessonProgress> findAllByIdUserId(UUID userId);
}
