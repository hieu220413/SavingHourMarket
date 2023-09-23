package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;
import com.fpt.capstone.savinghourmarket.repository.DiscountRepository;
import com.fpt.capstone.savinghourmarket.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {
    private final DiscountRepository discountRepository;
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
}
