package com.example.backend.service;

import com.example.backend.dto.*;

import java.util.List;

public interface FeedbackService {
    List<FeedbackDTO> getCurrentAccountFeedback(FeedbackFilterDTO feedbackFilterDTO);

    String sendFeedback(FeedbackRequestDTO request);

    FeedbackDTO rateFeedback(RateRequestDTO request);

    FeedbackDTO responseFeedback(ResponseRequestDTO request);

    List<FeedbackDTO> getExecutiveFeedback(FeedbackFilterDTO build);

    List<FeedbackDTO> getDepartmentFeedback(FeedbackFilterDTO build);

    String deleteFeedback(long feedbackId);
}
