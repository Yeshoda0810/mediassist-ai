package com.yeshoda.medical.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SecurityConfig {

    // Optional: set FRONTEND_URL on Render for a custom domain
    @Value("${FRONTEND_URL:}")
    private String frontendUrl;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        http.csrf(c -> c.disable())
            .cors(c -> c.configurationSource(req -> {
                CorsConfiguration x = new CorsConfiguration();

                List<String> origins = new ArrayList<>();
                origins.add("http://localhost:3000");
                origins.add("https://*.vercel.app");
                if (frontendUrl != null && !frontendUrl.isBlank()) {
                    origins.add(frontendUrl.trim());
                }

                x.setAllowedOriginPatterns(origins);
                x.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                x.setAllowedHeaders(List.of("*"));
                return x;
            }))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a
                .requestMatchers("/api/auth/**", "/api/doctors/**", "/api/ai/**", "/h2-console/**").permitAll()
                .anyRequest().permitAll())
            .headers(h -> h.frameOptions(f -> f.sameOrigin()));

        return http.build();
    }
}