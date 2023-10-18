package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.CateWithSubCateDiscountUsageReport;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;
import com.fpt.capstone.savinghourmarket.model.DiscountReport;
import com.fpt.capstone.savinghourmarket.model.DiscountsUsageReportResponseBody;
import com.fpt.capstone.savinghourmarket.repository.DiscountRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductSubCategoryRepository;
import com.fpt.capstone.savinghourmarket.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {
    private final DiscountRepository discountRepository;
    private final ProductCategoryRepository productCategoryRepository;

    private final ProductSubCategoryRepository productSubCategoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DiscountOnly> getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType) {
        Sort sortable;
        if(expiredSortType.equals("DESC")){
            sortable = Sort.by("expiredDate").descending();
        } else {
            sortable = Sort.by("expiredDate").ascending();
        }

        Pageable pageable = PageRequest.of(page, limit, sortable);

        List<DiscountOnly> discountList = discountRepository.getDiscountsForStaff(
                isExpiredShown,
                name,
                fromPercentage,
                toPercentage,
                fromDatetime,
                toDatetime,
                productCategoryId == null ? null : UUID.fromString(productCategoryId),
                productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId),
                pageable
        );
        return discountList;
    }

    @Override
    public List<DiscountOnly> getDiscountsForCustomer(String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType) {
        Sort sortable;
        if(expiredSortType.equals("DESC")){
            sortable = Sort.by("expiredDate").descending();
        } else {
            sortable = Sort.by("expiredDate").ascending();
        }

        Pageable pageable = PageRequest.of(page, limit, sortable);

        List<DiscountOnly> discountList = discountRepository.getDiscountsForCustomer(
                name,
                fromPercentage,
                toPercentage,
                fromDatetime,
                toDatetime,
                productCategoryId == null ? null : UUID.fromString(productCategoryId),
                productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId),
                pageable
        );
        return discountList;
    }

    @Override
    public Discount getDiscountById(String discountId) {
        Optional<Discount> discount = discountRepository.findByIdWithAllField(UUID.fromString(discountId));
        if(!discount.isPresent()){
            throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.DISCOUNT_NOT_FOUND.getCode()), AdditionalResponseCode.DISCOUNT_NOT_FOUND.toString());
        }
        return discount.get();
    }

    @Override
    public DiscountsUsageReportResponseBody getPerDiscountUsageReport(Month month, Quarter quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId, UUID productSubCategoryId) {
        LocalDate currentDate = LocalDate.now();
        // get all discount
        List<DiscountOnly> rawDiscountList = discountRepository.getRawDiscountListForReport(fromPercentage, toPercentage, productCategoryId == null ? null : productCategoryId, productSubCategoryId == null ? null : productSubCategoryId);
        HashMap<UUID, DiscountOnly> discountUsageReportHashMap = new HashMap<>();
        if(year == null) {
            year = currentDate.getYear();
        }

        List<DiscountOnly> discountEntityList = discountRepository.getDiscountReport(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId == null ? null : productCategoryId, productSubCategoryId == null ? null : productSubCategoryId);

        DiscountsUsageReportResponseBody discountsUsageReportResponseBody = new DiscountsUsageReportResponseBody();
        for(DiscountOnly discount : discountEntityList) {
            discountUsageReportHashMap.put(discount.getId(), discount);
        }

        for (DiscountOnly rawDiscount : rawDiscountList) {
            // map usage report
            if(discountUsageReportHashMap.containsKey(rawDiscount.getId())){
                discountsUsageReportResponseBody.getDiscountReportList().add(new DiscountReport(rawDiscount, discountUsageReportHashMap.get(rawDiscount.getId()).getQuantity()));
                discountsUsageReportResponseBody.setTotalDiscountUsage(discountsUsageReportResponseBody.getTotalDiscountUsage() + discountUsageReportHashMap.get(rawDiscount.getId()).getQuantity());
            } else {
                discountsUsageReportResponseBody.getDiscountReportList().add(new DiscountReport(rawDiscount, 0));
            }
        }

        discountsUsageReportResponseBody.getDiscountReportList().sort((o1, o2) -> o2.getTotalUsage()-o1.getTotalUsage());

        return discountsUsageReportResponseBody;
    }

    @Override
    public CateWithSubCateDiscountUsageReport getCategoryWithSubCategoryDiscountUsageReport(Month month, Quarter quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId) {
        LocalDate currentDate = LocalDate.now();

        if(year == null) {
            year = currentDate.getYear();
        }

        Optional<ProductCategory> productCategory = productCategoryRepository.findById(productCategoryId);
        if(!productCategory.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.toString());
        }

        // handle category total usage
        ProductCategory productCategoryWithTotalUsage = productCategoryRepository.getCategoryDiscountUsageByCategoryId(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId);

        // handle sub category total usage
        List<ProductSubCategory> rawProductSubCategoryList = productSubCategoryRepository.getAllSubCategoryByCategoryId(productCategoryId);
        List<ProductSubCategory> productSubCategoryReportList = productSubCategoryRepository.getAllSubCategoryDiscountUsageByCategoryId(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId);

        HashMap<UUID, ProductSubCategory> productSubCategoryReportHashmap = new HashMap<>();
        for (ProductSubCategory productSubCategory : productSubCategoryReportList){
            productSubCategoryReportHashmap.put(productSubCategory.getId(), productSubCategory);
        }

        // add total usage to raw product sub category
        for (ProductSubCategory productSubCategory : rawProductSubCategoryList) {
            productSubCategory.setTotalDiscountUsage(0);
            if(productSubCategoryReportHashmap.containsKey(productSubCategory.getId())){
                productSubCategory.setTotalDiscountUsage(productSubCategory.getTotalDiscountUsage() + productSubCategoryReportHashmap.get(productSubCategory.getId()).getTotalDiscountUsage());
            }
        }

        CateWithSubCateDiscountUsageReport cateWithSubCateDiscountUsageReport = new CateWithSubCateDiscountUsageReport();
        cateWithSubCateDiscountUsageReport.setProductCategoryReport(new ProductCategory(productCategory.get().getId(), productCategory.get().getName(), productCategoryWithTotalUsage == null ? 0 : productCategoryWithTotalUsage.getTotalDiscountUsage().longValue()));
        cateWithSubCateDiscountUsageReport.getProductSubCategoryReportList().addAll(rawProductSubCategoryList);

        // add total usage from all sub cate
        for (ProductSubCategory productSubCategory : cateWithSubCateDiscountUsageReport.getProductSubCategoryReportList()) {
            cateWithSubCateDiscountUsageReport.setTotalDiscountUsage(cateWithSubCateDiscountUsageReport.getTotalDiscountUsage() + productSubCategory.getTotalDiscountUsage());
        }
        // add total usage from cate
        cateWithSubCateDiscountUsageReport.setTotalDiscountUsage(cateWithSubCateDiscountUsageReport.getTotalDiscountUsage() + cateWithSubCateDiscountUsageReport.getProductCategoryReport().getTotalDiscountUsage());

        cateWithSubCateDiscountUsageReport.getProductSubCategoryReportList().sort((o1, o2) -> o2.getTotalDiscountUsage() - o1.getTotalDiscountUsage());

        return cateWithSubCateDiscountUsageReport;
    }


}
