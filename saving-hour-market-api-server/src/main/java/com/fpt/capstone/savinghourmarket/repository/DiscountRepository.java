package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;
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
            "LEFT JOIN d.productCategoryList cts " +
            "LEFT JOIN  d.productSubCategoryList subcts " +
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
            "AND d.status = 1")
    List<DiscountOnly> getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, UUID productCategoryId, UUID productSubCategoryId, Pageable pageable);

    @Query("SELECT DISTINCT d FROM Discount d " +
            "LEFT JOIN d.productCategoryList cts " +
            "LEFT JOIN  d.productSubCategoryList subcts " +
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
//            "JOIN FETCH d.productCategoryList ct " +
            "LEFT JOIN FETCH d.productSubCategoryList subct " +
            "LEFT JOIN FETCH subct.productCategory " +
            "WHERE d.id = :id")
    Optional<Discount> findByIdWithAllField(UUID id);

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
