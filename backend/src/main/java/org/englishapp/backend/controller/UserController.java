package org.englishapp.backend.controller;

import org.englishapp.backend.dto.UserProfileDto;
import org.englishapp.backend.service.UserService;
import org.englishapp.backend.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/me — Returns user profile & role.
     * Bootstrap user if first time request.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMe() {
        return ResponseEntity.ok(userService.getUserProfile(AuthenticatedUser.id()));
    }
}
