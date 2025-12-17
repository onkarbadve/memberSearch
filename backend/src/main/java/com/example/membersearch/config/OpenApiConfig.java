package com.example.membersearch.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger configuration for API documentation.
 * Access Swagger UI at: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI memberSearchOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Member Search API")
                        .description(
                                "REST API for searching and managing member records with AI-powered natural language search")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Member Search Team")
                                .email("support@membersearch.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
