package com.auth0.example.service;

import com.auth0.example.model.Photo;
import com.auth0.example.model.User;

import java.util.List;


public interface PhotoService {
	Photo save(Photo photo);
	List<Photo> findByUser(User user);
	Photo findByPhotoId(Long photoId);
	List<Photo> findAll();
 
}
