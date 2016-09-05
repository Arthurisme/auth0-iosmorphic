package com.auth0.example.domain;

import java.util.Date;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "User", uniqueConstraints = @UniqueConstraint(columnNames = { "username" }))
public class User{

	public User() {
	}

	public User(String username) {
		this.username = username;
	}

	public User(String username, Date expires) {
		this.username = username;
		this.expires = expires.getTime();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)

//	--for oracle database
//    @GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;

	@NotNull
	@Size(min = 4, max = 30)
	private String username;

	@NotNull
	@Size(min = 4, max = 100)
	private String password;

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

	@Transient
	private String newPassword;

//	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.EAGER, orphanRemoval = true)
//	private Set<UserAuthority> authorities;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}



	public void setUsername(String username) {
		this.username = username;
	}



	@JsonProperty
	public void setPassword(String password) {
		this.password = password;
	}

	@JsonIgnore
	public String getNewPassword() {
		return newPassword;
	}

	@JsonProperty
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}






	public long getExpires() {
		return expires;
	}

	public void setExpires(long expires) {
		this.expires = expires;
	}


}
