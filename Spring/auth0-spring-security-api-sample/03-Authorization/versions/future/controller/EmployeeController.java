package com.auth0.example.future.controller;

import com.auth0.example.future.domain.Employee;
import com.auth0.example.future.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class EmployeeController {

	private EmployeeService employeeService;

	@Autowired
	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@RequestMapping(value = "/admin/employee/all", method = RequestMethod.GET)
	public List<Employee> getAllPosts() {
		return employeeService.findAll();
	}

	@RequestMapping(value = "/admin/employee/save", method = RequestMethod.POST)
	public ResponseEntity<Employee> savePost(@RequestBody @Valid Employee employee, BindingResult result) {
		if (!result.hasErrors()) {
			employeeService.save(employee);
			return new ResponseEntity<>(HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
		}
	}
}