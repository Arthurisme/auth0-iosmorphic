package com.auth0.example.security;

//import org.baeldung.persistence.dao.UserRepository;
//import org.baeldung.persistence.model.Privilege;
//import org.baeldung.persistence.model.Role;
//import org.baeldung.persistence.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;


import com.auth0.example.UsernameService;


@Service("userDetailsService")
@Transactional
public class MyUserDetailsService implements UserDetailsService {


    @Autowired
    protected UsernameService usernameService;

//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private LoginAttemptService loginAttemptService;

    @Autowired
    private HttpServletRequest request;

    public MyUserDetailsService() {
        super();
    }

    // API

    @Override
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {



        try {
            final String username = usernameService.getUsername();
            final String nameOfUser = usernameService.getNameOfUser();
             if (username == null) {
                throw new UsernameNotFoundException("No user found with username: " + email);
            }

            return new org.springframework.security.core.userdetails.User( username, null, true, true, true, true, getAuthorities( ));
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    // UTIL

    public final Collection< GrantedAuthority> getAuthorities( ) {
        Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>)new ArrayList<GrantedAuthority>();
        String[] myStrings = new String[] {"Elem1","Elem2","Elem3","Elem4","Elem5"};
        List mylist = Arrays.asList(myStrings );


        authorities.add(new SimpleGrantedAuthority( "tttt"));

        return authorities;
    }

//    private final List<String> getPrivileges(final Collection<Role> roles) {
//        final List<String> privileges = new ArrayList<String>();
//        final List<Privilege> collection = new ArrayList<Privilege>();
//        for (final Role role : roles) {
//            collection.addAll(role.getPrivileges());
//        }
//        for (final Privilege item : collection) {
//            privileges.add(item.getName());
//        }
//        return privileges;
//    }

//    private final List<GrantedAuthority> getGrantedAuthorities( ) {
//        final List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
//        String[] myStrings = new String[] {"Elem1","Elem2","Elem3","Elem4","Elem5"};
//        List mylist = Arrays.asList(myStrings );
//
//
//        authorities.add(new SimpleGrantedAuthority( "tttt"));
//
//        return authorities;
//    }

    private String getClientIP() {
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
