package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedbackFilterDTO {
    private String type;
    private String category;
    private String sortCriteria;
    private String status;
    private String studentCode;
    private int pageSize;
    private int pageNumber;
}
