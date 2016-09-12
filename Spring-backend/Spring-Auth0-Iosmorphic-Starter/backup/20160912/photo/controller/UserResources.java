package com.auth0.photo.controller;

import com.auth0.photo.model.User;
import com.auth0.photo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/rest")
public class UserResources {
	
	@Autowired
	private UserService userService;

 
	
	@RequestMapping("/user/users")
	public String loginSuccess(){
		return "Login Successful!";
   }
	
	

	@RequestMapping(value="/user/userName", method= RequestMethod.POST)
	public User findByUserName(@RequestBody String userName){
		return userService.findByUserName(userName);
   }
	

	@RequestMapping(value="/user/update", method= RequestMethod.POST)
	public User updateUser(@RequestBody User user){
		return userService.save(user);
   }
}




