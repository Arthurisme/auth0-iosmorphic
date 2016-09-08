package com.auth0.example.service;

import com.auth0.example.Profile;
import com.auth0.example.dao.UserDao;
import com.auth0.example.model.User;
import com.auth0.example.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * Secured Service
 */
@Service
public class UserServiceImpl implements UserService {



	@Autowired
	private UserDao userDao;


	public List<User> findAll()	{
//	return (List<Photo>) photoDao.findAll();
		return userDao.findAll( );
	}

 	public User save(User user) {
		return userDao.save(user);
	}
//
////	or maybe: Profile findById(Long Id);
	public  User findById(Long Id)
	{
		return userDao.findById(Id);
	}
//
//
	public User findByName( String name){
		return userDao.findByName(name);

	}
//
//	public User update(User user){
//		return  userDao.update(user);
//	}
//
	public void deleteById(Long Id){
		userDao.deleteById(Id);
	}









//	public Photo save(Photo photo) {
//		return photoDao.save(photo);
//	}




//	public List<Photo> findByUser( User user){
//		return photoDao.findByUser(user);
//
//	}

//	public  Photo findByPhotoId(Long photoId)
//	{
//		return photoDao.findByPhotoId(photoId);
//
//	}

//	public  List<Photo> findAll( )
//	{
////	return (List<Photo>) photoDao.findAll();
//		return photoDao.findAll( );
//
//	}








//	private final Logger logger = LoggerFactory.getLogger(this.getClass());
//
//	protected ProfileRepositoryStub profileRepository;
//
//	private Auth0Client auth0Client;
//
//	@Autowired
//	public ProfileService(final Auth0Client auth0Client, final ProfileRepositoryStub profileRepository) {
//		this.auth0Client = auth0Client;
//		this.profileRepository = profileRepository;
//	}
//
//	@PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
//	public List<Profile> list() {
//		return profileRepository.list();
//	}
//
//	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
//	public Profile create(Profile profile) {
//		return profileRepository.create(profile);
//	}
//
//	@PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
//	public Profile get(Long id) {
//		return profileRepository.get(id);
//	}
//
//	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
//	public Profile update(Long id, Profile profile) {
//		return profileRepository.update(id, profile);
//	}
//
//	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
//	public Profile delete(Long id) {
//		return profileRepository.delete(id);
//	}

}


