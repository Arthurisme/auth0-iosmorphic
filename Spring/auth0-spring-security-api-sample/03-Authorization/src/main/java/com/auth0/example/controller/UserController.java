package com.auth0.example.controller;

import com.auth0.example.domain.User;

import com.auth0.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class UserController {

	@Autowired
	private UserRepository userRepository;


//	@RequestMapping(value = "/admin/employee/save", method = RequestMethod.POST)
//	public ResponseEntity<Employee> savePost(@RequestBody @Valid Employee employee, BindingResult result) {
//		if (!result.hasErrors()) {
//			employeeService.save(employee);
//			return new ResponseEntity<>(HttpStatus.OK);
//		} else {
//			return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
//		}
//	}

//	@RequestMapping(value = "/api/users/registration", method = RequestMethod.POST)
//	public User registerUser(@RequestBody @Valid User user, BindingResult result) {
//
//
//
//		user.setUsername("admin9");
//		user.setPassword(new BCryptPasswordEncoder().encode("admin9"));
//		user.grantRole("admin9".equals("admin") ? UserRole.ADMIN : UserRole.USER);
//		return userRepository.save(user);
////		return userService.save(user);
//	}



//
//	@RequestMapping(value = "/api/users/registration", method = RequestMethod.POST)
//	public User registerUser(@RequestBody @Valid User user, BindingResult result) {
//
//
//
//		user.setUsername("admin9");
//		user.setPassword(new BCryptPasswordEncoder().encode("admin9"));
//		user.grantRole("admin9".equals("admin") ? UserRole.ADMIN : UserRole.USER);
//		return userRepository.save(user);
////		return userService.save(user);
//	}










	@RequestMapping(value = "/admin/api/users", method = RequestMethod.GET)
	public List<User> list() {
		return userRepository.findAll();
	}
}
