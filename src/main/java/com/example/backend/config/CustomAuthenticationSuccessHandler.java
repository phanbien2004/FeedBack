package com.example.backend.config;

import com.example.backend.Enum.Role;
import com.example.backend.entity.Account;
import com.example.backend.repository.AccountRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String directUrl = "";
        for(GrantedAuthority auth : authorities){
            String role = auth.getAuthority();
            if(role.equals("ROLE_STUDENT")){
                directUrl = "http://100.102.90.90:5173/student";
            }else if (role.equals("ROLE_DEPARTMENT")){
                directUrl = "http://100.102.90.90:5173/department";
            }else{
                directUrl = "http://100.102.90.90:5173/management";
            }
        }
        response.sendRedirect(directUrl);
    }
}
