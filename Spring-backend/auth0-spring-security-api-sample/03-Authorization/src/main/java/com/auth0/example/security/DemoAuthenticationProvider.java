//package com.auth0.example.security;
//
//import com.auth0.example.dao.UserDao;
//import com.auth0.example.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.stereotype.Component;
//import com.pearson.reader.error.UnknownUserException;
//import com.pearson.reader.models.User;
//import com.pearson.reader.repositories.UserRepository;
//
//@Component
//public class DemoAuthenticationProvider implements AuthenticationProvider {
//
//    // This would be a JPA repository to snag your user entities
//    private final UserDao userDao;
//
//    @Autowired
//    public DemoAuthenticationProvider(UserDao userDao) {
//        this.userDao = userDao;
//    }
//
//    @Override
//    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
//
//        DemoAuthenticationToken demoAuthentication = (DemoAuthenticationToken) authentication;
//        User user = userRepository.find(demoAuthentication.getId());
//
//        if(user == null){
//            throw new UnknownUserException("Could not find user with ID: " + demoAuthentication.getId());
//        }
//
//        return user;
//    }
//
//    @Override
//    public boolean supports(Class<?> authentication) {
//        return DemoAuthenticationToken.class.isAssignableFrom(authentication);
//    }
//
//}