package com.airway.tickets_management_system.middleware;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        String path = request.getRequestURI();
        
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            return true;
        }
        
        HttpSession session = request.getSession(false);
        
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(401);
            response.getWriter().write("Unauthorized");
            return false;
        }
        
        return true;
    }
}