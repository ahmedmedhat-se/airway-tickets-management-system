package com.airway.tickets_management_system.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(nullable = false, length = 128)
    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, length = 100)
    private String fullName;
    
    @Column(nullable = false, length = 20)
    private String role;
    
    public User() {
    }
    
    public User(String username, String password, String email, String fullName, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = sanitizeInput(username);
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = sanitizeInput(password);
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = sanitizeInput(email);
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = sanitizeInput(fullName);
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role != null ? role.toUpperCase().trim() : null;
    }
    
    private String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        input = input.trim();
        
        input = input.replace("&", "&amp;")
                     .replace("<", "&lt;")
                     .replace(">", "&gt;")
                     .replace("\"", "&quot;")
                     .replace("'", "&#x27;")
                     .replace("/", "&#x2F;");
        
        input = input.replaceAll("(?i)<script.*?>.*?</script.*?>", "")
                     .replaceAll("(?i)<.*?javascript:.*?>.*?</.*?>", "")
                     .replaceAll("(?i)<.*?\\s+on.*?=.*?>.*?</.*?>", "")
                     .replaceAll("(?i)<.*?vbscript:.*?>.*?</.*?>", "")
                     .replaceAll("(?i)<.*?expression\\(.*?>.*?</.*?>", "")
                     .replaceAll("(?i)<.*?eval\\(.*?>.*?</.*?>", "");
        
        input = input.replaceAll("(?i)\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\\b", "");
        
        input = input.replaceAll("\\s+", " ");
        
        return input;
    }
}