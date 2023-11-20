package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.common.Status;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
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

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {
    private final DiscountRepository discountRepository;
    private final ProductCategoryRepository productCategoryRepository;

    private final ProductSubCategoryRepository productSubCategoryRepository;

    @Override
    @Transactional(readOnly = true)
    public DiscountOnlyListResponseBody getDiscountsForStaff(Boolean isExpiredShown, String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType) {
        Sort sortable;
        if (expiredSortType.equals("DESC")) {
            sortable = Sort.by("expiredDate").descending();
        } else {
            sortable = Sort.by("expiredDate").ascending();
        }

        Pageable pageable = PageRequest.of(page, limit, sortable);

        Page<DiscountOnly> result = discountRepository.getDiscountsForStaff(
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

        int totalPage = result.getTotalPages();
        long totalDiscount = result.getTotalElements();
        List<DiscountOnly> discountList = result.stream().toList();

        return new DiscountOnlyListResponseBody(discountList, totalPage, totalDiscount);
    }

    @Override
    public List<DiscountOnly> getDiscountsForCustomer(String name, Integer fromPercentage, Integer toPercentage, LocalDateTime fromDatetime, LocalDateTime toDatetime, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, String expiredSortType) {
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
                productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId),
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
    public DiscountsUsageReportResponseBody getPerDiscountUsageReport(Month month, Quarter quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId, UUID productSubCategoryId) {
        LocalDate currentDate = LocalDate.now();
        // get all discount
        List<DiscountOnly> rawDiscountList = discountRepository.getRawDiscountListForReport(fromPercentage, toPercentage, productCategoryId == null ? null : productCategoryId, productSubCategoryId == null ? null : productSubCategoryId);
        HashMap<UUID, DiscountOnly> discountUsageReportHashMap = new HashMap<>();
        if (year == null) {
            year = currentDate.getYear();
        }

        List<DiscountOnly> discountEntityList = discountRepository.getDiscountReport(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId == null ? null : productCategoryId, productSubCategoryId == null ? null : productSubCategoryId);

        DiscountsUsageReportResponseBody discountsUsageReportResponseBody = new DiscountsUsageReportResponseBody();
        for (DiscountOnly discount : discountEntityList) {
            discountUsageReportHashMap.put(discount.getId(), discount);
        }

        for (DiscountOnly rawDiscount : rawDiscountList) {
            // map usage report
            if (discountUsageReportHashMap.containsKey(rawDiscount.getId())) {
                discountsUsageReportResponseBody.getDiscountReportList().add(new DiscountReport(rawDiscount, discountUsageReportHashMap.get(rawDiscount.getId()).getQuantity()));
                discountsUsageReportResponseBody.setTotalDiscountUsage(discountsUsageReportResponseBody.getTotalDiscountUsage() + discountUsageReportHashMap.get(rawDiscount.getId()).getQuantity());
            } else {
                discountsUsageReportResponseBody.getDiscountReportList().add(new DiscountReport(rawDiscount, 0));
            }
        }

        discountsUsageReportResponseBody.getDiscountReportList().sort((o1, o2) -> o2.getTotalUsage() - o1.getTotalUsage());

        return discountsUsageReportResponseBody;
    }

    @Override
    public CateWithSubCateDiscountUsageReport getCategoryWithSubCategoryDiscountUsageReport(Month month, Quarter quarter, Integer year, Integer fromPercentage, Integer toPercentage, UUID productCategoryId) {
        LocalDate currentDate = LocalDate.now();

        if (year == null) {
            year = currentDate.getYear();
        }

        Optional<ProductCategory> productCategory = productCategoryRepository.findById(productCategoryId);
        if (!productCategory.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_CATEGORY_NOT_FOUND.toString());
        }

        // handle category total usage
        ProductCategory productCategoryWithTotalUsage = productCategoryRepository.getCategoryDiscountUsageByCategoryId(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId);

        // handle sub category total usage
        List<ProductSubCategory> rawProductSubCategoryList = productSubCategoryRepository.getAllSubCategoryByCategoryId(productCategoryId);
        List<ProductSubCategory> productSubCategoryReportList = productSubCategoryRepository.getAllSubCategoryDiscountUsageByCategoryId(month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year, fromPercentage, toPercentage, productCategoryId);

        HashMap<UUID, ProductSubCategory> productSubCategoryReportHashmap = new HashMap<>();
        for (ProductSubCategory productSubCategory : productSubCategoryReportList) {
            productSubCategoryReportHashmap.put(productSubCategory.getId(), productSubCategory);
        }

        // add total usage to raw product sub category
        for (ProductSubCategory productSubCategory : rawProductSubCategoryList) {
            productSubCategory.setTotalDiscountUsage(0);
            if (productSubCategoryReportHashmap.containsKey(productSubCategory.getId())) {
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
            discountEnable.setStatus(Status.DISABLE.ordinal());
            discountEnable = discountRepository.save(discountEnable);
        } else {
            throw new ResourceNotFoundException("Khuyến mãi không tìm thấy với id: " + id);
        }
        return discountEnable;
    }


}
