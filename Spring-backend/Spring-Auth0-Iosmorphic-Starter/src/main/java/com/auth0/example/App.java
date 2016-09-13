package com.auth0.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@ComponentScan(basePackages = {"com.auth0.example", "com.auth0.spring.security.api"})
@EnableAutoConfiguration
@PropertySources({
		@PropertySource("classpath:application.properties"),
		@PropertySource("classpath:auth0.properties")
})
public class App {


//	@Bean
//	public ServletRegistrationBean dispatcherRegistration(DispatcherServlet dispatcherServlet) {
//		ServletRegistrationBean registration = new ServletRegistrationBean(
//				dispatcherServlet);
//		registration.addUrlMappings("*.png", "/images/*.*");
//		return registration;
//	}



	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
}
