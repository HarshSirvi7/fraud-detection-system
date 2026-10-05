package com.frauddetection.fraud_api.service;

import com.frauddetection.fraud_api.dto.AuthRequest;
import com.frauddetection.fraud_api.model.AppUser;
import com.frauddetection.fraud_api.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final int TOKEN_TTL_SECONDS = 3600;
    private final UserRepository users;
    private final byte[] jwtSecret;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository users, @Value("${app.jwt-secret:dev-only-change-this-secret-to-a-long-random-value-please}") String jwtSecret) {
        this.users = users;
        this.jwtSecret = jwtSecret.getBytes(StandardCharsets.UTF_8);
    }

    public Map<String, Object> signup(AuthRequest request) {
        String email = normalizeEmail(request.email());
        validatePassword(request.password());
        if (request.name() == null || request.name().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required.");
        if (users.existsById(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        AppUser user = users.save(new AppUser(email, request.name().trim(), hashPassword(request.password())));
        return authResponse(user);
    }

    public Map<String, Object> login(AuthRequest request) {
        String email = normalizeEmail(request.email());
        AppUser user = users.findById(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!verifyPassword(request.password(), user.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        return authResponse(user);
    }

    private Map<String, Object> authResponse(AppUser user) {
        return Map.of("accessToken", createToken(user), "tokenType", "Bearer", "expiresIn", TOKEN_TTL_SECONDS,
                "user", Map.of("name", user.getName(), "email", user.getEmail()));
    }

    private String normalizeEmail(String email) {
        if (email == null || !email.matches("(?i)^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        return email.trim().toLowerCase();
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters.");
    }

    private String hashPassword(String password) {
        byte[] salt = new byte[16]; random.nextBytes(salt);
        byte[] derived = derive(password, salt);
        return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(derived);
    }

    private boolean verifyPassword(String password, String encoded) {
        if (password == null) return false;
        String[] parts = encoded.split(":", 2);
        try { return MessageDigest.isEqual(Base64.getDecoder().decode(parts[1]), derive(password, Base64.getDecoder().decode(parts[0]))); }
        catch (RuntimeException exception) { return false; }
    }

    private byte[] derive(String password, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 210_000, 256);
            try { return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded(); }
            finally { spec.clearPassword(); }
        } catch (Exception exception) { throw new IllegalStateException("Password hashing is unavailable.", exception); }
    }

    private String createToken(AppUser user) {
        long now = System.currentTimeMillis() / 1000;
        String header = encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = encode("{\"sub\":\"" + escape(user.getEmail()) + "\",\"name\":\"" + escape(user.getName()) + "\",\"iat\":" + now + ",\"exp\":" + (now + TOKEN_TTL_SECONDS) + "}");
        String signingInput = header + "." + payload;
        return signingInput + "." + Base64.getUrlEncoder().withoutPadding().encodeToString(sign(signingInput));
    }

    private byte[] sign(String value) {
        try { Mac mac = Mac.getInstance("HmacSHA256"); mac.init(new SecretKeySpec(jwtSecret, "HmacSHA256")); return mac.doFinal(value.getBytes(StandardCharsets.UTF_8)); }
        catch (Exception exception) { throw new IllegalStateException("Token signing is unavailable.", exception); }
    }
    private String encode(String value) { return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8)); }
    private String escape(String value) { return value.replace("\\", "\\\\").replace("\"", "\\\""); }
}
