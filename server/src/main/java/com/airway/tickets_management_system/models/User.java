package com.airway.tickets_management_system.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String role;
    
    public User() {
    }
    public User(String username, String password, String email, String fullName, String role) {
    }
    public Long getId() {
    }
    public void setId(Long id) {
    }
    public String getUsername() {
    }
    public void setUsername(String username) {
    }
    public String getPassword() {
    }
    public void setPassword(String password) {
    }
    public String getEmail() {
    }
    public void setEmail(String email) {
    }
    public String getFullName() {
    }
    public void setFullName(String fullName) {
    }
    public String getRole() {
    }
    public void setRole(String role) {
    }
}