package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductSubCategoryRepository extends JpaRepository<ProductSubCategory, UUID> {

    @Query("SELECT psct FROM ProductSubCategory psct ")
    List<ProductSubCateOnly> findAllSubCategoryOnly();
}
