package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT NEW com.fpt.capstone.savinghourmarket.entity.ProductSubCategory(subcts.id, subcts.name, subcts.imageUrl, subcts.allowableDisplayThreshold, COUNT(subcts.id)) FROM Order ord " +
            "JOIN ord.discountList d " +
            "JOIN d.productSubCategory subcts " +
            "JOIN subcts.productCategory ct " +
            "WHERE " +
            "ct.id = :productCategoryId " +
            "AND " +
            "(d.percentage  BETWEEN :fromPercentage AND :toPercentage) " +
            "AND " +
            "((:quarter IS NOT NULL) OR ((:monthValue IS NULL) OR EXTRACT(MONTH FROM ord.createdTime) =  :monthValue)) " +
            "AND " +
            "((:quarter IS NULL) " +
            "OR " +
            "((:quarter = 1) AND (EXTRACT(MONTH FROM ord.createdTime) BETWEEN 1 and 3)) " +
            "OR " +
            "((:quarter = 2) AND (EXTRACT(MONTH FROM ord.createdTime) BETWEEN 4 and 6)) " +
            "OR " +
            "((:quarter = 3) AND (EXTRACT(MONTH FROM ord.createdTime) BETWEEN 7 and 9)) " +
            "OR " +
            "((:quarter = 4) AND (EXTRACT(MONTH FROM ord.createdTime) BETWEEN 10 and 12)) " +
            ")" +
            "AND " +
            "EXTRACT(YEAR FROM ord.createdTime) = :year " +
            "AND ord.status = 4 " +
            "GROUP BY subcts.id, subcts.name, subcts.imageUrl, subcts.allowableDisplayThreshold")
    List<ProductSubCategory> getAllSubCategoryDiscountUsageByCategoryId(Integer monthValue, Integer quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId);

    @Query("SELECT NEW com.fpt.capstone.savinghourmarket.entity.ProductSubCategory(sct.id, sct.name, sct.imageUrl, sct.allowableDisplayThreshold) FROM ProductSubCategory sct " +
            "JOIN sct.productCategory ct " +
            "WHERE ct.id = :productCategoryId")
    List<ProductSubCategory> getAllSubCategoryByCategoryId(UUID productCategoryId);

    @Query("SELECT DISTINCT psct FROM ProductSubCategory psct " +
            "WHERE " +
            "((:productCategoryId IS NULL) OR (psct.productCategory.id = :productCategoryId)) " +
            "AND " +
            "UPPER(psct.name) LIKE UPPER(CONCAT('%',:name,'%')) ")
    Page<ProductSubCateOnly> findAllSubCategoryOnlyForStaff(String name, UUID productCategoryId, Pageable pageable);
}
