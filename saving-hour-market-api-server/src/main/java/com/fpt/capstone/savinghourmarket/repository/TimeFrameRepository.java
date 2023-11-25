package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimeFrameRepository extends JpaRepository<TimeFrame, UUID> {
    @Query("SELECT tf FROM TimeFrame tf WHERE (tf.allowableDeliverMethod = 0 OR tf.allowableDeliverMethod = 2) AND tf.status = 1 ")
    List<TimeFrame> findForPickupPoint();

    @Query("SELECT tf FROM TimeFrame tf " +
            "WHERE tf.id = :timeFrameId AND tf.status = 1")
    Optional<TimeFrame> findTimeFrameActiveById(UUID timeFrameId);

    @Query("SELECT tf FROM TimeFrame tf " +
            "WHERE (tf.allowableDeliverMethod = 1 OR tf.allowableDeliverMethod = 2) AND tf.status = 1")
    List<TimeFrame> findForHomeDelivery(LocalTime endTime);

    @Query("SELECT t FROM TimeFrame t " +
            "WHERE t.status = 1 ")
    List<TimeFrame> findAllForCustomer();

    @Query("SELECT t FROM TimeFrame t " +
            "WHERE " +
            "((:status IS NULL) OR (t.status = :status))")
    List<TimeFrame> findAllForStaff(Integer status);

    @Query("SELECT t from TimeFrame t " +
            "WHERE " +
            "t.fromHour = :fromHour AND t.toHour = :toHour")
    Optional<TimeFrame> findByFromHourAndToHour(LocalTime fromHour, LocalTime toHour);

    @Query("SELECT t FROM TimeFrame t " +
            "WHERE " +
            "((:status IS NULL) OR (t.status = :status))")
    Page<TimeFrame> findAllForAdmin(Integer status, Pageable pageable);

    @Query("SELECT t from TimeFrame t " +
            "WHERE " +
            "t.fromHour = :hour OR t.toHour = :hour")
    List<TimeFrame> findByHour(LocalTime hour);
}
