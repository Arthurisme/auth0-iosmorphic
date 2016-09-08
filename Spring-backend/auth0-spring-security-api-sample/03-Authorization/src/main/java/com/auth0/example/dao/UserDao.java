package com.auth0.example.dao;

import com.auth0.example.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public interface UserDao extends CrudRepository<User, Long>{

	List<User> findAll();

	User save(User user);
//
    User findById(Long Id);
//
    User findByName(String name);
//
//    User update(User user);
//
	void deleteById(Long Id);
//	Long deleteByLastname(String lastname);
//	List<User> removeByLastname(String lastname);


	

}
