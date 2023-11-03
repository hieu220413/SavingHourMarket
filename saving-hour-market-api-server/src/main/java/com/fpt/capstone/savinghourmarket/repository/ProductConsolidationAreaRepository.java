package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository

public interface ProductConsolidationAreaRepository extends JpaRepository<ProductConsolidationArea, UUID> {

    @Query("SELECT a FROM ProductConsolidationArea a " +
            "LEFT JOIN FETCH a.pickupPointList " +
            "WHERE " +
            "((:status IS NULL) OR (a.status = :status))")
    List<ProductConsolidationArea> getAllWithPickupPoint(Integer status);
}
