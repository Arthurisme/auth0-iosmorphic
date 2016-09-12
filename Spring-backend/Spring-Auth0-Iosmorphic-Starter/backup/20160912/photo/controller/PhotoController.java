package com.auth0.photo.controller;

import com.auth0.photo.model.Photo;
import com.auth0.photo.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/photo")
public class PhotoController {

	@Autowired
	private PhotoService photoService;
	
	@RequestMapping("/allPhotos")
	public List<Photo> getAllPhotos() {
		return photoService.findAll();
	}

	@RequestMapping("/allPhotosTest")
	public String getAllPhotosTest() {
		return "9999";
	}
}
