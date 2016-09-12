package com.auth0.photo.service;

import com.auth0.photo.model.User;

public interface UserService {

	User save(User user);
	User findByUserName(String userName);
}
