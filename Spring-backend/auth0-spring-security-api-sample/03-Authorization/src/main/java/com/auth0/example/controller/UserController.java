package com.auth0.example.controller;

import com.auth0.example.AppConfig;
import com.auth0.example.Profile;
import com.auth0.example.ProfileService;
import com.auth0.example.UsernameService;
import com.auth0.example.model.User;
import com.auth0.example.service.UserService;
import com.auth0.spring.security.api.Auth0JWTToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api/v1/")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Autowired
    private UserService userService;


    @Autowired
    protected AppConfig appConfig;

    @Autowired
    protected ProfileService profileService;

    @Autowired
    protected UsernameService usernameService;

    @RequestMapping(value = "users", method = RequestMethod.GET)
    public List<User> listAllUsers() {
        return userService.findAll();
    }

    /**
     * Simple demonstration of how Principal can be injected
     * Here, as demonstration, we want to do audit as only ROLE_ADMIN can create user..
     */
    @RequestMapping(value ="user/binding", method = RequestMethod.GET)
    public String binding() {
        logger.info("binding invoked");
//        printGrantedAuthorities((Auth0JWTToken) principal);
//        if ("ROLES".equals(appConfig.getAuthorityStrategy())) {
//            final String username = usernameService.getUsername();
//            // log username of user requesting profile creation
//            logger.info("User with email: " + username + " creating new profile");
//
//        }
        {
//            test to add current user to profile:
//            final Long userId = Long.parseLong(usernameService.getUserId());
//            final String userId =  (usernameService.getUserId());
//            logger.info("User id: " + userId + " creating new profile");

            final String username = usernameService.getUsername();
            final String nameOfUser = usernameService.getNameOfUser();
            final String auth0UserId = usernameService.getUserId();
            logger.info("User with email: " + username + " creating new user");
            logger.info("User with nameOfUser: " + nameOfUser + " creating new user");
            logger.info("User with userId: " + auth0UserId + " creating new user");

            User currentUser = new User();
//            currentProfile.setId(userId);
            currentUser.setEmail(username);
            currentUser.setName(nameOfUser);
            currentUser.setAuth0UserId(auth0UserId);
            userService.save(currentUser);
            // log username of user requesting profile creation
            logger.info("User with email: " + username + " creating new user");
            logger.info("User with nameOfUser: " + nameOfUser + " creating new user");
            logger.info("User with userId: " + auth0UserId + " creating new user");


        }



        return "profile binding to the user.";
    }

    @RequestMapping(value ="user/{id}", method = RequestMethod.GET)
    public User getUserById(final @PathVariable Long id) {
        logger.info("get invoked");
        return userService.findById(id);
    }

    @RequestMapping(value ="user/{name}", method = RequestMethod.GET)
    public User getUserByName(final @PathVariable String name) {
        logger.info("get invoked");
        return userService.findByName(name);
    }

    @RequestMapping(value = "/user/update", method = RequestMethod.POST)
    public User updateUser(@RequestBody User user){
        return userService.save(user);
    }


    //not sure correct or not:
    @RequestMapping(value ="user/{id}", method = RequestMethod.POST)
    public User updateUserById(final @PathVariable Long id, final @Validated @RequestBody User user) {
        logger.info("update invoked");
        return userService.save(user);
    }



    @RequestMapping(value ="user/{id}", method = RequestMethod.DELETE)
    public void deleteUserById(final @PathVariable Long id) {
        logger.info("delete invoked");
        userService.deleteById(id);
    }

    /**
     * Simple demonstration of how Principal info can be accessed
     */
//    private void printGrantedAuthorities(final Auth0JWTToken principal) {
//        for(final GrantedAuthority grantedAuthority: principal.getAuthorities()) {
//            final String authority = grantedAuthority.getAuthority();
//            logger.info(authority);
//        }
//    }

}
