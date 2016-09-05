package com.auth0.example.service;

import com.auth0.example.domain.Employee;

import java.util.List;

public interface EmployeeService {

	List<Employee> findAll();

	Employee save(Employee employee);
}