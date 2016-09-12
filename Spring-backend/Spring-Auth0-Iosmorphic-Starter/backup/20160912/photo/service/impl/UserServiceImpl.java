package com.auth0.photo.service.impl;

import com.auth0.photo.dao.UserDao;
import com.auth0.photo.model.User;
import com.auth0.photo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
	
	
	
	@Autowired
	private UserDao userDao;

 
	public User save(User user) {
 		return userDao.save(user);
	}
	
	public User findByUserName( String userName){
 		return userDao.findByUserName(userName);

	};


}
