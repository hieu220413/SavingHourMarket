package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((:packageId IS NULL) OR (o.packager.id = :packageId)) " +
            "AND " +
            "((:deliveryDate IS NULL) OR (o.deliveryDate = :deliveryDate)) " +
            "AND " +
            "((:deliverId IS NULL) OR (o.deliverer.id = :deliverId)) " +
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
    List<Order> findOrderForStaff(Date deliveryDate,
                                  UUID packageId,
                                  UUID deliverId,
                                  Integer status,
                                  Boolean isGrouped,
                                  Boolean isPaid,
                                  Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((:deliveryDate IS NULL) OR (o.deliveryDate = :deliveryDate)) " +
            "AND " +
            "(((:pickupPointId IS NULL) AND (o.pickupPoint IN :pickupPointList)) OR (o.pickupPoint.id = :pickupPointId)) " +
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
    List<Order> findOrderForPackageStaff(UUID pickupPointId,
                                         Date deliveryDate,
                                         List<PickupPoint> pickupPointList,
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
            "WHERE o.status = 0 " +
            "AND o.customer.email = :customerEmail")
    List<Order> getOrdersProcessing(String customerEmail);

    @Query("SELECT o FROM Order o " +
            "JOIN o.customer cs " +
            "WHERE cs.id = :customerId " +
            "AND o.status IN :statusList")
    List<Order> findCustomerProcessingOrderById(UUID customerId, Pageable pageable, List<Integer> statusList);


    @Query("SELECT o FROM Order o " +
            "JOIN o.packager pk " +
            "WHERE pk.id = :staffId " +
            "AND o.status IN :statusList")
    List<Order> findStaffProcessingOrderById(UUID staffId, Pageable pageable, List<Integer> statusList);

    @Query("SELECT o FROM Order o " +
            "JOIN o.timeFrame tf " +
            "WHERE tf.id = :timeFrameId " +
            "AND o.status IN :statusList")
    List<Order> findTimeFrameInProcessingOrderById(UUID timeFrameId, Pageable pageable, List<Integer> statusList);
}
