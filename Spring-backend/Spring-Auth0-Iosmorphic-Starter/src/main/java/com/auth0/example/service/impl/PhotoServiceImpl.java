package com.auth0.example.service.impl;

import com.auth0.example.dao.PhotoDao;
import com.auth0.example.dao.UserDao;
import com.auth0.example.model.Photo;
import com.auth0.example.model.User;
import com.auth0.example.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotoServiceImpl implements PhotoService {
	
	
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private PhotoDao photoDao;

 
	public Photo save(Photo photo) {
 		return photoDao.save(photo);
	}

 
 
	
	public List<Photo> findByUser( User user){
 		return photoDao.findByUser(user);

	}
	
	public  Photo findByPhotoId(Long photoId)
{
 		return photoDao.findByPhotoId(photoId);

	}

	public  List<Photo> findAll( )
{
//	return (List<Photo>) photoDao.findAll();
 		return photoDao.findAll( );

	}

}
