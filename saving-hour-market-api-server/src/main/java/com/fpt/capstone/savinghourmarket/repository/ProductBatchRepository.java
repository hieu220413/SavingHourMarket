package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductBatchRepository extends JpaRepository<ProductBatch, UUID> {
    @Query("SELECT pb FROM ProductBatch pb " +
            "JOIN pb.supermarketAddress a " +
            "WHERE a.id = :supermarketAddressId ")
    List<ProductBatch> getProductBatchBySupermarketAddress(UUID supermarketAddressId, PageRequest pageRequest);
}
