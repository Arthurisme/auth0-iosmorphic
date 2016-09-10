package com.auth0.example.future.service;

import com.auth0.example.future.domain.User;

import java.util.List;

public interface UserService {

	List<User> findAll();

	User save(User user);
}