package com.example.backend.dto.payload;

import com.example.backend.Enum.Role;
import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String password;
    private String role;
}
