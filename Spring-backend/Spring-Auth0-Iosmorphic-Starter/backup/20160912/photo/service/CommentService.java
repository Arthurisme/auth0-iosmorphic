package com.auth0.photo.service;

import com.auth0.photo.model.Comment;

import java.util.List;


public interface CommentService {
	Comment save(Comment comment);
    Comment findOne(Long commentId);
	
	List<Comment> findByPhotoId(Long photoId);
}
