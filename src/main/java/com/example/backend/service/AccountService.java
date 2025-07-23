package com.example.backend.service;

import com.example.backend.dto.AccountDTO;
import com.example.backend.dto.payload.LoginDTO;
import com.example.backend.dto.payload.RegisterDTO;
import com.example.backend.entity.Account;

public interface AccountService {
    Account getCurrentAccount();
    AccountDTO login(LoginDTO detail);
    String register(RegisterDTO detail);
}
