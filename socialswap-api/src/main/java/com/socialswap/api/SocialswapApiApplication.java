package com.socialswap.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SocialswapApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialswapApiApplication.class, args);
    }
}