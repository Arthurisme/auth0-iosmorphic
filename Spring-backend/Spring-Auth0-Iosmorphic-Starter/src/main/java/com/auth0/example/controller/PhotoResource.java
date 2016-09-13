package com.auth0.example.controller;

import com.auth0.example.model.Photo;
import com.auth0.example.model.User;
import com.auth0.example.service.PhotoService;
import com.auth0.example.service.UserService;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;


@RestController
@RequestMapping("/rest")
public class PhotoResource {
	
	private String imageName;


	@Autowired
	private PhotoService photoService;

	@Autowired
	private UserService userService;
	
	@RequestMapping(value="/photo/upload", method= RequestMethod.POST)
	public String upload(HttpServletResponse response, HttpServletRequest request){
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Iterator<String> it = multipartRequest.getFileNames();
		MultipartFile multipartFile = multipartRequest.getFile(it.next());
		
		String fileName = multipartFile.getOriginalFilename();
		imageName =fileName;
		
		String path = new File("src/main/resources/static/images").getAbsolutePath()+"/"+fileName;
	    System.out.println("test path before uploaded: "+path);

		
		try{
			multipartFile.transferTo(new File(path));
		    System.out.println(path);
		}catch(IOException e){
			e.printStackTrace();
		}
		
		
		return "Upload Image Success!";
		
	}
	
	@RequestMapping(value="/photo/add", method= RequestMethod.POST)
	public Photo addPhoto(@RequestBody Photo photo){
		photo.setImageName(imageName);
		photo.setUser(userService.findByUserName("arthur.zhixin.liu@gmail.com"));
		return	photoService.save(photo);
		}
	
	@RequestMapping(value="/photo/update", method= RequestMethod.POST)
	public Photo updatePhoto(@RequestBody Photo photo){
		Photo currentPhoto = photoService.findByPhotoId(photo.getPhotoId());
		currentPhoto.setLikes(photo.getLikes());
		return	photoService.save(currentPhoto);
		}

	@RequestMapping(value="/photo/user", method= RequestMethod.POST)
	public List<Photo> getPhotosByUser(@RequestBody User user){
			return	photoService.findByUser(user) ;
		}

	@RequestMapping(value="/photo/userId", method= RequestMethod.POST)
	public List<Photo> getPhotosByUserId(@RequestBody String userId){


		return	photoService.findByUser(userService.findByUserId( 1L )) ;
	}


	@RequestMapping(value="/photo/username", method= RequestMethod.POST)
	public List<Photo> getPhotosByUsername(@RequestBody String username){


		return	photoService.findByUser(userService.findByUserName( username )) ;
	}

	@RequestMapping(value="/photo/userIdtest", method= RequestMethod.POST)
	public String getPhotosByUserIdTest(@RequestBody String userId){


		return	"test yes" ;
	}
	
	@RequestMapping(value="/photo/photoId", method = RequestMethod.POST)
	public Photo getPhotoByPhotoId(@RequestBody Long photoId) {
		return photoService.findByPhotoId(photoId);
	}



}
