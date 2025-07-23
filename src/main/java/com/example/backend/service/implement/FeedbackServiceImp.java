package com.example.backend.service.implement;

import com.example.backend.Enum.Category;
import com.example.backend.Enum.Status;
import com.example.backend.Enum.Type;
import com.example.backend.dto.*;
import com.example.backend.entity.Account;
import com.example.backend.entity.Feedback;
import com.example.backend.mapper.FeedbackMapper;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.FeedbackFilterRepository;
import com.example.backend.repository.FeedbackRepository;
import com.example.backend.service.AccountService;
import com.example.backend.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class FeedbackServiceImp implements FeedbackService {

    private final FeedbackFilterRepository feedbackFilterRepo;
    private final AccountService accountService;
    private final AccountRepository accountRepo;
    private final FeedbackRepository feedbackRepo;
    private final FeedbackMapper feedbackMapper;

    @Override
    public List<FeedbackDTO> getCurrentAccountFeedback(FeedbackFilterDTO feedbackFilterDTO) {
        feedbackFilterDTO.setStudentCode(accountService.getCurrentAccount().getUsername());
        List<Feedback> feedbacks = feedbackFilterRepo.filterFeedback(feedbackFilterDTO);
        return feedbackMapper.entityToDTOList(feedbacks);
    }

    @Override
    public String sendFeedback(FeedbackRequestDTO request) {
        Feedback feedback = new Feedback();
        Account account = accountService.getCurrentAccount();
        feedback.setContent(request.getContent());
        Type type = Type.valueOf(request.getType());
        if(type.equals(Type.URGENT)) account.setSos((short)0);
        feedback.setType(type);
        feedback.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
        feedback.setAccount(account);
        feedback.setStatus(Status.PROCESSING);
        feedback.setCreatedAt(LocalDateTime.now());
        accountRepo.save(account);
        feedbackRepo.save(feedback);
        return "Feedback sent successfully";
    }

    @Override
    public FeedbackDTO rateFeedback(RateRequestDTO request) {
        Feedback feedback = feedbackRepo.findById(request.getFeedbackId()).orElse(null);
        feedback.setRatings(request.getNumber());
        feedbackRepo.save(feedback);
        return feedbackMapper.entityToDTO(feedback);
    }

    @Override
    public FeedbackDTO responseFeedback(ResponseRequestDTO request) {
        Feedback feedback = feedbackRepo.findById(request.getFeedbackId()).orElse(null);
        feedback.setRespondedContent(request.getContent());
        feedback.setRespondedAt(LocalDateTime.now());
        feedbackRepo.save(feedback);
        return feedbackMapper.entityToDTO(feedback);
    }

    @Override
    public List<FeedbackDTO> getExecutiveFeedback(FeedbackFilterDTO feedbackFilter) {
        List<Feedback> feedbacks = feedbackFilterRepo.filterFeedback(feedbackFilter);
        return feedbackMapper.entityToDTOList(feedbacks);
    }

    @Override
    public List<FeedbackDTO> getDepartmentFeedback(FeedbackFilterDTO filterDTO) {
        filterDTO.setType("NORMAL");
        List<Feedback> feedbacks = feedbackFilterRepo.filterFeedback(filterDTO);
        return feedbackMapper.entityToDTOList(feedbacks);
    }

    @Override
    public String deleteFeedback(long feedbackId) {
        feedbackRepo.deleteById(feedbackId);
        return "Feedback deleted successfully";
    }
}