package org.englishapp.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.englishapp.backend.entity.AppUser;
import org.englishapp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final UserService userService;

    @Value("${supabase.jwt.secret:super-secret-jwt-key-for-supabase-development-mode-environment}")
    private String jwtSecret;

    public JwtFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();

            try {
                Claims claims = parseClaims(token);
                String sub = claims.getSubject();
                if (sub != null) {
                    UUID userId = UUID.fromString(sub);
                    String email = claims.get("email", String.class);
                    
                    Map<String, Object> userMetadata = claims.get("user_metadata", Map.class);
                    String name = userMetadata != null ? (String) userMetadata.get("display_name") : null;

                    // Bootstrap or load user from DB
                    AppUser appUser = userService.bootstrapUserIfAbsent(userId, name, email);

                    // Check if user is locked
                    if (Boolean.TRUE.equals(appUser.getLocked())) {
                        sendAccountLockedError(response);
                        return;
                    }

                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + appUser.getRole()));
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, token, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"code\":\"INVALID_TOKEN\",\"message\":\"" + e.getMessage() + "\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Claims parseClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private void sendAccountLockedError(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":\"ACCOUNT_LOCKED\",\"message\":\"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên.\"}");
    }
}
