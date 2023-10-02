package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {

    @Query("SELECT DISTINCT pct from ProductCategory pct " +
            "LEFT JOIN FETCH pct.productSubCategories")
    List<ProductCateWithSubCate> getAllProductCategoryWithSubCate();
}
