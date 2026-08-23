package org.englishapp.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

import java.util.UUID;

public final class AuthenticatedUser {
    private AuthenticatedUser() {}

    public static UUID id() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationCredentialsNotFoundException("Authentication is required");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UUID uuid) {
            return uuid;
        }
        try {
            return UUID.fromString(authentication.getName());
        } catch (RuntimeException ex) {
            throw new AuthenticationCredentialsNotFoundException("JWT subject is not a UUID");
        }
    }
}
