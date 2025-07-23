package com.example.backend.dto;

import lombok.Data;

@Data
public class FeedbackRequestDTO {
    public String content;
    public String type;
    public String category;
}
