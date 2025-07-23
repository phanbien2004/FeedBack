package com.example.backend.mapper;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDTO accountToDto(Account account);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "ratings", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "responses", ignore = true)
    Account dtoToAccount(AccountDTO accountDTO);
}
