package com.example.backend.security;

import com.example.backend.entity.Account;
import com.example.backend.repository.AccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService implements UserDetailsService {
    private final AccountRepository accountRepo;

    public UserDetailService(AccountRepository accountRepo) {
        this.accountRepo = accountRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepo.findByUsername(username);
        if(account == null) {
            throw new UsernameNotFoundException(username);
        }
        return new UserPrinciple(account);
    }
}
