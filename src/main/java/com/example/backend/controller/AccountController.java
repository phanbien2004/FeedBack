package com.example.backend.controller;

import com.example.backend.dto.AccountDTO;
import com.example.backend.dto.payload.LoginDTO;
import com.example.backend.dto.payload.RegisterDTO;
import com.example.backend.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/login")
    public AccountDTO login(@RequestBody LoginDTO detail) {
        return accountService.login(detail);
    }

    @PostMapping("/registration")
    public String register(@RequestBody RegisterDTO detail) {
        return accountService.register(detail);
    }
}
