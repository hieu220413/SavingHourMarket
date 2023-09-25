package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.model.DiscountOnly;
import com.fpt.capstone.savinghourmarket.service.DiscountService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/api/discount")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;
    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/getDiscountsForStaff", method = RequestMethod.GET)
    public ResponseEntity<List<DiscountOnly>> getDiscountsForStaff(
            @RequestParam(required = false) Boolean isExpiredShown,
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") Integer fromPercentage,
            @RequestParam(defaultValue = "100") Integer toPercentage,
            @RequestParam(defaultValue = "2000-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDatetime,
            @RequestParam(defaultValue = "2100-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDatetime,
            @RequestParam(required = false) String productCategoryId,
            @RequestParam(required = false) String productSubCategoryId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(defaultValue = "DESC") String expiredSortType,
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<DiscountOnly> discountList = discountService.getDiscountsForStaff(
                isExpiredShown,
                name,
                fromPercentage,
                toPercentage,
                fromDatetime,
                toDatetime,
                productCategoryId,
                productSubCategoryId,
                page,
                limit,
                expiredSortType);
        return ResponseEntity.status(HttpStatus.OK).body(discountList);
    }

    @RequestMapping(value = "/getDiscountsForCustomer", method = RequestMethod.GET)
    public ResponseEntity<List<DiscountOnly>> getDiscountsForCustomer(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") Integer fromPercentage,
            @RequestParam(defaultValue = "100") Integer toPercentage,
            @RequestParam(defaultValue = "2000-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDatetime,
            @RequestParam(defaultValue = "2100-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDatetime,
            @RequestParam(required = false) String productCategoryId,
            @RequestParam(required = false) String productSubCategoryId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(defaultValue = "DESC") String expiredSortType) {
        List<DiscountOnly> discountList = discountService.getDiscountsForCustomer(
                name,
                fromPercentage,
                toPercentage,
                fromDatetime,
                toDatetime,
                productCategoryId,
                productSubCategoryId,
                page,
                limit,
                expiredSortType);
        return ResponseEntity.status(HttpStatus.OK).body(discountList);
    }

    @RequestMapping(value = "/getDiscountById", method = RequestMethod.GET)
    public ResponseEntity<Discount> getDiscountWithCategories(@RequestParam("id") String discountId) {
        Discount discount = discountService.getDiscountById(discountId);
        return ResponseEntity.status(HttpStatus.OK).body(discount);
    }
}
