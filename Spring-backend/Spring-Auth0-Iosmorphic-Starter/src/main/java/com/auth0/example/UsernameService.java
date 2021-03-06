package com.auth0.example;

import com.auth0.spring.security.api.Auth0JWTToken;
import com.auth0.spring.security.api.Auth0UserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Demonstration of method level Role based authorization
 * Only an authenticated and authorized User with Admin
 * rights can access this resource.
 *
 * Also demonstrates how to retrieve the UserDetails object
 * representing the Authentication's principal from within
 * a service
 *
 */
@Service
public class UsernameService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private Auth0Client auth0Client;

//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String getProfileUsername() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Auth0UserDetails principal = (Auth0UserDetails) authentication.getPrincipal();
        logger.info("Current user accessed Admin secured resource: " + principal.getUsername());
        // we already have the username.. but for this sample lets call Auth0 service anyway..
        return auth0Client.getProfileUsername((Auth0JWTToken) authentication);
    }

    //    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String getProfileEmail() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        final Auth0UserDetails principal = (Auth0UserDetails) authentication.getPrincipal();
//        logger.info("Current user accessed Admin secured resource: " + principal.getUsername());
        // we already have the username.. but for this sample lets call Auth0 service anyway..
        return auth0Client.getProfileEmail((Auth0JWTToken) authentication);
    }


// also email?
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String getProfileName() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        final Auth0UserDetails principal = (Auth0UserDetails) authentication.getPrincipal();
//        logger.info("Current user accessed Admin secured resource: " + principal.getUsername());
        // we already have the username.. but for this sample lets call Auth0 service anyway..
        return auth0Client.getProfileName((Auth0JWTToken) authentication);
    }

    //    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String getProfileUserId() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        final Auth0UserDetails principal = (Auth0UserDetails) authentication.getPrincipal();
//        logger.info("Current user accessed Admin secured resource: " + principal.getUsername());
        // we already have the username.. but for this sample lets call Auth0 service anyway..

        return auth0Client.getProfileUserId((Auth0JWTToken) authentication);
    }


    // full name?
    //    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String getProfileNickname() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        final Auth0UserDetails principal = (Auth0UserDetails) authentication.getPrincipal();
//        logger.info("Current user accessed Admin secured resource: " + principal.getUsername());
        // we already have the username.. but for this sample lets call Auth0 service anyway..

        return auth0Client.getProfileNickname((Auth0JWTToken) authentication);
    }

}


