//package com.demo;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//	@Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//	    http.csrf().disable()
//	        .cors()
//	        .and()
//	        .authorizeHttpRequests((auth) -> auth
//	            .requestMatchers("/", "/userss/register", "/userss/login").permitAll()
//	            .requestMatchers("/stocks/**").permitAll()
//	            .anyRequest().authenticated()
//	        )
//	        .httpBasic().disable() // Disable Basic Auth
//	        .formLogin().disable() // 🔥 Disable Default Form Login
//	        .logout();
//
//	    return http.build();
//	}
//
//
//
//}