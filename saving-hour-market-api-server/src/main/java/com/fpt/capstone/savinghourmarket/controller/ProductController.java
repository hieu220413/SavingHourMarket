package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.Month;
import com.fpt.capstone.savinghourmarket.common.Quarter;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.ProductCategoryService;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/product")
public class ProductController {
    private final ProductService productService;
    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/getProductsForStaff", method = RequestMethod.GET)
    public ResponseEntity<ProductListResponseBody> getProductsForStaff(@RequestParam(required = false) Boolean isExpiredShown
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
            , @RequestParam(required = false) SortType quantitySortType
            , @RequestParam(required = false) SortType expiredSortType
            , @RequestParam(required = false) SortType priceSort
            , @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductListResponseBody productList = productService.getProductsForStaff(isExpiredShown
                , name
                , supermarketId
                , productCategoryId
                , productSubCategoryId
                , page
                , limit
                , quantitySortType
                , expiredSortType
                , priceSort);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }

    @RequestMapping(value = "/getProductsForCustomer", method = RequestMethod.GET)
    public ResponseEntity<ProductListResponseBody> getProductsForCustomer(@RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
            , @RequestParam(required = false) SortType quantitySortType
            , @RequestParam(required = false) SortType expiredSortType
            , @RequestParam(required = false) SortType priceSort) {
        ProductListResponseBody productList = productService.getProductsForCustomer(name
                , supermarketId
                , productCategoryId
                , productSubCategoryId
                , page
                , limit
                , quantitySortType
                , expiredSortType
                , priceSort);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }


    @RequestMapping(value = "/getSaleReportSupermarket", method = RequestMethod.GET)
    public ResponseEntity<SaleReportResponseBody> getSaleReportSupermarket(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam UUID supermarketId
            , @RequestParam(required = false) Month month
            , @RequestParam(required = false) Quarter quarter
            , @RequestParam(required = false) Integer year) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        SaleReportResponseBody saleReportResponseBody = productService.getSaleReportSupermarket(supermarketId, month, quarter, year);
        return ResponseEntity.status(HttpStatus.OK).body(saleReportResponseBody);
    }

    @RequestMapping(value = "/getById", method = RequestMethod.GET)
    public ResponseEntity<Product> getById(@RequestParam UUID id){
        Product product = productService.getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @RequestMapping(value = "/getAllCategory", method = RequestMethod.GET)
    public ResponseEntity<List<ProductCateWithSubCate>> getAllCategory() {
        List<ProductCateWithSubCate> productCategoryList = productService.getAllCategory();
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryList);
    }

    @RequestMapping(value = "/getAllSubCategory", method = RequestMethod.GET)
    public ResponseEntity<List<ProductSubCateOnly>> getAllSubCategory() {
        List<ProductSubCateOnly> productSubCateOnlyList = productService.getAllSubCategory();
        return ResponseEntity.status(HttpStatus.OK).body(productSubCateOnlyList);
    }

    @RequestMapping(value = "/createCategory", method = RequestMethod.POST)
    public ResponseEntity<ProductCategory> createCategory(@RequestBody @Valid ProductCategoryCreateBody productCategoryCreateBody, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductCategory productCategory = productService.createCategory(productCategoryCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(productCategory);
    }

    @RequestMapping(value = "/createSubCategory", method = RequestMethod.POST)
    public ResponseEntity<ProductSubCategory> createSubCategory(@RequestBody @Valid ProductSubCategoryCreateBody productSubCategoryCreateBody, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductSubCategory productSubCategory = productService.createSubCategory(productSubCategoryCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(productSubCategory);
    }

    @RequestMapping(value = "/updateCategory", method = RequestMethod.PUT)
    public ResponseEntity<ProductCategory> updateCategory(@RequestBody @Valid ProductCategoryUpdateBody productCategoryUpdateBody, @RequestParam UUID categoryId, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductCategory productCategory = productService.updateProductCategory(productCategoryUpdateBody, categoryId);
        return ResponseEntity.status(HttpStatus.OK).body(productCategory);
    }

    @RequestMapping(value = "/updateSubCategory", method = RequestMethod.PUT)
    public ResponseEntity<ProductSubCategory> updateSubCategory(@RequestBody @Valid ProductSubCategoryUpdateBody productSubCategoryUpdateBody, @RequestParam UUID subCategoryId, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductSubCategory productSubCategory = productService.updateProductSubCategory(productSubCategoryUpdateBody, subCategoryId);
        return ResponseEntity.status(HttpStatus.OK).body(productSubCategory);
    }
}
