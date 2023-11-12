package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository

public interface ProductConsolidationAreaRepository extends JpaRepository<ProductConsolidationArea, UUID> {

    @Query("SELECT a FROM ProductConsolidationArea a " +
            "LEFT JOIN FETCH a.pickupPointList " +
            "WHERE " +
            "((:status IS NULL) OR (a.status = :status))")
    List<ProductConsolidationArea> getAllWithPickupPointForStaff(Integer status);

    Optional<ProductConsolidationArea> findByAddress(String address);

    @Query("SELECT a FROM ProductConsolidationArea a " +
            "WHERE a.latitude = :latitude AND a.longitude = :longitude")
    Optional<ProductConsolidationArea> findByLongitudeAndLatitude(Double latitude, Double longitude);

    @Query("SELECT pca FROM ProductConsolidationArea  pca WHERE pca.id IN :productConsolidationAreaIdList ")
    List<ProductConsolidationArea> getAllByIdList(List<UUID> productConsolidationAreaIdList);

    @Query("SELECT a FROM ProductConsolidationArea a " +
            "LEFT JOIN a.pickupPointList pp " +
            "WHERE " +
            "pp.id = :pickupPointId " +
            "AND " +
            "a.status = 1")
    List<ProductConsolidationArea> getByPickupPoint(UUID pickupPointId);

    @Query("SELECT DISTINCT a FROM ProductConsolidationArea a " +
            "LEFT JOIN FETCH a.pickupPointList " +
            "WHERE " +
            "((:status IS NULL) OR (a.status = :status))")
    Page<ProductConsolidationArea> getAllWithPickupPointForAdmin(Integer status, Pageable pageable);
}
