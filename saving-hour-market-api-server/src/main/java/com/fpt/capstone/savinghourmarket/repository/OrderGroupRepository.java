package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.OrderGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderGroupRepository extends JpaRepository<OrderGroup, UUID> {
}
