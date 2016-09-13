package com.auth0.spring.security.api;

import com.auth0.example.Auth0Client;
//import com.auth0.example.model.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.auth0.example.UsernameService;
import com.auth0.example.model.User;
import com.auth0.example.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Implements the org.springframework.security.core.Authentication interface.
 * The constructor is set with the Auth0 JWT
 */
public class Auth0JWTToken extends AbstractAuthenticationToken {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	protected UsernameService usernameService;

	@Autowired
	protected UserService userService;

	@Autowired
	private Auth0Client auth0Client;


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
		logger.info(principal.getAuthorities().toString());


		Collection<GrantedAuthority> clist = (Collection<GrantedAuthority>) principal.getAuthorities();
		Collection<String> rolesInToken = new ArrayList<String>()  ;
		Collection<String> roleFromDatabase = new ArrayList<String>()  ;



		// Here I can not add role to current user:


		{
			//  get list string of roles:
			for (final GrantedAuthority grantedAuthority : principal.getAuthorities()) {
				final String authority = grantedAuthority.getAuthority();
				//test roles a user have:
				logger.info("authority 12 2");
				logger.info(authority);
				rolesInToken.add(authority);
			}
		}
		logger.info("Test where is starter point 30 2 ");
		logger.info(rolesInToken.toString());


		{  //get currently user name:
			String currentUserName = principal.getUsername();
		}



//		add roles:
//		if(!rolesInToken.contains("ROLE_USER")) {
//
//			clist.add(new SimpleGrantedAuthority("ROLE_USER"));
//			logger.info("Test where is starter point 30 3 ");
//			logger.info(principal.getAuthorities().toString());
//		}

//		origin:
//		return (Collection<GrantedAuthority>) principal.getAuthorities();

		return clist;

     }

}
