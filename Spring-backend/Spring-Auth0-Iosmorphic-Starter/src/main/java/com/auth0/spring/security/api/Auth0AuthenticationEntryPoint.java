package com.auth0.spring.security.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Auth0AuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        final PrintWriter writer = response.getWriter();

        logger.info("Test where is starter point 7 ");


        if (isPreflight(request)) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } else if (authException instanceof Auth0TokenException) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
            writer.println("HTTP Status " + HttpServletResponse.SC_UNAUTHORIZED + " - " + authException.getMessage());
        } else {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, authException.getMessage());
            writer.println("HTTP Status " + HttpServletResponse.SC_FORBIDDEN + " - " + authException.getMessage());
        }

        logger.info("Test where is starter point 8 ");

    }

    /**
     * Checks if this is a X-domain pre-flight request.
     */
    private boolean isPreflight(HttpServletRequest request) {

        logger.info("Test where is starter point 9 ");

        return "OPTIONS".equals(request.getMethod());
    }

}