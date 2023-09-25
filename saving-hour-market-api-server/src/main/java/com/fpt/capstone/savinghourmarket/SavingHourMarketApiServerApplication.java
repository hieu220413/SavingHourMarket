package com.fpt.capstone.savinghourmarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SavingHourMarketApiServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(SavingHourMarketApiServerApplication.class, args);
	}

}
