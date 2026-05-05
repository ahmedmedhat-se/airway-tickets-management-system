package com.airway.tickets_management_system.controllers;

import com.airway.tickets_management_system.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register")
    @ResponseBody
    public String register(@RequestBody User user) {
    }
    
    @PostMapping("/login")
    @ResponseBody
    public String login(@RequestParam String username, @RequestParam String password, HttpSession session, HttpServletResponse response) {
    }
    
    @GetMapping("/logout")
    @ResponseBody
    public String logout(HttpSession session, HttpServletResponse response) {
    }
    
    @GetMapping("/profile")
    @ResponseBody
    public String getProfile(HttpSession session) {
    }
}