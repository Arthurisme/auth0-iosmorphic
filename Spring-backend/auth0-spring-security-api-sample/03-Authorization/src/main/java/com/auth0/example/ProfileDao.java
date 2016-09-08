package com.auth0.example;

import com.auth0.example.Profile;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileDao extends CrudRepository<Profile, Long>{

	Profile save(Profile profile );

	Profile findByName(String name);

	
	

}
