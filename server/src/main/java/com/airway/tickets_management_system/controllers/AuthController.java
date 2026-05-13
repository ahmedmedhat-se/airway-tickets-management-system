package com.airway.tickets_management_system.controllers;

import com.airway.tickets_management_system.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PersistenceContext
    private EntityManager entityManager;
    
    private static final int MAX_USERNAME_LENGTH = 50;
    private static final int MAX_PASSWORD_LENGTH = 128;
    private static final int MAX_EMAIL_LENGTH = 100;
    private static final int MAX_FULLNAME_LENGTH = 100;
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MIN_USERNAME_LENGTH = 3;
    private static final int MAX_INPUT_LENGTH = 500;
    
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]{3,50}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,128}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern FULLNAME_PATTERN = Pattern.compile("^[a-zA-Z\\s'\\-]{2,100}$");
    private static final Pattern ROLE_PATTERN = Pattern.compile("^(USER|ADMIN)$");
    
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> body = new HashMap<>();
        
        if (user == null) {
            body.put("message", "Invalid request body");
            return ResponseEntity.badRequest().body(body);
        }
        
        String username = sanitizeAndValidateInput(user.getUsername(), "Username", MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, USERNAME_PATTERN);
        if (username == null) {
            body.put("message", "Username is required and must be 3-50 characters with letters, numbers, dots, underscores, or hyphens");
            return ResponseEntity.badRequest().body(body);
        }
        
        String password = user.getPassword();
        if (password == null || password.trim().isEmpty()) {
            body.put("message", "Password is required");
            return ResponseEntity.badRequest().body(body);
        }
        
        password = password.trim();
        if (password.length() > MAX_PASSWORD_LENGTH) {
            body.put("message", "Password is too long");
            return ResponseEntity.badRequest().body(body);
        }
        
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            body.put("message", "Password must be 8-128 characters with at least one uppercase, one lowercase, one number, and one special character");
            return ResponseEntity.badRequest().body(body);
        }
        
        String email = sanitizeAndValidateInput(user.getEmail(), "Email", 5, MAX_EMAIL_LENGTH, EMAIL_PATTERN);
        if (email == null) {
            body.put("message", "Valid email is required");
            return ResponseEntity.badRequest().body(body);
        }
        
        String fullName = sanitizeAndValidateInput(user.getFullName(), "Full name", 2, MAX_FULLNAME_LENGTH, FULLNAME_PATTERN);
        if (fullName == null) {
            body.put("message", "Full name is required and must be 2-100 characters with letters, spaces, hyphens, or apostrophes");
            return ResponseEntity.badRequest().body(body);
        }
        
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        } else {
            String role = user.getRole().toUpperCase().trim();
            if (!ROLE_PATTERN.matcher(role).matches()) {
                role = "USER";
            }
            user.setRole(role);
        }
        
        if (isUsernameExists(username)) {
            body.put("message", "Username already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }
        
        if (isEmailExists(email)) {
            body.put("message", "Email already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }
        
        String salt = generateSalt();
        String hashedPassword = hashPassword(password, salt);
        
        user.setUsername(username);
        user.setPassword(hashedPassword + ":" + salt);
        user.setEmail(email);
        user.setFullName(fullName);
        
        try {
            entityManager.persist(user);
            
            User savedUser = entityManager.find(User.class, user.getId());
            if (savedUser == null) {
                throw new RuntimeException("Failed to verify user persistence");
            }
            
            body.put("message", "User registered successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(body);
        } catch (Exception e) {
            body.put("message", "Registration failed");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            HttpServletResponse response) {
        
        Map<String, Object> body = new HashMap<>();
        
        if (username == null || username.trim().isEmpty()) {
            body.put("message", "Username is required");
            return ResponseEntity.badRequest().body(body);
        }
        
        if (password == null || password.trim().isEmpty()) {
            body.put("message", "Password is required");
            return ResponseEntity.badRequest().body(body);
        }
        
        username = sanitizeInput(username.trim());
        password = password.trim();
        
        if (username.length() > MAX_USERNAME_LENGTH || password.length() > MAX_PASSWORD_LENGTH) {
            body.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
        
        if (!USERNAME_PATTERN.matcher(username).matches()) {
            body.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
        
        TypedQuery<User> query = entityManager
                .createQuery("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)", User.class);
        query.setParameter("username", username);
        
        try {
            User user = query.getSingleResult();
            
            if (!verifyPassword(password, user.getPassword())) {
                body.put("message", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
            }
            
            session.setMaxInactiveInterval(1800);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("role", user.getRole());
            session.setAttribute("email", user.getEmail());
            session.setAttribute("csrfToken", generateCSRFToken());
            
            response.setHeader("X-Content-Type-Options", "nosniff");
            response.setHeader("X-Frame-Options", "DENY");
            response.setHeader("X-XSS-Protection", "1; mode=block");
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
            response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            
            body.put("message", "Login successful");
            body.put("user", buildUserMap(user));
            return ResponseEntity.ok(body);
            
        } catch (NoResultException e) {
            body.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Logged out successfully");
        return ResponseEntity.ok(body);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(HttpSession session) {
        Map<String, Object> body = new HashMap<>();
        
        if (session == null) {
            body.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            body.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
        
        if (userId <= 0) {
            body.put("message", "Invalid session");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
        
        User user = entityManager.find(User.class, userId);
        if (user == null) {
            body.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
        
        if (!user.getId().equals(userId)) {
            body.put("message", "Unauthorized access");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
        }
        
        return ResponseEntity.ok(buildUserMap(user));
    }

    private Map<String, Object> buildUserMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", escapeJson(user.getUsername()));
        map.put("email", escapeJson(user.getEmail()));
        map.put("fullName", escapeJson(user.getFullName()));
        map.put("role", escapeJson(user.getRole()));
        return map;
    }
    
    private String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        input = input.trim()
                     .replace("&", "&amp;")
                     .replace("<", "&lt;")
                     .replace(">", "&gt;")
                     .replace("\"", "&quot;")
                     .replace("'", "&#x27;")
                     .replace("/", "&#x2F;");
                     
        input = input.replaceAll("(?i)(<script.*?>.*?</script.*?>|<.*?javascript:.*?>|<.*?vbscript:.*?>|<.*?expression\\(.*?>|<.*?eval\\(.*?>|<.*?onload.*?=.*?>|<.*?onerror.*?=.*?>|<.*?onclick.*?=.*?>)", "");
        input = input.replaceAll("(?i)\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|DECLARE|CAST|CONVERT)\\b", "");
        input = input.replaceAll("(--|#|/\\*|\\*/|;)", "");
        
        return input;
    }
    
    private String sanitizeAndValidateInput(String input, String fieldName, int minLength, int maxLength, Pattern pattern) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        
        input = sanitizeInput(input.trim());
        
        if (input.length() > maxLength || input.length() < minLength || input.length() > MAX_INPUT_LENGTH) {
            return null;
        }
        
        if (pattern != null && !pattern.matcher(input).matches()) {
            return null;
        }
        
        return input;
    }
    
    private String hashPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hashedBytes = md.digest(password.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hashing algorithm not available", e);
        }
    }
    
    private boolean verifyPassword(String inputPassword, String storedPassword) {
        if (storedPassword == null || !storedPassword.contains(":")) {
            return false;
        }
        
        String[] parts = storedPassword.split(":", 2);
        if (parts.length != 2) {
            return false;
        }
        
        String hashedInput = hashPassword(inputPassword, parts[1]);
        return MessageDigest.isEqual(hashedInput.getBytes(), parts[0].getBytes());
    }
    
    private String generateSalt() {
        byte[] salt = new byte[32];
        SECURE_RANDOM.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
    
    private String generateCSRFToken() {
        byte[] token = new byte[32];
        SECURE_RANDOM.nextBytes(token);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(token);
    }
    
    private String escapeJson(String input) {
        if (input == null) {
            return null;
        }
        
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("/", "\\/")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
    
    private boolean isUsernameExists(String username) {
        TypedQuery<Long> query = entityManager
                .createQuery("SELECT COUNT(u) FROM User u WHERE LOWER(u.username) = LOWER(:username)", Long.class);
        query.setParameter("username", username);
        return query.getSingleResult() > 0;
    }
    
    private boolean isEmailExists(String email) {
        TypedQuery<Long> query = entityManager
                .createQuery("SELECT COUNT(u) FROM User u WHERE LOWER(u.email) = LOWER(:email)", Long.class);
        query.setParameter("email", email);
        return query.getSingleResult() > 0;
    }
}