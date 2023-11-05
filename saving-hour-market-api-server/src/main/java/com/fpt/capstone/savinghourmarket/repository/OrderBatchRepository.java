package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.OrderBatch;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderBatchRepository extends JpaRepository<OrderBatch, UUID> {
    Optional<OrderBatch> findByDistrictAndDeliverDate(String district, LocalDate deliveryDate);

    @Query("SELECT ob from OrderBatch  ob " +
            "WHERE " +
            "((:district IS NULL) OR (ob.district = :district)) " +
            "AND " +
            "((:deliveryDate IS NULL) OR (ob.deliverDate = :deliveryDate)) " +
            "AND " +
            "((:delivererId IS NULL) OR (ob.deliverer.id = :delivererId)) "+
            "AND " +
            "(ob.orderList IS NOT EMPTY) ")
    List<OrderBatch> findByDistrictOrDeliverDate(String district, LocalDate deliveryDate,UUID delivererId);

    @Query("SELECT ob FROM OrderBatch ob " +
            "JOIN ob.deliverer delv " +
            "WHERE delv.id = :staffId " +
            "AND ob.deliverDate >= CURRENT_DATE")
    List<OrderBatch> findStaffUpcomingOrderBatchById(UUID staffId, Pageable pageable);
}
