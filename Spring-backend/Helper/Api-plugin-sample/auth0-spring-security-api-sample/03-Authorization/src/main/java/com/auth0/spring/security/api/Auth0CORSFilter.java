package com.auth0.spring.security.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class Auth0CORSFilter implements Filter {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException, ServletException {
        final HttpServletResponse response = (HttpServletResponse) res;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
//        response.setHeader("Access-Control-Allow-Headers", "Origin, Authorization, Access-Control-Allow-Headers, Accept, X-Requested-With, X-CSRF-Token, X-XSRF-TOKEN, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Authorization, Access-Control-Allow-Headers, Accept, X-Requested-With,  X-CSRF-Token,   X-XSRF-Token,    Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        response.setHeader("Access-Control-Expose-Headers", "Authorization");
        chain.doFilter(req, res);
        logger.info("Test where is starter point 20 ");

    }

    @Override
    public void init(final FilterConfig filterConfig) throws ServletException {
        // empty
    }

    @Override
    public void destroy() {

    }
}