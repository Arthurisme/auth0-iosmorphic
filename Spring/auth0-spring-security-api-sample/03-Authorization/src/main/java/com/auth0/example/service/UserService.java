package com.auth0.example.service;

import com.auth0.example.domain.User;

import java.util.List;

public interface UserService {

	List<User> findAll();

	User save(User user);
}