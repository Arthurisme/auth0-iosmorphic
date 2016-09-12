package com.auth0.example.service;

import com.auth0.example.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Secured Service
 */

public interface UserService {




    List<User> findAll();

    User save(User user);
//
    User findByUserId(Long Id);
//
    User findByUsername(String username);

    User findByEmail(String email);

    //
//    User update(User user);
//
    void deleteByUserId(Long Id);






//	Long deleteByLastname(String lastname);
//	List<User> removeByLastname(String lastname);





//    private final Logger logger = LoggerFactory.getLogger(this.getClass());
//
//    protected ProfileRepositoryStub profileRepository;
//
//    private Auth0Client auth0Client;
//
//    @Autowired
//    public ProfileService(final Auth0Client auth0Client, final ProfileRepositoryStub profileRepository) {
//        this.auth0Client = auth0Client;
//        this.profileRepository = profileRepository;
//    }
//
//    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
//    public List<Profile> list() {
//        return profileRepository.list();
//    }
//
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    public Profile create(Profile profile) {
//        return profileRepository.create(profile);
//    }
//
//    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
//    public Profile get(Long id) {
//        return profileRepository.get(id);
//    }
//
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    public Profile update(Long id, Profile profile) {
//        return profileRepository.update(id, profile);
//    }
//
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    public Profile delete(Long id) {
//        return profileRepository.delete(id);
//    }

}


