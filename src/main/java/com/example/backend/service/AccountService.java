package com.example.backend.service;

import com.example.backend.Enum.Role;
import com.example.backend.dto.payload.LoginDTO;
import com.example.backend.dto.payload.RegisterDTO;

public interface AccountService {
    String login(LoginDTO detail);
    String register(RegisterDTO detail);
}
