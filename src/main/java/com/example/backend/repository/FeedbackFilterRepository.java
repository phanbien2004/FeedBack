package com.example.backend.repository;

import com.example.backend.Enum.Category;
import com.example.backend.Enum.Status;
import com.example.backend.Enum.Type;
import com.example.backend.dto.FeedbackFilterDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.Feedback;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@AllArgsConstructor
public class FeedbackFilterRepository {
    private final EntityManager em;

    public List<Feedback> filterFeedback(FeedbackFilterDTO filterDTO){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Feedback> cq = cb.createQuery(Feedback.class);

        Root<Feedback> root = cq.from(Feedback.class);
        Join<Feedback, Account> join = root.join("account");

        List<Predicate> predicates = new ArrayList<>();
        if(filterDTO.getStudentCode() != null){
            predicates.add(cb.equal(join.get("studentCode"), filterDTO.getStudentCode()));
        }
        if(!filterDTO.getType().isBlank()){
            predicates.add(cb.equal(root.get("type"), Type.valueOf(filterDTO.getType().toUpperCase())));
        }
        if(!filterDTO.getCategory().isBlank()){
            predicates.add(cb.equal(root.get("category"), Category.valueOf(filterDTO.getCategory().toUpperCase())));
        }
        if(!filterDTO.getStatus().isBlank()){
            predicates.add(cb.equal(root.get("status"), Status.valueOf(filterDTO.getStatus().toUpperCase())));
        }
        if(!filterDTO.getSortCriteria().isBlank()){
            String[] condition = filterDTO.getSortCriteria().split("_");
            if(condition[0].equals("sendTime")){
                cq.orderBy(condition[1].equals("asc") ? cb.asc(root.get("createdAt")) : cb.desc(root.get("createdAt")));
            }else{
                cq.orderBy(condition[1].equals("asc") ? cb.asc(root.get("respondedAt")) : cb.desc(root.get("responsedAt")));
            }
        }
        cq.where(predicates.toArray(new Predicate[0]));
        TypedQuery<Feedback> query = em.createQuery(cq);
        query.setFirstResult(filterDTO.getPageNumber()*filterDTO.getPageSize());
        query.setMaxResults(filterDTO.getPageSize());
        return query.getResultList();
    }
}
