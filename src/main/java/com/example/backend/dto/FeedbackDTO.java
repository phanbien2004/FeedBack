package com.example.backend.dto;

import com.example.backend.Enum.Category;
import com.example.backend.Enum.Status;
import com.example.backend.Enum.Type;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackDTO {
    private long id;
    private String senderCode;
    private Category category;
    private String content;
    private String responseContent;
    @JsonFormat(pattern = "HH:mm, dd/MM/yyyy")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "HH:mm, dd/MM/yyyy")
    private LocalDateTime respondedAt;
    private Status status;
    private Type type;
    private short rating;
}
