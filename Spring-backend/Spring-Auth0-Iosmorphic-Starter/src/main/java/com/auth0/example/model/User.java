//Here I copy a Profile model with name User. for user data , Profile will using only no database .
//There are no "name" , only nick name, username, and first name, secondname...


package com.auth0.example.model;

import com.auth0.example.model.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.Email;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Date;
import java.util.List;


@Entity
@javax.persistence.Table(name="\"User\"")
public class User implements UserDetails {


    public User() {}

    public User(final Long id, final String auth0UserId,  final String username, final String email) {
        this.userId = userId;
        this.auth0UserId=auth0UserId;
        this.username = username;
        this.email = email;
    }


    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @javax.persistence.Column(name="userId", nullable=false)
    private Long userId;

    @Column(unique = true)
    private String auth0UserId;

    @Column(unique = true)
    @NotNull(message = "Email is required")
    @Email(message = "Must be valid email")
    private String email;

    @NotNull
    @Size(min = 4, max = 30)
    private String username; //the username is mostly same with email.

     @Size(min = 3, max = 99)
    private String nickname; // such as Arthusisme, Ariversolong...



    private String firstName;

    private String lastName;

    //@NotNull ---- password is not required because here use auth0 as gateway.
    @Size(min = 4, max = 100)
    private String password;

    @Transient
    private String newPassword;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_userId", referencedColumnName = "UserId"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;





    @Transient
    private long expires;
    @NotNull
    private boolean accountExpired;

    @NotNull
    private boolean accountLocked;

    @NotNull
    private boolean credentialsExpired;

    @NotNull
    private boolean accountEnabled;


    //for Photo component:
    @CreationTimestamp
    private Date created;

    @javax.persistence.Transient
    private List< Photo> photoList;

    @javax.persistence.Transient
    private List< Photo> likedPhotoList;



    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return !accountExpired;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return !credentialsExpired;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return !accountEnabled;
    }



    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonIgnore
    public String getNewPassword() {
        return newPassword;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return roles;
    }


    // get set:



    public long getExpires() {
        return expires;
    }

    public void setExpires(long expires) {
        this.expires = expires;
    }



    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
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

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public boolean isAccountExpired() {
        return accountExpired;
    }

    public void setAccountExpired(boolean accountExpired) {
        this.accountExpired = accountExpired;
    }

    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(boolean accountLocked) {
        this.accountLocked = accountLocked;
    }

    public boolean isCredentialsExpired() {
        return credentialsExpired;
    }

    public void setCredentialsExpired(boolean credentialsExpired) {
        this.credentialsExpired = credentialsExpired;
    }

    public boolean isAccountEnabled() {
        return accountEnabled;
    }

    public void setAccountEnabled(boolean accountEnabled) {
        this.accountEnabled = accountEnabled;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long id) {
        this.userId = userId;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Collection<Role> getRoles() {
        return roles;
    }

    public void setRoles(final Collection<Role> roles) {
        this.roles = roles;
    }


    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public List< Photo> getPhotoList() {
        return photoList;
    }

    public void setPhotoList(List< Photo> photoList) {
        this.photoList = photoList;
    }

    public List< Photo> getLikedPhotoList() {
        return likedPhotoList;
    }

    public void setLikedPhotoList(List< Photo> likedPhotoList) {
        this.likedPhotoList = likedPhotoList;
    }





}
