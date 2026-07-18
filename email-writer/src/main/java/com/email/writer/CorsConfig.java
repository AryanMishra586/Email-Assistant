package com.email.writer;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "https://mail.google.com",
                        "https://email-assistant-git-main-aryan-mishras-projects-bcf2c0d6.vercel.app"
                )
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*");
    }
}