//Here I copy a Profile model with name User. for user data , Profile will using only no database .
//There are no "name" , only nick name, username, and first name, secondname...


package com.auth0.example.model;

import com.auth0.example.model.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.Email;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Date;
import java.util.List;


@Entity
@javax.persistence.Table(name="\"User\"")
public class User {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @javax.persistence.Column(name="userId", nullable=false)
    private Long userId;
    private String firstName;
    private String lastName;
    private String userName;
    private String password;

    @CreationTimestamp
    private Date created;

    @javax.persistence.Transient
    private List<Photo> photoList;

    @javax.persistence.Transient
    private List<Photo> likedPhotoList;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public List<Photo> getPhotoList() {
        return photoList;
    }

    public void setPhotoList(List<Photo> photoList) {
        this.photoList = photoList;
    }

    public List<Photo> getLikedPhotoList() {
        return likedPhotoList;
    }

    public void setLikedPhotoList(List<Photo> likedPhotoList) {
        this.likedPhotoList = likedPhotoList;
    }


}
