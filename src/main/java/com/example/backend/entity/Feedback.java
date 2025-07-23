package com.example.backend.entity;

import com.example.backend.Enum.Category;
import com.example.backend.Enum.Status;
import com.example.backend.Enum.Type;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String content;
    private String respondedContent;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
    private Category category;
    private Status status;
    private Type type;
    private short ratings;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
}
