package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PickupPointRepository extends JpaRepository<PickupPoint, UUID> {
}
