package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, UUID> {

    @Query("SELECT DISTINCT d FROM Discount d " +
            "LEFT JOIN d.productCategory cts " +
            "LEFT JOIN  d.productSubCategory subcts " +
            "WHERE " +
            "UPPER(d.name) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "d.percentage  BETWEEN :fromPercentage AND :toPercentage " +
            "AND " +
            "d.expiredDate BETWEEN :fromDatetime AND :toDatetime " +
            "AND " +
            "((:productCategoryId IS NULL) OR (cts.id = :productCategoryId)) " +
            "AND " +
            "((:productSubCategoryId IS NULL) OR (subcts.id = :productSubCategoryId)) " +
            "AND " +
            "((:isExpiredShown IS NULL) OR (:isExpiredShown = TRUE AND d.expiredDate < CURRENT_TIMESTAMP) OR (:isExpiredShown = FALSE AND d.expiredDate > CURRENT_TIMESTAMP)) " +
            "AND d.status = :status")
    Page<Discount> getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, Integer status, UUID productCategoryId, UUID productSubCategoryId, Pageable pageable);

    @Query("SELECT DISTINCT d FROM Discount d " +
            "LEFT JOIN d.productCategory cts " +
            "LEFT JOIN  d.productSubCategory subcts " +
            "WHERE " +
            "UPPER(d.name) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "d.percentage  BETWEEN :fromPercentage AND :toPercentage " +
            "AND " +
            "d.expiredDate BETWEEN :fromDatetime AND :toDatetime " +
            "AND " +
            "((:productCategoryId IS NULL) OR (cts.id = :productCategoryId)) " +
            "AND " +
            "((:productSubCategoryId IS NULL) OR (subcts.id = :productSubCategoryId)) " +
            "AND " +
            "d.expiredDate > CURRENT_TIMESTAMP " +
            "AND d.status = 1 ")
    List<DiscountOnly> getDiscountsForCustomer(String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, UUID productCategoryId, UUID productSubCategoryId, Pageable pageable);


    @Query("SELECT d FROM Discount d " +
            "LEFT JOIN FETCH d.productCategory ct " +
//            "JOIN FETCH d.productCategoryList ct " +
            "LEFT JOIN FETCH d.productSubCategory subct " +
            "LEFT JOIN FETCH subct.productCategory " +
            "WHERE d.id = :id")
    Optional<Discount> findByIdWithAllField(UUID id);

    @Query("SELECT NEW com.fpt.capstone.savinghourmarket.entity.Discount(d.id, d.name, d.percentage, d.imageUrl, COUNT(d.id)) FROM Order ord " +
            "JOIN ord.discountList d " +
            "LEFT JOIN d.productCategory cts ON (:productCategoryId IS NOT NULL AND :productSubCategoryId IS NULL) " +
            "LEFT JOIN d.productSubCategory subcts ON (:productSubCategoryId IS NOT NULL) " +
            "WHERE " +
            "d.percentage  BETWEEN :fromPercentage AND :toPercentage " +
            "AND " +
            "((:productCategoryId IS NULL OR :productSubCategoryId IS NOT NULL) OR (cts.id = :productCategoryId)) " +
            "AND " +
            "((:productSubCategoryId IS NULL) OR (subcts.id = :productSubCategoryId)) " +
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
            "GROUP BY d.id, d.name, d.percentage, d.imageUrl")
    List<DiscountOnly> getDiscountReport(Integer monthValue, Integer quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId, UUID productSubCategoryId);


    @Query("SELECT DISTINCT d FROM Discount d " +
            "LEFT JOIN d.productCategory cts ON (:productCategoryId IS NOT NULL AND :productSubCategoryId IS NULL) " +
            "LEFT JOIN d.productSubCategory subcts ON (:productSubCategoryId IS NOT NULL) " +
            "WHERE " +
            "(d.percentage  BETWEEN :fromPercentage AND :toPercentage) " +
            "AND " +
            "((:productCategoryId IS NULL OR :productSubCategoryId IS NOT NULL) OR (cts.id = :productCategoryId)) " +
            "AND " +
            "((:productSubCategoryId IS NULL) OR (subcts.id = :productSubCategoryId)) ")
    List<DiscountOnly> getRawDiscountListForReport(Integer fromPercentage, Integer toPercentage, UUID productCategoryId, UUID productSubCategoryId);

//    @Query("SELECT d FROM Discount d " +
//            "JOIN FETCH d.productSubCategoryList subcts " +
//            "WHERE " +
//            "UPPER(d.name) LIKE UPPER(CONCAT('%',:name,'%')) " +
//            "AND " +
//            "d.percentage  BETWEEN :fromPercentage AND :toPercentage " +
//            "AND " +
//            "d.expiredDate BETWEEN :fromDatetime AND :toDatetime " +
//            "AND " +
//            "((:productSubCategoryId IS NULL) OR (subcts.id = :productSubCategoryId)) " +
//            "AND " +
//            "((:isExpiredShown IS NULL) OR (:isExpiredShown = TRUE AND d.expiredDate < CURRENT_TIMESTAMP) OR (:isExpiredShown = FALSE AND d.expiredDate > CURRENT_TIMESTAMP)) " +
//            "AND d.status = 1")
//    List<Discount> getDiscountsForStaffWithProductSubCategory(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Pageable pageable);
}
