package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((:packageId IS NULL) OR (o.packager.id = :packageId)) " +
            "AND " +
            "((:status IS NULL) OR (o.status = :status)) " +
            "AND " +
            "(((:isGrouped IS NULL) " +
            "OR " +
            "((:isGrouped = FALSE) AND (o.orderGroup IS NULL)) " +
            "OR " +
            "((:isGrouped = TRUE) AND (o.orderGroup IS NOT NULL)))) " +
            "AND " +
            "(((:isPaid IS NULL) OR (:isPaid = FALSE)) " +
            "OR " +
            "((:isPaid = TRUE) AND (SIZE(o.transaction) > 0)))"
    )
    List<Order> findOrderForStaff(UUID packageId,
                                  Integer status,
                                  Boolean isGrouped,
                                  Boolean isPaid,
                                  Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((o.customer.email = :customerEmail)) " +
            "AND " +
            "((:status IS NULL) OR (o.status = :status)) " +
            "AND " +
            "(((:isPaid IS NULL) OR (:isPaid = FALSE)) " +
            "OR " +
            "((:isPaid = TRUE) AND (SIZE(o.transaction) > 0)))"
    )
    List<Order> findOrderForCustomer(String customerEmail,
                                     Integer status,
                                     Boolean isPaid,
                                     Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "WHERE o.status = 0 AND o.customer.email = :customerEmail")
    List<Order> getOrdersProcessing(String customerEmail);

}
