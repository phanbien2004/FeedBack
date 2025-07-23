package com.example.backend.mapper;

import com.example.backend.dto.FeedbackDTO;
import com.example.backend.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    @Mapping(source = "account.username", target = "senderCode")
    FeedbackDTO entityToDTO(Feedback feedback);

    @Mapping(source = "account.username", target = "senderCode")
    List<FeedbackDTO> entityToDTOList(List<Feedback> feedbacks);
}
