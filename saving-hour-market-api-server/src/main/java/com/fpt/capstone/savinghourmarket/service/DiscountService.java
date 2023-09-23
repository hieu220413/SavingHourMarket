package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;

import java.time.LocalDateTime;
import java.util.List;

public interface DiscountService {
    List<DiscountOnly> getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType);

    List<DiscountOnly> getDiscountsForCustomer(String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType);


    Discount getDiscountById(String discountId);
}
