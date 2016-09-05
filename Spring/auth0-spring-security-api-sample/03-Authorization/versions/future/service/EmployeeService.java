package com.auth0.example.future.service;

import com.auth0.example.future.domain.Employee;

import java.util.List;

public interface EmployeeService {

	List<Employee> findAll();

	Employee save(Employee employee);
}