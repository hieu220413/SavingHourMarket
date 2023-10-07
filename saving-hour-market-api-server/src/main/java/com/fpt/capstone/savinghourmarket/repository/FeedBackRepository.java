package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.common.FeedbackObject;
import com.fpt.capstone.savinghourmarket.common.FeedbackStatus;
import com.fpt.capstone.savinghourmarket.entity.FeedBack;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeedBackRepository extends JpaRepository<FeedBack, UUID> {
    @Query("SELECT fb FROM FeedBack fb " +
            "WHERE " +
            "((:object IS NULL) OR (fb.object = :object)) " +
            "AND " +
            "((:status IS NULL) OR (fb.status = :status)) " +
            "AND " +
            "(fb.customer.id = :customerId)")
    List<FeedBack> findFeedbackForCustomer(UUID customerId, FeedbackObject object, FeedbackStatus status, Pageable pageable);

    @Query("SELECT fb FROM FeedBack fb " +
            "WHERE " +
            "((:object IS NULL) OR (fb.object = :object)) " +
            "AND " +
            "((:status IS NULL) OR (fb.status = :status)) " +
            "AND " +
            "((:customerId IS NULL) OR (fb.customer.id = :customerId))")
    List<FeedBack> findFeedBackForStaff(UUID customerId, FeedbackObject object, FeedbackStatus status, Pageable pageable);
}
