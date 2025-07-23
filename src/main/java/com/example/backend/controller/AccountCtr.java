package com.example.backend.controller;

import com.example.backend.dto.AccountDTO;
import com.example.backend.dto.payload.LoginDTO;
import com.example.backend.dto.payload.RegisterDTO;
import com.example.backend.entity.Account;
import com.example.backend.mapper.AccountMapper;
import com.example.backend.repository.AccountRepository;
import com.example.backend.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountCtr {

    private final AccountMapper accountMapper;
    private final AccountService accountService;
    private final AccountRepository accountRepo;

    @GetMapping("/profile")
    public AccountDTO getProfile(Authentication authentication){
        String username = authentication.getName();
        Account account = accountRepo.findByUsername(username);
        System.out.println(account);
        return accountMapper.accountToDto(account);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO detail) {
        return accountService.login(detail);
    }

    @PostMapping("/registration")
    @PreAuthorize("hasRole('EXECUTIVE')")
    public String register(@RequestBody RegisterDTO detail) {
        return accountService.register(detail);
    }
}
