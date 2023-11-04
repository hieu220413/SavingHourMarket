package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.model.PickupPointWithProductConsolidationArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PickupPointRepository extends JpaRepository<PickupPoint, UUID> {
    String HAVERSINE_FORMULA = "(6371 * acos(cos(radians(:latitude)) * cos(radians(p.latitude)) *" +
            " cos(radians(p.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(p.latitude))))";
    @Query("SELECT p FROM PickupPoint p WHERE p.status = 1 " +
            "ORDER BY " + HAVERSINE_FORMULA)
    List<PickupPoint> getAllSortByDistance(Double latitude, Double longitude);

    @Query("SELECT p FROM PickupPoint  p WHERE p.id IN :pickupPointIdList ")
    List<PickupPoint> getAllByIdList(List<UUID> pickupPointIdList);

    @Query("SELECT p FROM PickupPoint p WHERE p.status = 1 ")
    List<PickupPoint> findAllForCustomer();

    @Query("SELECT p FROM PickupPoint  p " +
            "WHERE " +
            "((:status IS NULL) OR (p.status = :status))")
    List<PickupPointWithProductConsolidationArea> findAllForAdmin(Integer status);
}
