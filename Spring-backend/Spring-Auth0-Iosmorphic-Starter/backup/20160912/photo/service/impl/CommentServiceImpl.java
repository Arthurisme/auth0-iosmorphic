package com.auth0.photo.service.impl;

import com.auth0.photo.dao.CommentDao;
import com.auth0.photo.model.Comment;
import com.auth0.photo.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
	
	
	
 
	
	@Autowired
	private CommentDao commentDao;

 
	public Comment save(Comment comment) {
 		return commentDao.save(comment);
	}

	
	public	 Comment findOne( Long commentId){
 		return commentDao.findOne(commentId);

	}
 
	
	public	List<Comment> findByPhotoId( Long photoId){
 		return commentDao.findByPhotoId(   photoId);

	}




	
	 

}
