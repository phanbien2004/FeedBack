package com.example.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl("http://100.103.11.94:8080");
        server.setDescription("API Documentation");

        Info info = new Info();
        info.setTitle("API Documentation title info");
        info.version("1.0");
        info.description("API Documentation description info");

        return new OpenAPI()
                .info(info)
                .servers(List.of(server));
    }
}
