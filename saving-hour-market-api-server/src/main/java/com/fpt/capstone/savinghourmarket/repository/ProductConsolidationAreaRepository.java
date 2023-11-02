package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository

public interface ProductConsolidationAreaRepository extends JpaRepository<ProductConsolidationArea, UUID> {
}
