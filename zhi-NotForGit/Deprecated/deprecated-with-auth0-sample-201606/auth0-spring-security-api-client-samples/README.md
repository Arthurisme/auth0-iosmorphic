## Auth0 Java Spring Security API SPA Client Applications

The samples contained here are companion `client` samples for the [Auth0 Spring Security API Sample](https://github.com/auth0-samples/auth0-spring-security-api-sample)
and [Auth0 Spring Security API Resource Server Sample](https://github.com/auth0-samples/auth0-spring-security-api-resource-server-sample)

### Background Information

Three scenarios we wish to cover are:

1). The SPA and API Server trust one another, and share the same Auth0 `application` information. Hence the JWT Token received upon successful authentication in the SPA application is also passed in the Authorization Bearer header of the AJAX requests to the API Server. The API Server accepts the audience as it is the same as its own.

2). Using Delegation Tokens to partition the SPA application and API Server, each having their own Auth0 Application on a shared Tenant.

3). Using a Resource Server, rather than API Server.

The first sample published covers 1) and 2) above. A separate sample will be provided for 3). This shall use a User Consent Form and is part of a very recent Oauth2 offering from Auth0 that is still in Beta.

Likewise, existing samples will be provided using Angular 1.x, however we expect support for ReactJS samples to illustrate the exact same concepts very shortly.
