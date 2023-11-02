package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderGroupRepository extends JpaRepository<OrderGroup, UUID> {
    Optional<OrderGroup> findByTimeFrameIdAndPickupPointIdAndDeliverDate(UUID timeFrameId, UUID pickupPointId, LocalDate deliveryDate);

    @Query("SELECT og FROM OrderGroup og " +
            "WHERE " +
            "((:timeFrameId IS NULL) OR (og.timeFrame.id = :timeFrameId)) " +
            "AND " +
            "(og.orderList IS NOT EMPTY) " +
            "AND " +
            "((:pickupPointId IS NULL) OR (og.pickupPoint.id = :pickupPointId)) " +
            "AND " +
            "((:delivererId IS NULL) OR (og.deliverer.id = :delivererId)) " +
            "AND " +
            "((:deliveryDate IS NULL) OR (og.deliverDate = :deliveryDate))")
    List<OrderGroup> findByTimeFrameOrPickupPointOrDeliverDate(UUID timeFrameId, UUID pickupPointId, UUID delivererId, LocalDate deliveryDate);

    @Query("SELECT og FROM OrderGroup og " +
            "JOIN og.deliverer delv " +
            "JOIN og.timeFrame tf " +
            "WHERE delv.id = :staffId " +
            "AND " +
            "(og.deliverDate >= CURRENT_DATE AND tf.toHour > :currentTime )")
    List<OrderGroup> findStaffUpcomingOrderGroupById(UUID staffId, Pageable pageable, LocalTime currentTime);
}
