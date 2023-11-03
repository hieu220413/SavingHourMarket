package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimeFrameRepository extends JpaRepository<TimeFrame, UUID> {
    @Query("SELECT DISTINCT og.timeFrame FROM OrderGroup og ")
    List<TimeFrame> findForPickupPoint();

    @Query("SELECT tf FROM TimeFrame tf " +
            "WHERE tf.toHour <= :endTime")
    List<TimeFrame> findForHomeDelivery(LocalTime endTime);

    @Query("SELECT t FROM TimeFrame t " +
            "WHERE t.status = 1 ")
    List<TimeFrame> findAllForCustomer();

    @Query("SELECT t FROM TimeFrame t " +
            "WHERE " +
            "((:status IS NULL) OR (t.status = :status))")
    List<TimeFrame> findAllForAdmin(Integer status);

    @Query("SELECT t from TimeFrame t " +
            "WHERE " +
            "t.fromHour = :fromHour AND t.toHour = :toHour")
    Optional<TimeFrame> findByFromHourAndToHour(LocalTime fromHour, LocalTime toHour);
}
