package com.auth0.example.controller;

import com.auth0.example.model.Comment;
import com.auth0.example.model.Photo;
import com.auth0.example.service.CommentService;
import com.auth0.example.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/rest")
public class CommentResource {
	
 	

	@Autowired
	private CommentService commentService;
	
	@Autowired
	private PhotoService photoService;
	
	@RequestMapping(value="/comment/add", method= RequestMethod.POST)
	public void addComment(@RequestBody Comment comment){
		Photo photo = photoService.findByPhotoId(comment.getPhotoId());
//		List<Comment> commentList=photo.getCommentList();
		comment.setPhoto(photo);
		commentService.save(comment);		}
	
	
	@RequestMapping(value="/comment/photoId", method= RequestMethod.POST)
	public List<Comment> getCommentsByPhotoId(@RequestBody Long photoId){
 		return	commentService.findByPhotoId(photoId);
		}


}
