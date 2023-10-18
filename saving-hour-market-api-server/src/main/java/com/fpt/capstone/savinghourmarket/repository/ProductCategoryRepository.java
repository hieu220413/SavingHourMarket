package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {

    @Query("SELECT DISTINCT pct from ProductCategory pct " +
            "LEFT JOIN FETCH pct.productSubCategories psct " +
            "INNER JOIN psct.productList pd " +
            "WHERE " +
            "pd.expiredDate > CURRENT_TIMESTAMP + pd.productSubCategory.allowableDisplayThreshold DAY " +
            "AND pd.quantity > 0" +
            "AND pd.status = 1")
//            "WHERE SIZE(psct.productList) > 0 "
    List<ProductCateWithSubCate> getAllProductCategoryWithSubCate();

    Optional<ProductCategory> findByName(String trim);

    @Query("SELECT NEW com.fpt.capstone.savinghourmarket.entity.ProductCategory(ct.id, ct.name, COUNT(ct.id)) FROM Order ord " +
            "JOIN ord.discountList d " +
            "JOIN d.productCategory ct " +
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
            "GROUP BY ct.id, ct.name")
    ProductCategory getCategoryDiscountUsageByCategoryId(Integer monthValue, Integer quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId);
}
