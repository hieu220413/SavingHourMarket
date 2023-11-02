package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.exception.InvalidExcelFileDataException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/product")
@Slf4j
public class ProductController {
    private final ProductService productService;
    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/getProductsForStaff", method = RequestMethod.GET)
    public ResponseEntity<ProductListResponseBody> getProductsForStaff(@RequestParam(required = false) Boolean isExpiredShown
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(required = false) EnableDisableStatus status
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
                , status
                , page
                , limit
                , quantitySortType
                , expiredSortType
                , priceSort);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }

    @RequestMapping(value = "/getProductsForCustomer", method = RequestMethod.GET)
    public ResponseEntity<ProductListCustomerResponseBody> getProductsForCustomer(@RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam UUID pickupPointId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
//            , @Parameter(hidden = true) @RequestParam(required = false) SortType quantitySortType
            , @RequestParam(required = false) SortType expiredSortType
            , @RequestParam(required = false) SortType priceSort) {
        ProductListCustomerResponseBody productList = productService.getProductsForCustomer(name
                , supermarketId
                , productCategoryId
                , productSubCategoryId
                , page
                , limit
                , null
                , expiredSortType
                , priceSort
                , pickupPointId);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }


    @RequestMapping(value = "/getSaleReportSupermarket", method = RequestMethod.GET)
    public ResponseEntity<List<SaleReportSupermarketMonthlyResponseBody>> getSaleReportSupermarket(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam UUID supermarketId
//            , @RequestParam(required = false) Month month
//            , @RequestParam(required = false) Quarter quarter
            , @RequestParam(required = false) Integer year) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<SaleReportSupermarketMonthlyResponseBody> saleReportSupermarketMonthlyResponseBodyList = productService.getSaleReportSupermarket(supermarketId, year);
        return ResponseEntity.status(HttpStatus.OK).body(saleReportSupermarketMonthlyResponseBodyList);
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

    @RequestMapping(value = "/getCategoryForStaff", method = RequestMethod.GET)
    public ResponseEntity<CategoryListResponseBody> getCategoryForStaff(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(defaultValue = "") String name
            // just in case need status
            , @Parameter(hidden = true) @RequestParam(required = false) EnableDisableStatus status
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        CategoryListResponseBody categoryListResponseBody = productService.getCategoryForStaff(name, status, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(categoryListResponseBody);
    }

    @RequestMapping(value = "/getSubCategoryForStaff", method = RequestMethod.GET)
    public ResponseEntity<SubCategoryListResponseBody> getSubCategoryForStaff(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(defaultValue = "") String name
            // just in case need status
            , @Parameter(hidden = true) @RequestParam(required = false) EnableDisableStatus status
            , @RequestParam(required = false) UUID productCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        SubCategoryListResponseBody subCategoryListResponseBody = productService.getSubCategoryForStaff(name, status, productCategoryId, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(subCategoryListResponseBody);
    }

    @RequestMapping(value = "/createCategory", method = RequestMethod.POST)
    public ResponseEntity<ProductCategory> createCategory(@RequestBody @Valid ProductCategoryCreateBody productCategoryCreateBody,
                                                          @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductCategory productCategory = productService.createCategory(productCategoryCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(productCategory);
    }

    @RequestMapping(value = "/createSubCategory", method = RequestMethod.POST)
    public ResponseEntity<ProductSubCategory> createSubCategory(@RequestBody @Valid ProductSubCategoryCreateBody productSubCategoryCreateBody,
                                                                @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductSubCategory productSubCategory = productService.createSubCategory(productSubCategoryCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(productSubCategory);
    }

    @RequestMapping(value = "/updateCategory", method = RequestMethod.PUT)
    public ResponseEntity<ProductCategory> updateCategory(@RequestBody @Valid ProductCategoryUpdateBody productCategoryUpdateBody,
                                                          @RequestParam UUID categoryId,
                                                          @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductCategory productCategory = productService.updateProductCategory(productCategoryUpdateBody, categoryId);
        return ResponseEntity.status(HttpStatus.OK).body(productCategory);
    }

    @RequestMapping(value = "/updateSubCategory", method = RequestMethod.PUT)
    public ResponseEntity<ProductSubCategory> updateSubCategory(@RequestBody @Valid ProductSubCategoryUpdateBody productSubCategoryUpdateBody,
                                                                @RequestParam UUID subCategoryId,
                                                                @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductSubCategory productSubCategory = productService.updateProductSubCategory(productSubCategoryUpdateBody, subCategoryId);
        return ResponseEntity.status(HttpStatus.OK).body(productSubCategory);
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public ResponseEntity<Product> updateProduct(@Valid @RequestBody Product product,
                                                 @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(productService.updateProduct(product));
    }

    @RequestMapping(value = "/disable", method = RequestMethod.PUT)
    public ResponseEntity<Product> deleteProduct(@Valid @RequestBody UUID productId,
                                                 @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, ResourceNotFoundException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(productService.disableProduct(productId));
    }
    
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @Operation(description = "Upload new product, if id of each entities (ex: subCategory, Category, Supermarket) in product is not null, it's mean to upload with existed entities.If not, it's mean to upload with new entities.")
    public ResponseEntity<Product> uploadProduct(@Valid @RequestBody ProductCreate productCreate,
                                                 @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(productService.createProduct(productCreate));
    }

    @RequestMapping(value = "/uploadExcelFile",
            method = RequestMethod.POST,
            consumes = {"multipart/form-data"})
    @Operation(description = "Upload product excel file")
    public ResponseEntity<List<Product>> uploadProduct(@RequestParam("file")  MultipartFile file,
                                                       @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws IOException, InvalidExcelFileDataException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(productService.createProductByExcel(file));
    }

    @RequestMapping(value = "/create/list", method = RequestMethod.POST)
    @Operation(description = "Save list of products to database")
    public ResponseEntity<List<Product>> uploadProductList(@Valid @RequestBody List<Product> productList,
                                                           @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws ResourceNotFoundException, FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(productService.createProductList(productList));
    }
    
    @RequestMapping(value = "/getRevenueReportForEachMonth", method = RequestMethod.GET)
    public ResponseEntity<List<RevenueReportMonthly>> getRevenueReportForEachMonth(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
//            , @RequestParam(required = false) Month month
//            , @RequestParam(required = false) Quarter quarter
            , @RequestParam(required = false) Integer year) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
//        RevenueReportResponseBody revenueReportResponseBody = productService.getRevenueReport(month, quarter, year);
        List<RevenueReportMonthly> revenueReportMonthlyList = productService.getRevenueReportForEachMonth(year);
        return ResponseEntity.status(HttpStatus.OK).body(revenueReportMonthlyList);
    }

    @RequestMapping(value = "/getRevenueReportForEachYear", method = RequestMethod.GET)
    public ResponseEntity<List<RevenueReportYearly>> getRevenueReportForEachYear(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<RevenueReportYearly> revenueReportYearlyList = productService.getRevenueReportForEachYear();
        return ResponseEntity.status(HttpStatus.OK).body(revenueReportYearlyList);
    }

    @RequestMapping(value = "/getAllSupermarketSaleReport", method = RequestMethod.GET)
    public ResponseEntity<List<SupermarketSaleReportResponseBody>> getAllSupermarketSaleReport(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) Integer year) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<SupermarketSaleReportResponseBody> supermarketSaleReportResponseBodyList = productService.getAllSupermarketSaleReport(year);
        return ResponseEntity.status(HttpStatus.OK).body(supermarketSaleReportResponseBodyList);
    }

    @RequestMapping(value = "/getOrderTotalAllCategorySupermarketReport", method = RequestMethod.GET)
    public ResponseEntity<List<CateOderQuantityResponseBody>> getOrderTotalAllCategorySupermarketReport(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam UUID supermarketId
            , @RequestParam(required = false) Integer year) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<CateOderQuantityResponseBody> cateOderQuantityResponseBodyList = productService.getOrderTotalAllCategorySupermarket(supermarketId, year);
        return ResponseEntity.status(HttpStatus.OK).body(cateOderQuantityResponseBodyList);
    }

}
