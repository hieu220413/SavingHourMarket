package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductSubCategoryRepository extends JpaRepository<ProductSubCategory, UUID> {

    @Query("SELECT DISTINCT psct FROM ProductSubCategory psct " +
            "INNER JOIN psct.productList pd " +
            "WHERE " +
            "pd.expiredDate > CURRENT_TIMESTAMP + pd.productSubCategory.allowableDisplayThreshold DAY " +
            "AND pd.quantity > 0" +
            "AND pd.status = 1")
    List<ProductSubCateOnly> findAllSubCategoryOnly();

    Optional<ProductSubCategory> findByName(String name);

    @Query("SELECT sct from ProductSubCategory sct " +
            "JOIN FETCH sct.productCategory " +
            "WHERE sct.id = :subCategoryId")
    Optional<ProductSubCategory> findByIdWithCate(UUID subCategoryId);
}
