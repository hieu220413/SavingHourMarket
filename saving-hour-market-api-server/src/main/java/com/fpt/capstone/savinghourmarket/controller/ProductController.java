package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/product")
public class ProductController {
    public final ProductService productService;

    @RequestMapping(value = "/getProductsForStaff", method = RequestMethod.GET)
    public ResponseEntity<List<Product>> getProductsForStaff(@RequestParam(required = false) Boolean isExpiredShown
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
            , @RequestParam(defaultValue = "DESC") String quantitySortType
            , @RequestParam(defaultValue = "DESC") String expiredSortType) {
        List<Product> productList = productService.getProductsForStaff(isExpiredShown
                , name
                , supermarketId
                , productCategoryId
                , productSubCategoryId
                , page
                , limit
                , quantitySortType
                , expiredSortType);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }

    @RequestMapping(value = "/getProductsForCustomer", method = RequestMethod.GET)
    public ResponseEntity<List<Product>> getProductsForCustomer(@RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
            , @RequestParam(defaultValue = "DESC") String quantitySortType
            , @RequestParam(defaultValue = "DESC") String expiredSortType) {
        List<Product> productList = productService.getProductsForCustomer(name
                , supermarketId
                , productCategoryId
                , productSubCategoryId
                , page
                , limit
                , quantitySortType
                , expiredSortType);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }
}
