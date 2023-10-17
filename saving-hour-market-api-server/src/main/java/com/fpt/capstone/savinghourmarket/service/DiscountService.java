package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;
import com.fpt.capstone.savinghourmarket.model.DiscountsUsageReportResponseBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface DiscountService {
    List<DiscountOnly> getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType);

    List<DiscountOnly> getDiscountsForCustomer(String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType);


    Discount getDiscountById(String discountId);

    DiscountsUsageReportResponseBody getPerDiscountUsageReport(Month month, Quarter quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId, UUID productSubCategoryId);
}
