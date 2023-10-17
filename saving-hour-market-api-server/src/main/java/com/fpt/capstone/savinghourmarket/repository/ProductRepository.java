package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("SELECT p FROM Product p " +
            "JOIN FETCH p.supermarket " +
            "JOIN FETCH p.productSubCategory " +
            "JOIN FETCH p.productSubCategory.productCategory " +
            "WHERE " +
            "UPPER(p.name) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "((:supermarketId IS NULL) OR (p.supermarket.id = :supermarketId)) " +
            "AND " +
            "((:productCategoryId IS NULL) OR (p.productSubCategory.productCategory.id = :productCategoryId)) " +
            "AND " +
            "((:productSubCategoryId IS NULL) OR (p.productSubCategory.id = :productSubCategoryId)) " +
            "AND " +
            "((:isExpiredShown IS NULL) OR (:isExpiredShown = TRUE AND p.expiredDate < CURRENT_TIMESTAMP) OR (:isExpiredShown = FALSE AND p.expiredDate > CURRENT_TIMESTAMP)) " +
            "AND p.status = 1")

    Page<Product> getProductsForStaff(UUID supermarketId, String name, UUID productCategoryId, UUID productSubCategoryId, Boolean isExpiredShown, Pageable pageable);


    @Query("SELECT p FROM Product p " +
            "JOIN FETCH p.supermarket " +
            "JOIN FETCH p.productSubCategory " +
            "JOIN FETCH p.productSubCategory.productCategory " +
            "WHERE " +
            "UPPER(p.name) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "((:supermarketId IS NULL) OR (p.supermarket.id = :supermarketId)) " +
            "AND " +
            "((:productCategoryId IS NULL) OR (p.productSubCategory.productCategory.id = :productCategoryId)) " +
            "AND " +
            "((:productSubCategoryId IS NULL) OR (p.productSubCategory.id = :productSubCategoryId)) " +
            "AND " +
            "p.expiredDate > CURRENT_TIMESTAMP + p.productSubCategory.allowableDisplayThreshold DAY " +
            "AND p.quantity > 0" +
            "AND p.status = 1")

    Page<Product> getProductsForCustomer(UUID supermarketId, String name, UUID productCategoryId, UUID productSubCategoryId, Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "WHERE p.status = 1 AND p.supermarket.id = :supermarketId ")
    Product getProductByActiveAndSupermarketId(UUID supermarketId, PageRequest of);

    @Query("SELECT p FROM Product p " +
            "JOIN FETCH p.productSubCategory " +
            "JOIN FETCH p.productSubCategory.productCategory " +
            "JOIN FETCH p.supermarket " +
            "WHERE p.id = :id AND p.status = 1")
    Optional<Product> findByIdCustom(UUID id);

    @Query("SELECT NEW com.fpt.capstone.savinghourmarket.entity.Product(ordDetail.product.id, ordDetail.product.name, ordDetail.product.imageUrl, SUM(ordDetail.productPrice * ordDetail.boughtQuantity), SUM(ordDetail.productOriginalPrice * ordDetail.boughtQuantity), SUM(ordDetail.boughtQuantity)) FROM OrderDetail ordDetail " +
            "JOIN ordDetail.order ord " +
            "JOIN ordDetail.product pd " +
            "WHERE " +
            "pd.supermarket.id = :supermarketId " +
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
            "GROUP BY ordDetail.product.id, ordDetail.product.name ")
    List<Product> getProductsReportForSupermarket(UUID supermarketId, Integer monthValue, Integer quarter, Integer year);

    @Query("SELECT p FROM Product p " +
            "WHERE p.supermarket.id = :supermarketId ")
    List<Product> getRawProductFromSupermarketId(UUID supermarketId);


//    @Query(value = "SELECT * FROM product p " +
//            "INNER JOIN product_sub_category subct ON p.product_sub_category_id = subct.id " +
//            "INNER JOIN product_category ct ON subct.product_category_id =  ct.id", nativeQuery = true)
//    List<Product> getProductsForCustomer();
}
