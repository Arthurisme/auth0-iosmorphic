package com.auth0.example;

import com.auth0.Auth0;
import com.auth0.authentication.AuthenticationAPIClient;
import com.auth0.authentication.result.UserProfile;
import com.auth0.request.Request;
import com.auth0.spring.security.api.Auth0JWTToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class Auth0Client {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    private final String clientid;
    private final String domain;
    private final Auth0 auth0;
    private final AuthenticationAPIClient client;

    public Auth0Client(String clientid, String domain) {
        this.clientid = clientid;
        this.domain = domain;
        this.auth0 = new Auth0(clientid, domain);
        this.client = this.auth0.newAuthenticationAPIClient();
    }

    public String getUsername(Auth0JWTToken token) {
        final Request<UserProfile> request = client.tokenInfo(token.getJwt());
        final UserProfile profile = request.execute();
        logger.debug("Test where is starter point 1 ");
        return profile.getEmail();

    }

    public String getNameOfUser(Auth0JWTToken token) {
        final Request<UserProfile> request = client.tokenInfo(token.getJwt());
        final UserProfile profile = request.execute();
        logger.debug("Test where is starter point 2 ");
        return profile.getName();

    }

    public String getUserId(Auth0JWTToken token) {
        final Request<UserProfile> request = client.tokenInfo(token.getJwt());
        final UserProfile profile = request.execute();
        logger.debug("Test where is starter point 3 ");
        return profile.getId();

    }

}
