package com.example.backend.dto;

import com.example.backend.Enum.Role;
import lombok.Data;

@Data
public class AccountDTO {
    private String username;
    private short sos;
    private Role role;
}
