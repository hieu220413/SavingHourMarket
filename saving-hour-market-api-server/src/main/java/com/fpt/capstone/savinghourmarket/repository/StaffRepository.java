package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffRepository extends JpaRepository<Staff, UUID> {
    Optional<Staff> getStaffByEmail(String email);
    Optional<Staff> findByEmail(String email);

    @Query("SELECT DISTINCT s FROM Staff s " +
            "LEFT JOIN FETCH s.pickupPoint " +
            "WHERE UPPER(s.fullName) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "((:status IS NULL) OR (s.status = :status)) " +
            "AND " +
            "((:role IS NULL) OR (s.role = :role))")

    Page<Staff> getStaffForAdmin(String name, String role, Integer status, Pageable pageable);

    @Query("SELECT DISTINCT s FROM Staff s " +
            "JOIN s.orderGroupList og " +
//            "LEFT JOIN FETCH s.pickupPoint " +
            "WHERE " +
            "UPPER(s.fullName) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "((og.deliverDate = :deliverDate) AND ((:fromTime BETWEEN og.timeFrame.fromHour AND og.timeFrame.toHour) OR (:toTime BETWEEN og.timeFrame.fromHour AND og.timeFrame.toHour)))" +
            "AND " +
            "s.status = 1 " +
            "AND " +
            "s.role = :role")
    List<Staff> getStaffWithDeliverDateAndTimeFrame(String name, String role, LocalDate deliverDate, LocalTime fromTime, LocalTime toTime);

    @Query("SELECT DISTINCT s FROM Staff s " +
            "LEFT JOIN s.orderGroupList og " +
//            "LEFT JOIN FETCH s.pickupPoint " +
            "WHERE " +
            "UPPER(s.fullName) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "s.status = 1 " +
            "AND " +
            "s.role = :role")
    List<Staff> getAllStaffForDeliverManager(String name, String role);

    @Query("SELECT DISTINCT s FROM Staff s " +
            "JOIN s.orderList o " +
//            "LEFT JOIN FETCH s.pickupPoint " +
            "WHERE " +
            "UPPER(s.fullName) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "((o.deliveryDate = :deliverDate) AND ((:fromHour BETWEEN o.timeFrame.fromHour AND o.timeFrame.toHour) OR (:toHour BETWEEN o.timeFrame.fromHour AND o.timeFrame.toHour)))" +
            "AND " +
            "(o.orderGroup IS NULL) " +
            "AND " +
            "s.status = 1 " +
            "AND " +
            "s.role = :role")
    List<Staff> getStaffWithDeliverDateAndTimeFrameByDoorToDoorOrder(String name, String role, LocalDate deliverDate, LocalTime fromHour, LocalTime toHour);

    @Query("SELECT s.id, COUNT(s.id) FROM Staff s " +
            "JOIN s.orderBatchList obl " +
//            "LEFT JOIN FETCH s.pickupPoint " +
            "WHERE " +
            "s.id IN :staffIdList " +
            "AND " +
            "((obl.deliverDate = :deliverDate) AND ((:fromHour BETWEEN obl.timeFrame.fromHour AND obl.timeFrame.toHour) OR (:toHour BETWEEN obl.timeFrame.fromHour AND obl.timeFrame.toHour)))" +
            "AND " +
            "s.status = 1 " +
            "GROUP BY s.id")
    List<Object[]> countCollideBatchForStaff(List<UUID> staffIdList, LocalDate deliverDate, LocalTime fromHour, LocalTime toHour);
}
