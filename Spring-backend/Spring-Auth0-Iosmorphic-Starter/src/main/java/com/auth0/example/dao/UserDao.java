package com.auth0.example.dao;

import com.auth0.example.model.User;
import com.auth0.example.model.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UserDao extends CrudRepository<User, Long>{

	List<User> findAll();

	User save(User user);
//
    User findById(Long Id);
//
    User findByUsername(String username);

    User findByEmail(String email);


    //
//    User update(User user);
//
	void deleteById(Long Id);
//	Long deleteByLastname(String lastname);
//	List<User> removeByLastname(String lastname);


	

}
