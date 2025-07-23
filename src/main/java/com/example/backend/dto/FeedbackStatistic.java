package com.example.backend.dto;

import lombok.Data;

@Data
public class FeedbackStatistic {
    private int total;
    private int replied;
    private int nonReplied;
    private int sosFeedback;
}
