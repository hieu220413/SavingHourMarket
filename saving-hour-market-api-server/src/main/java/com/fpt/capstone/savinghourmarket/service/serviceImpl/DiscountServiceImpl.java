package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.DiscountRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductSubCategoryRepository;
import com.fpt.capstone.savinghourmarket.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {
    private final DiscountRepository discountRepository;
    private final ProductCategoryRepository productCategoryRepository;

    private final ProductSubCategoryRepository productSubCategoryRepository;

    @Override
    @Transactional(readOnly = true)
    public DiscountForStaffListResponseBody getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, Integer page, Integer limit, String expiredSortType, EnableDisableStatus status) {
        Sort sortable;
        if (expiredSortType.equals("DESC")) {
            sortable = Sort.by("expiredDate").descending();
        } else {
            sortable = Sort.by("expiredDate").ascending();
        }

        Pageable pageable = PageRequest.of(page, limit, sortable);

        Page<Discount> result = discountRepository.getDiscountsForStaff(
                isExpiredShown,
                name,
                fromPercentage,
                toPercentage,
                fromDatetime,
                toDatetime,
                status == null ? EnableDisableStatus.ENABLE.ordinal() : status.ordinal(),
                productCategoryId == null ? null : UUID.fromString(productCategoryId),
//                productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId),
                pageable
        );

        int totalPage = result.getTotalPages();
        long totalDiscount = result.getTotalElements();
        List<Discount> discountList = result.stream().toList();

        List<DiscountForStaff> discountForStaffList = discountList.stream().map(DiscountForStaff::new).collect(Collectors.toList());
        return new DiscountForStaffListResponseBody(discountForStaffList, totalPage, totalDiscount);
    }

    @Override
    public List<DiscountOnly> getDiscountsForCustomer(String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, Integer page, Integer limit, String expiredSortType) {
        Sort sortable;
        if (expiredSortType.equals("DESC")) {
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
//                productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId),
                pageable
        );
        return discountList;
    }

    @Override
    public Discount getDiscountById(String discountId) {
        Optional<Discount> discount = discountRepository.findByIdWithAllField(UUID.fromString(discountId));
        if (!discount.isPresent()) {
            throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.DISCOUNT_NOT_FOUND.getCode()), AdditionalResponseCode.DISCOUNT_NOT_FOUND.toString());
        }
        return discount.get();
    }

    @Override
    public List<DiscountsUsageReportEachMonth> getDiscountUsageReportForEachMonth(Integer year, Integer fromPercentage, Integer toPercentage) {
        LocalDate currentDate = LocalDate.now();

        if (year == null) {
            year = currentDate.getYear();
        }

        List<Object[]> discountUsageResult = discountRepository.getDiscountReportUsageMonthly(year, fromPercentage, toPercentage);
        // map result
        List<DiscountsUsageReportEachMonth> discountsUsageReportEachMonthList = discountUsageResult.stream().map(result -> (DiscountsUsageReportEachMonth) result[1]).collect(Collectors.toList());
        HashMap<Integer, DiscountsUsageReportEachMonth> discountsUsageReportEachMonthHashMap = new HashMap<>();
        discountsUsageReportEachMonthList.stream().forEach(discountsUsageReportEachMonth -> {
            discountsUsageReportEachMonthHashMap.put(discountsUsageReportEachMonth.getMonthValue(), discountsUsageReportEachMonth);
        });

        // 12 months
        for (int i = 1; i <= 12; i++) {
            if (!discountsUsageReportEachMonthHashMap.containsKey(i)) {
                discountsUsageReportEachMonthList.add(new DiscountsUsageReportEachMonth(i, Long.parseLong("0")));
            }
        }

        discountsUsageReportEachMonthList.sort((o1, o2) -> o1.getMonthValue() - o2.getMonthValue());
//        revenueReportResponseBody.setTotalIncome((RevenueReportResponseBody) revenueResult[0]);
//        revenueReportResponseBody.setTotalInvestment((Long) revenueResult[1]);
//        revenueReportResponseBody.setTotalSale((Long) revenueResult[2]);

//        revenueReportResponseBody.setTotalDifferentAmount(revenueReportResponseBody.getTotalIncome()- revenueReportResponseBody.getTotalPriceOriginal());

        return discountsUsageReportEachMonthList;
    }

    @Override
    public List<CategoryDiscountUsageReport> getAllCategoryDiscountUsageReport(Month month, Quarter quarter, Integer year, Integer fromPercentage, Integer toPercentage) {
        LocalDate currentDate = LocalDate.now();

        if (year == null) {
            year = currentDate.getYear();
        }

        // map result
        List<Object[]> categoryDiscountUsageResult = discountRepository.getAllCategoryDiscountReportUsage(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year,  fromPercentage, toPercentage);
        List<CategoryDiscountUsageReport>  categoryDiscountUsageReportList = categoryDiscountUsageResult.stream().map(result -> (CategoryDiscountUsageReport) result[0]).collect(Collectors.toList());
        HashMap<UUID, CategoryDiscountUsageReport> categoryDiscountUsageReportHashMap = new HashMap<>();
        categoryDiscountUsageReportList.stream().forEach(categoryDiscountUsageReport -> {
            categoryDiscountUsageReportHashMap.put(categoryDiscountUsageReport.getProductCategory().getId(), categoryDiscountUsageReport);
        });


        List<ProductCategory> categoryList = productCategoryRepository.findAll();

        for (ProductCategory productCategory : categoryList) {
            if(!categoryDiscountUsageReportHashMap.containsKey(productCategory.getId())) {
                categoryDiscountUsageReportList.add(new CategoryDiscountUsageReport(productCategory.getId(), productCategory.getName(), Long.parseLong("0")));
            }
        }

        categoryDiscountUsageReportList.sort((c1, c2) -> c2.getTotalDiscountUsage().compareTo(c1.getTotalDiscountUsage()));
//
//        // handle category total usage
//        ProductCategory productCategoryWithTotalUsage = productCategoryRepository.getCategoryDiscountUsageByCategoryId(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId);
//
//        // handle sub category total usage
//        List<ProductSubCategory> rawProductSubCategoryList = productSubCategoryRepository.getAllSubCategoryByCategoryId(productCategoryId);
//        List<ProductSubCategory> productSubCategoryReportList = productSubCategoryRepository.getAllSubCategoryDiscountUsageByCategoryId(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId);
//
//        HashMap<UUID, ProductSubCategory> productSubCategoryReportHashmap = new HashMap<>();
//        for (ProductSubCategory productSubCategory : productSubCategoryReportList) {
//            productSubCategoryReportHashmap.put(productSubCategory.getId(), productSubCategory);
//        }
//
//        // add total usage to raw product sub category
//        for (ProductSubCategory productSubCategory : rawProductSubCategoryList) {
//            productSubCategory.setTotalDiscountUsage(0);
//            if (productSubCategoryReportHashmap.containsKey(productSubCategory.getId())) {
//                productSubCategory.setTotalDiscountUsage(productSubCategory.getTotalDiscountUsage() + productSubCategoryReportHashmap.get(productSubCategory.getId()).getTotalDiscountUsage());
//            }
//        }
//
//        CategoryDiscountUsageReport categoryDiscountUsageReport = new CategoryDiscountUsageReport();
//        categoryDiscountUsageReport.setProductCategoryReport(new ProductCategory(productCategory.get().getId(), productCategory.get().getName(), productCategoryWithTotalUsage == null ? 0 : productCategoryWithTotalUsage.getTotalDiscountUsage().longValue()));
//        categoryDiscountUsageReport.getProductSubCategoryReportList().addAll(rawProductSubCategoryList);
//
//        // add total usage from all sub cate
//        for (ProductSubCategory productSubCategory : categoryDiscountUsageReport.getProductSubCategoryReportList()) {
//            categoryDiscountUsageReport.setTotalDiscountUsage(categoryDiscountUsageReport.getTotalDiscountUsage() + productSubCategory.getTotalDiscountUsage());
//        }
//        // add total usage from cate
//        categoryDiscountUsageReport.setTotalDiscountUsage(categoryDiscountUsageReport.getTotalDiscountUsage() + categoryDiscountUsageReport.getProductCategoryReport().getTotalDiscountUsage());
//
//        categoryDiscountUsageReport.getProductSubCategoryReportList().sort((o1, o2) -> o2.getTotalDiscountUsage() - o1.getTotalDiscountUsage());

        return categoryDiscountUsageReportList;
    }

    @Override
    public Discount create(DiscountCreate discountCreate) {
        HashMap<String, String> errorFields = new HashMap<>();
        if (discountCreate.getName().length() > 255) {
            errorFields.put("Lỗi tên khuyến mãi", "Tên có quá 50 kí tự!");
        }

        if (discountCreate.getPercentage() <= 0) {
            errorFields.put("Lỗi tên khuyến mãi", "Tên có quá 50 kí tự!");
        }

        if (discountCreate.getSpentAmountRequired() <= 0) {
            errorFields.put("Lỗi tổng tiền đơn hàng tối thiểu", "Tổng tiền đơn hàng tối thiểu bé hơn hoặc bằng 0!");
        }

        if (discountCreate.getExpiredDate().isBefore(LocalDate.now())) {
            errorFields.put("Lỗi HSD khuyến mãi", "HSD khuyến mãi phải sau ngày hiện tại!");
        }

        if (discountCreate.getImageUrl().isEmpty()) {
            errorFields.put("Lỗi hình ảnh khuyến mãi", "Vui lòng thêm hình cho khuyến mãi!");
        }

        if (discountCreate.getQuantity() <= 0) {
            errorFields.put("Lỗi số lượng khuyến mãi", "Sô lượng khuyến mãi đang bé hơn hoặc bằng 0!");
        }

        UUID productCategoryId = discountCreate.getProductCategoryId();
        ProductCategory category = null;
        if (productCategoryRepository.findById(productCategoryId).isEmpty()) {
            errorFields.put("Lỗi loại sản phẩm áp dụng giảm giá", "Loại sản phẩm không tìm thấy với id: " + productCategoryId);
        } else {
            category = productCategoryRepository.findById(productCategoryId).get();
        }


        if (errorFields.size() > 0) {
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        Discount discount = new Discount();
        ModelMapper mapper = new ModelMapper();
        mapper.map(discountCreate, discount);
        discount.setExpiredDate(discountCreate.getExpiredDate().atTime(LocalTime.MAX));
        discount.setStatus(Status.ENABLE.ordinal());
        discount.setProductCategory(category);
        return discountRepository.save(discount);
    }

    @Override
    public Discount update(DiscountUpdate discountUpdate) {
        HashMap<String, String> errorFields = new HashMap<>();
        Discount discount = new Discount();
        if (discountUpdate.getId() == null) {
            errorFields.put("Lỗi id trống", "Vui lòng nhập id!");
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        } else if (discountRepository.findById(discountUpdate.getId()).isEmpty()) {
            errorFields.put("Lỗi khuyến mãi không tìm thấy! ", "Khuyến mãi không tìm thấy với id: " + discountUpdate.getId());
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        } else {
            discount = discountRepository.findById(discountUpdate.getId()).get();
        }

        if (discountUpdate.getName() != null && discountUpdate.getName().length() > 255) {
            errorFields.put("Lỗi tên khuyến mãi", "Tên có quá 50 kí tự!");
        } else if(discountUpdate.getName() != null) {
            discount.setName(discountUpdate.getName());
        }

        if (discountUpdate.getPercentage() != null && discountUpdate.getPercentage() <= 0) {
            errorFields.put("Lỗi tên khuyến mãi", "Tên có quá 50 kí tự!");
        } else if(discountUpdate.getPercentage() != null) {
            discount.setPercentage(discountUpdate.getPercentage());
        }

        if (discountUpdate.getSpentAmountRequired() != null && discountUpdate.getSpentAmountRequired() <= 0) {
            errorFields.put("Lỗi tổng tiền đơn hàng tối thiểu", "Tổng tiền đơn hàng tối thiểu bé hơn hoặc bằng 0!");
        } else if(discountUpdate.getSpentAmountRequired() != null){
            discount.setSpentAmountRequired(discountUpdate.getSpentAmountRequired());
        }

        if (discountUpdate.getExpiredDate() != null && discountUpdate.getExpiredDate().isBefore(LocalDate.now())) {
            errorFields.put("Lỗi HSD khuyến mãi", "HSD khuyến mãi phải sau ngày hiện tại!");
        } else if(discountUpdate.getExpiredDate() != null){
            discount.setExpiredDate(discountUpdate.getExpiredDate().atTime(LocalTime.MAX));
        }

        if (discountUpdate.getImageUrl() != null && discountUpdate.getImageUrl().isEmpty()) {
            errorFields.put("Lỗi hình ảnh khuyến mãi", "Vui lòng thêm hình cho khuyến mãi!");
        } else if(discountUpdate.getImageUrl() != null){
            discount.setImageUrl(discountUpdate.getImageUrl());
        }

        if (discountUpdate.getQuantity() != null && discountUpdate.getQuantity() <= 0) {
            errorFields.put("Lỗi số lượng khuyến mãi", "Sô lượng khuyến mãi đang bé hơn hoặc bằng 0!");
        } else if(discountUpdate.getQuantity() != null){
            discount.setQuantity(discountUpdate.getQuantity());
        }

        UUID productCategoryId = discountUpdate.getProductCategoryId();
        ProductCategory category = null;
        if (productCategoryId != null && productCategoryRepository.findById(productCategoryId).isEmpty()) {
            errorFields.put("Lỗi loại sản phẩm áp dụng giảm giá", "Loại sản phẩm không tìm thấy với id: " + productCategoryId);
        } else if (productCategoryId != null) {
            category = productCategoryRepository.findById(productCategoryId).get();
            discount.setProductCategory(category);
        }


        if (errorFields.size() > 0) {
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        discount.setStatus(Status.ENABLE.ordinal());

        return discountRepository.save(discount);
    }

    @Override
    public Discount disable(UUID id) throws ResourceNotFoundException {
        Discount discountDisabled = null;
        Optional<Discount> discount = discountRepository.findById(id);
        if (discount.isPresent()) {
            discountDisabled = discount.get();
            discountDisabled.setStatus(Status.DISABLE.ordinal());
            discountDisabled = discountRepository.save(discountDisabled);
        } else {
            throw new ResourceNotFoundException("Khuyến mãi không tìm thấy với id: " + id);
        }
        return discountDisabled;
    }

    @Override
    public Discount enable(UUID id) throws ResourceNotFoundException {
        Discount discountEnable = null;
        Optional<Discount> discount = discountRepository.findById(id);
        if (discount.isPresent()) {
            discountEnable = discount.get();
            discountEnable.setStatus(Status.ENABLE.ordinal());
            discountEnable = discountRepository.save(discountEnable);
        } else {
            throw new ResourceNotFoundException("Khuyến mãi không tìm thấy với id: " + id);
        }
        return discountEnable;
    }


}
