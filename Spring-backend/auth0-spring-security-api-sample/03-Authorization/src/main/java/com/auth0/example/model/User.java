//Here I copy a Profile model with name User. for user data , Profile will using only no database .


package com.auth0.example.model;

import org.hibernate.validator.constraints.Email;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;


@Entity(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @javax.persistence.Column(name="Id", nullable=false)
    private Long id;

    @Column(unique = true)
    private String auth0UserId;

    @NotNull(message = "Name is required")
    @Size(min = 3, max = 99)
    private String name;

    @Column(unique = true)
    @NotNull(message = "Email is required")
    @Email(message = "Must be valid email")
    private String email;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;


    public User() {}

    public User(final Long id, final String auth0UserId,  final String name, final String email) {
        this.id = id;
        this.auth0UserId=auth0UserId;
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

}
