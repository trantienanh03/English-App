package org.englishapp.backend.repository;

import org.englishapp.backend.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByUserId(UUID userId);
    long countByLockedTrue();
    long countByLockedFalse();
}
