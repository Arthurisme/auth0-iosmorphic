package com.auth0.spring.security.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

@Configuration
@ComponentScan(basePackages = {"com.auth0.spring.security.api"})
@PropertySources({
        @PropertySource("classpath:auth0.properties")
})
public class TestAuth0Configuration {

    @Value(value = "${auth0.clientId}")
    private String clientId;

    @Value(value = "${auth0.clientSecret}")
    private String clientSecret;

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean(name = "auth0TokenHelper")
    public Auth0TokenHelper<Object> auth0TokenHelper() {
        final Auth0TokenHelperImpl auth0TokenHelper = new Auth0TokenHelperImpl();
        auth0TokenHelper.setClientId(clientId);
        auth0TokenHelper.setClientSecret(clientSecret);
        return auth0TokenHelper;
    }

}