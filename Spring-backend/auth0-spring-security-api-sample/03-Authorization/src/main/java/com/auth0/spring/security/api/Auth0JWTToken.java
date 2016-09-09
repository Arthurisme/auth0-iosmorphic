package com.auth0.spring.security.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Implements the org.springframework.security.core.Authentication interface.
 * The constructor is set with the Auth0 JWT
 */
public class Auth0JWTToken extends AbstractAuthenticationToken {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());


	private static final long serialVersionUID = 2371882820082543721L;

	private final String jwt;
	private Auth0UserDetails principal;

	public Auth0JWTToken(String jwt) {
		super(null);
		this.jwt = jwt;
		setAuthenticated(false);
		logger.info("Test where is starter point 30 ");

	}

	public String getJwt() {
		logger.info("Test where is starter point 31 ");

		return jwt;
	}

	public Object getCredentials() {
		return null;
	}

	public Object getPrincipal() {
		return principal;
	}

	public void setPrincipal(Auth0UserDetails principal) {
		this.principal = principal;
	}

	@SuppressWarnings("unchecked")
	@Override
    public Collection<GrantedAuthority> getAuthorities() {
		logger.info("Test where is starter point 30 ");

		Collection<GrantedAuthority> clist = (Collection<GrantedAuthority>) principal.getAuthorities();

		// Here I can add role to current user, but it is better to do in user service:
		clist.add(new SimpleGrantedAuthority("ROLE_TESTER"));


//		origin:
//		return (Collection<GrantedAuthority>) principal.getAuthorities();

		return clist;

     }

}
