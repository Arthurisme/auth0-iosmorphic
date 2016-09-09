package com.auth0.example.dao;

import com.auth0.example.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleDao extends CrudRepository<Role, Long> {

    Role findByName(String name);

    @Override
    void delete(Role role);

}
