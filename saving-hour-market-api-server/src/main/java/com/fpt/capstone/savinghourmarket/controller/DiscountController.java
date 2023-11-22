package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.*;
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
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/discount")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;
    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/getDiscountsForStaff", method = RequestMethod.GET)
    public ResponseEntity<DiscountForStaffListResponseBody> getDiscountsForStaff(
            @RequestParam(required = false) Boolean isExpiredShown,
            @RequestParam(required = false) EnableDisableStatus status,
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
        DiscountForStaffListResponseBody discountForStaffListResponseBody = discountService.getDiscountsForStaff(
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
                expiredSortType,
                status);
        return ResponseEntity.status(HttpStatus.OK).body(discountForStaffListResponseBody);
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

    @RequestMapping(value = "/getDiscountUsageReport", method = RequestMethod.GET)
    public ResponseEntity<DiscountsUsageReportResponseBody> getPerDiscountUsageReport(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) Month month
            , @RequestParam(required = false) Quarter quarter
            , @RequestParam(required = false) Integer year
            , @RequestParam(defaultValue = "0") Integer fromPercentage
            , @RequestParam(defaultValue = "100") Integer toPercentage
            , @RequestParam(required = false) UUID productCategoryId
            , @RequestParam(required = false) UUID productSubCategoryId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        DiscountsUsageReportResponseBody discountsUsageReportResponseBody = discountService.getPerDiscountUsageReport(month, quarter, year, fromPercentage, toPercentage, productCategoryId, productSubCategoryId);
        return ResponseEntity.status(HttpStatus.OK).body(discountsUsageReportResponseBody);
    }

    @RequestMapping(value = "/getCategoryWithSubCategoryDiscountUsageReport", method = RequestMethod.GET)
    public ResponseEntity<CateWithSubCateDiscountUsageReport> getCategoryWithSubCategoryDiscountUsageReport(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) Month month
            , @RequestParam(required = false) Quarter quarter
            , @RequestParam(required = false) Integer year
            , @RequestParam(defaultValue = "0") Integer fromPercentage
            , @RequestParam(defaultValue = "100") Integer toPercentage
            , @RequestParam UUID productCategoryId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        CateWithSubCateDiscountUsageReport discountsUsageReportResponseBody = discountService.getCategoryWithSubCategoryDiscountUsageReport(month, quarter, year, fromPercentage, toPercentage, productCategoryId);
        return ResponseEntity.status(HttpStatus.OK).body(discountsUsageReportResponseBody);
    }

    @RequestMapping(value = "/createDiscount", method = RequestMethod.POST)
    public ResponseEntity<Discount> createDiscount(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                   @Valid @RequestBody DiscountCreate discountCreate) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(discountService.create(discountCreate));
    }

    @RequestMapping(value = "/updateDiscount", method = RequestMethod.PUT)
    public ResponseEntity<Discount> updateDiscount(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                   @Valid @RequestBody DiscountUpdate discount) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(discountService.update(discount));
    }

    @RequestMapping(value = "/disableDiscount/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Discount> disableDiscount(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                   @PathVariable UUID id) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(discountService.disable(id));
    }

    @RequestMapping(value = "/enableDiscount/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Discount> enableDiscount(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
                                                    @PathVariable UUID id) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(discountService.enable(id));
    }

}
