package org.englishapp.backend.repository;

import org.englishapp.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, String> {}
