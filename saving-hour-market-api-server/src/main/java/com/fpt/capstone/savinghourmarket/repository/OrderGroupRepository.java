package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import org.springframework.data.domain.Page;
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
            "(((:getOldOrderGroup IS NULL) " +
            "OR " +
            "((:getOldOrderGroup = FALSE) AND (og.deliverDate > CURRENT_DATE)) " +
            "OR " +
            "((:getOldOrderGroup = TRUE)))) " +
            "AND " +
            "(((:pickupPointId IS NULL) AND (og.pickupPoint IN :pickupPointList)) OR (og.pickupPoint.id = :pickupPointId)) " +
            "AND " +
            "(og.orderList IS NOT EMPTY) " +
            "AND " +
            "((:pickupPointId IS NULL) OR (og.pickupPoint.id = :pickupPointId)) " +
            "AND " +
            "((:delivererId IS NULL) OR (og.deliverer.id = :delivererId)) " +
            "AND " +
            "((:deliveryDate IS NULL) OR (og.deliverDate = :deliveryDate))")
    List<OrderGroup> findByTimeFrameOrPickupPointOrDeliverDateForPackageStaff(List<PickupPoint> pickupPointList,
                                                                              Boolean getOldOrderGroup,
                                                                              UUID timeFrameId,
                                                                              UUID pickupPointId,
                                                                              UUID delivererId,
                                                                              LocalDate deliveryDate,
                                                                              Pageable pageable);

    @Query("SELECT og FROM OrderGroup og " +
            "WHERE " +
            "((:timeFrameId IS NULL) OR (og.timeFrame.id = :timeFrameId)) " +
            "AND " +
            "(((:getOldOrderGroup IS NULL) " +
            "OR " +
            "((:getOldOrderGroup = FALSE) AND (og.deliverDate >= CURRENT_DATE)) " +
            "OR " +
            "((:getOldOrderGroup = TRUE)))) " +
            "AND " +
            "(og.orderList IS NOT EMPTY) " +
            "AND " +
            "((:pickupPointId IS NULL) OR (og.pickupPoint.id = :pickupPointId)) " +
            "AND " +
            "((:delivererId IS NULL) OR (og.deliverer.id = :delivererId)) " +
            "AND " +
            "((:deliveryDate IS NULL) OR (og.deliverDate = :deliveryDate))")
    Page<OrderGroup> findByTimeFrameOrPickupPointOrDeliverDate(
                                                               Boolean getOldOrderGroup,
                                                               UUID timeFrameId,
                                                               UUID pickupPointId,
                                                               UUID delivererId,
                                                               LocalDate deliveryDate,
                                                               Pageable pageable);

    @Query("SELECT og FROM OrderGroup og " +
            "JOIN og.deliverer delv " +
            "JOIN og.timeFrame tf " +
            "WHERE delv.id = :staffId " +
            "AND " +
            "(og.deliverDate >= CURRENT_DATE AND tf.toHour > :currentTime )")
    List<OrderGroup> findStaffUpcomingOrderGroupById(UUID staffId, Pageable pageable, LocalTime currentTime);
}
