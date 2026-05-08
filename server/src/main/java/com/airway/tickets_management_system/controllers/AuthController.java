package com.airway.tickets_management_system.controllers;

import com.airway.tickets_management_system.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Controller
@RequestMapping("/api/auth")
public class AuthController {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @PostMapping("/register")
    @ResponseBody
    @Transactional
    public String register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return "Username is required";
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return "Password is required";
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "Email is required";
        }
        
        entityManager.persist(user);
        return "User registered successfully";
    }
    
    @PostMapping("/login")
    @ResponseBody
    public String login(@RequestParam String username, @RequestParam String password, HttpSession session, HttpServletResponse response) {
        try {
            User user = entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username AND u.password = :password", User.class)
                    .setParameter("username", username)
                    .setParameter("password", password)
                    .getSingleResult();
            
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("role", user.getRole());
            
            return "Login successful";
        } catch (Exception e) {
            return "Invalid username or password";
        }
    }
    
    @GetMapping("/logout")
    @ResponseBody
    public String logout(HttpSession session, HttpServletResponse response) {
        session.invalidate();
        return "Logged out successfully";
    }
    
    @GetMapping("/profile")
    @ResponseBody
    public String getProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return "Not logged in";
        }
        
        User user = entityManager.find(User.class, userId);
        return "Username: " + user.getUsername() + ", Email: " + user.getEmail() + ", Full Name: " + user.getFullName() + ", Role: " + user.getRole();
    }
}