//package com.auth0.example.security;
//
//
//
//        import java.util.Arrays;
//        import java.util.Collection;
//
//        import org.springframework.security.authentication.AbstractAuthenticationToken;
//        import org.springframework.security.core.GrantedAuthority;
//
//        import com.setfive.models.User;
//
//public class DemoAuthenticationToken extends AbstractAuthenticationToken {
//
//    private static final long serialVersionUID = -1949976839306453197L;
//    private User authenticatedUser;
//    private Long uid;
//
//    public DemoAuthenticationToken(Long uid){
//        super(Arrays.asList());
//        this.uid = uid;
//    }
//
//    public DemoAuthenticationToken(Collection<? extends GrantedAuthority> authorities, User authenticatedUser, Long uid) {
//        super(authorities);
//        this.uid = uid;
//        this.authenticatedUser = authenticatedUser;
//    }
//
//    @Override
//    public Object getCredentials() {
//        return authenticatedUser.getPassword();
//    }
//
//    @Override
//    public Object getPrincipal() {
//        return authenticatedUser;
//    }
//
//    public String getUid() {
//        return uid;
//    }
//
//}