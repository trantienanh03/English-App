package org.englishapp.backend.controller;

import org.englishapp.backend.dto.UserProfileDto;
import org.englishapp.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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
    public ResponseEntity<UserProfileDto> getMe(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestHeader(value = "X-User-Name", required = false) String userNameHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmailHeader
    ) {
        UUID userId = (userIdHeader != null && !userIdHeader.isBlank())
                ? UUID.fromString(userIdHeader)
                : UUID.fromString("00000000-0000-0000-0000-000000000001");

        return ResponseEntity.ok(userService.getUserProfile(userId, userNameHeader, userEmailHeader));
    }
}
