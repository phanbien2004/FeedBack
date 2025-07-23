package com.example.backend.service.implement;

import com.example.backend.Enum.Role;
import com.example.backend.dto.AccountDTO;
import com.example.backend.dto.payload.LoginDTO;
import com.example.backend.dto.payload.RegisterDTO;
import com.example.backend.entity.Account;
import com.example.backend.mapper.AccountMapper;
import com.example.backend.repository.AccountRepository;
import com.example.backend.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountServiceImp implements AccountService {

    private final AccountRepository accountRepo;
    private final AccountMapper accountMapper;
    private final AuthenticationManager authenticationManager;

    @Override
    public Account getCurrentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return accountRepo.findByUsername(username);
    }

    @Override
    public AccountDTO login(LoginDTO detail) {
        Account account = accountRepo.findByUsername(detail.getUsername());
        if(account == null){
            throw new RuntimeException("Data not found");
        }
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(detail.getUsername(), detail.getPassword()));
        }catch(Exception e){
            throw new RuntimeException("Wrong Password");
        }
        return accountMapper.accountToDto(account);
    }

    @Override
    public String register(RegisterDTO detail) {
        Account account = accountRepo.findByUsername(detail.getUsername());
        if(account != null){
            throw new RuntimeException("Account exists");
        }
        account = new Account();
        account.setUsername(detail.getUsername());
        account.setPassword(new BCryptPasswordEncoder(12).encode(detail.getPassword()));
        account.setRole(Role.valueOf(detail.getRole().toUpperCase()));
        if(account.getRole().equals(Role.STUDENT)) account.setSos((short)1);
        accountRepo.save(account);
        return "Registration successfully";
    }
}
