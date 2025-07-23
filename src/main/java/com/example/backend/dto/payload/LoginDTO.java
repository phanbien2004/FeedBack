package com.example.backend.dto.payload;

import lombok.Data;

@Data
public class LoginDTO {
    private String username;
    private String password;
}
