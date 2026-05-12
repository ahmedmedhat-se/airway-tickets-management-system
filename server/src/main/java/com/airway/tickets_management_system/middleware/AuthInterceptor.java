package com.airway.tickets_management_system.middleware;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    private static final Set<String> ALLOWED_METHODS = new HashSet<>(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
    private static final int MAX_PATH_LENGTH = 500;
    private static final int MAX_QUERY_LENGTH = 1000;
    
    private static final Set<String> PUBLIC_PATHS = new HashSet<>(Arrays.asList(
        "/api/auth/login",
        "/api/auth/register"
    ));

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        if (path == null || method == null) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                      "{\"message\":\"Invalid request\"}");
            return false;
        }
        
        if (!ALLOWED_METHODS.contains(method.toUpperCase())) {
            writeJson(response, HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                      "{\"message\":\"Method not allowed\"}");
            return false;
        }
        
        if (path.length() > MAX_PATH_LENGTH) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                      "{\"message\":\"Invalid request path\"}");
            return false;
        }
        
        if (request.getQueryString() != null && request.getQueryString().length() > MAX_QUERY_LENGTH) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                      "{\"message\":\"Invalid query string\"}");
            return false;
        }
        
        if (path.contains("../") || path.contains("..\\") || path.contains("//")) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                      "{\"message\":\"Invalid path traversal detected\"}");
            return false;
        }
        
        if (path.contains("<") || path.contains(">") || path.contains("\"") || path.contains("'")) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                      "{\"message\":\"Invalid characters in path\"}");
            return false;
        }
        
        if ("OPTIONS".equalsIgnoreCase(method)) {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.setHeader("Access-Control-Max-Age", "3600");
            return true;
        }
        
        String normalizedPath = normalizePath(path);
        
        if (isPublicPath(normalizedPath)) {
            return true;
        }
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED,
                      "{\"message\":\"Unauthorized — please log in\"}");
            return false;
        }
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null || userId <= 0) {
            session.invalidate();
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED,
                      "{\"message\":\"Invalid session\"}");
            return false;
        }
        
        if (!session.getId().equals(request.getRequestedSessionId())) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED,
                      "{\"message\":\"Session mismatch\"}");
            return false;
        }
        
        String role = (String) session.getAttribute("role");
        request.setAttribute("sessionRole", role);
        request.setAttribute("sessionUserId", userId);
        
        boolean isAdminRequired = isAdminOnlyRequest(normalizedPath, method);
        
        if (isAdminRequired && !"ADMIN".equalsIgnoreCase(role)) {
            writeJson(response, HttpServletResponse.SC_FORBIDDEN,
                      "{\"message\":\"Forbidden — admin access required\"}");
            return false;
        }
        
        return true;
    }

    private boolean isPublicPath(String path) {
        for (String publicPath : PUBLIC_PATHS) {
            if (path.equals(publicPath) || path.startsWith(publicPath + "/")) {
                return true;
            }
        }
        return false;
    }
    
    private String normalizePath(String path) {
        path = path.replaceAll("/{2,}", "/");
        path = path.replaceAll("/$", "");
        path = path.toLowerCase();
        return path;
    }

    private boolean isAdminOnlyRequest(String path, String method) {
        if (path == null || method == null) {
            return false;
        }
        
        if ("POST".equalsIgnoreCase(method) && path.equals("/api/flights")) {
            return true;
        }
        
        if ("PUT".equalsIgnoreCase(method) && path.matches("/api/flights/\\d+")) {
            String[] parts = path.split("/");
            if (parts.length >= 4) {
                try {
                    Long flightId = Long.parseLong(parts[3]);
                    if (flightId <= 0) {
                        return false;
                    }
                } catch (NumberFormatException e) {
                    return false;
                }
            }
            return true;
        }
        
        if ("DELETE".equalsIgnoreCase(method)
                && path.matches("/api/flights/\\d+")
                && !path.contains("/bookings/")) {
            return true;
        }
        
        if ("GET".equalsIgnoreCase(method) && path.equals("/api/flights/bookings/all")) {
            return true;
        }
        
        return false;
    }

    private void writeJson(HttpServletResponse response, int status, String json)
            throws Exception {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
        response.getWriter().flush();
    }
}