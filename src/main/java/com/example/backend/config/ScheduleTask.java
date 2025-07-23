package com.example.backend.config;

import com.example.backend.Enum.Status;
import com.example.backend.entity.Feedback;
import com.example.backend.repository.FeedbackRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class ScheduleTask {
    private final FeedbackRepository feedbackRepo;

    @Scheduled(fixedRate = 15000)
    public void checkExpiredFeedback(){
        LocalDateTime expiryThreshold = LocalDateTime.now().minusDays(7);
        feedbackRepo.findAll()
                .stream()
                .filter(feedback -> feedback.getCreatedAt().isBefore(expiryThreshold))
                .forEach(feedback -> {
                    feedback.setStatus(Status.EXPIRED);
                    feedbackRepo.save(feedback);
                });
    }
}
