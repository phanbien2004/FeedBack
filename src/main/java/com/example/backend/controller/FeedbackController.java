package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.FeedbackService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@AllArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping("/student")
    public List<FeedbackDTO> getCurrentAccountFeedback(
            @RequestParam(value = "type", defaultValue = "") String type,
            @RequestParam(value = "category", defaultValue = "") String category,
            @RequestParam(value = "sortCriteria", defaultValue = "") String sortCriteria,
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "pageSize", defaultValue = "0") int pageSize,
            @RequestParam(value = "pageNumber", defaultValue = "5") int pageNumber
    ){
        return feedbackService.getCurrentAccountFeedback(
                FeedbackFilterDTO.builder()
                        .type(type)
                        .category(category)
                        .sortCriteria(sortCriteria)
                        .status(status)
                        .pageSize(pageSize)
                        .pageNumber(pageNumber)
                        .build()
        );
    }

    @GetMapping("/department")
    public List<FeedbackDTO> getDepartmentFeedback(
            @RequestParam(value = "category", defaultValue = "") String category,
            @RequestParam(value = "sortCriteria", defaultValue = "") String sortCriteria,
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "pageSize", defaultValue = "0") int pageSize,
            @RequestParam(value = "pageNumber", defaultValue = "5") int pageNumber
    ){
        return feedbackService.getDepartmentFeedback(
                FeedbackFilterDTO.builder()
                        .category(category)
                        .sortCriteria(sortCriteria)
                        .status(status)
                        .pageSize(pageSize)
                        .pageNumber(pageNumber)
                        .build()
        );
    }

    @GetMapping("/executive")
    public List<FeedbackDTO> getExecutiveFeedback(
            @RequestParam(value = "type", defaultValue = "") String type,
            @RequestParam(value = "category", defaultValue = "") String category,
            @RequestParam(value = "sortCriteria", defaultValue = "") String sortCriteria,
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "pageSize", defaultValue = "0") int pageSize,
            @RequestParam(value = "pageNumber", defaultValue = "5") int pageNumber

    ){
        return feedbackService.getExecutiveFeedback(
                FeedbackFilterDTO.builder()
                        .type(type)
                        .category(category)
                        .sortCriteria(sortCriteria)
                        .status(status)
                        .pageSize(pageSize)
                        .pageNumber(pageNumber)
                        .build()
        );
    }

    @PostMapping("/send")
    public String sendFeedback(@RequestBody FeedbackRequestDTO request){
        return feedbackService.sendFeedback(request);
    }

    @PutMapping("/rate")
    @PreAuthorize("hasRole('STUDENT')")
    public FeedbackDTO rateFeedback(@RequestBody RateRequestDTO request){
        return feedbackService.rateFeedback(request);
    }

    @PutMapping("/response")
    @PreAuthorize("hasRole('EXECUTIVE') || hasRole('DEPARTMENT')")
    public FeedbackDTO responseFeedback(ResponseRequestDTO request){
        return feedbackService.responseFeedback(request);
    }

    @DeleteMapping("/delete/{feedbackId}")
    public String deleteFeedback(@PathVariable long feedbackId){
        return feedbackService.deleteFeedback(feedbackId);
    }
}
