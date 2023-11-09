package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.OrderDetail;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, UUID> {
    @Query("SELECT od FROM OrderDetail od " +
            "WHERE " +
            "(((:pickupPointId IS NULL) AND (od.order.pickupPoint IN :pickupPointList)) OR (od.order.pickupPoint.id = :pickupPointId)) " +
            "AND " +
            "(od.order.status = 1) " +
            "AND " +
            "(od.order.packager.id = :staffId) " +
            "AND " +
            "((:supermarketId IS NULL) OR (od.product.supermarket.id = :supermarketId))")
    List<OrderDetail> findOrderDetailsByOrderPackaging(List<PickupPoint> pickupPointList,UUID pickupPointId ,UUID supermarketId,UUID staffId, Pageable pageable);
}
