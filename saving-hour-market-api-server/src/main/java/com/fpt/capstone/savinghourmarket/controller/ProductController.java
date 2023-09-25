package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/product")
public class ProductController {
    private final ProductService productService;
    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/getProductsForStaff", method = RequestMethod.GET)
    public ResponseEntity<List<Product>> getProductsForStaff(@RequestParam(required = false) Boolean isExpiredShown
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) String supermarketId
            , @RequestParam(required = false) String productCategoryId
            , @RequestParam(required = false) String productSubCategoryId
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit
            , @RequestParam(defaultValue = "DESC") String quantitySortType
            , @RequestParam(defaultValue = "DESC") String expiredSortType
            , @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
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
