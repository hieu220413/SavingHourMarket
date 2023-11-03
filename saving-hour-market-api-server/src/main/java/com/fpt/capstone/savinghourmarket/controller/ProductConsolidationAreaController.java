package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaCreateBody;
import com.fpt.capstone.savinghourmarket.service.ProductConsolidationAreaService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productConsolidationArea")
@RequiredArgsConstructor
public class ProductConsolidationAreaController {
    private final FirebaseAuth firebaseAuth;
    private final ProductConsolidationAreaService productConsolidationAreaService;

    @RequestMapping(value = "/getAllForAdmin", method = RequestMethod.GET)
    public ResponseEntity<List<ProductConsolidationArea>> getAllProductConsolidationAreaForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) EnableDisableStatus enableDisableStatus) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<ProductConsolidationArea> productConsolidationAreaList = productConsolidationAreaService.getAllProductConsolidationAreaForAdmin(enableDisableStatus);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationAreaList);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<ProductConsolidationArea> createProductConsolidationArea(
            @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
            @Valid @RequestBody ProductConsolidationAreaCreateBody productConsolidationAreaCreateBody
    ) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductConsolidationArea productConsolidationArea = productConsolidationAreaService.create(productConsolidationAreaCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationArea);
    }

//    @RequestMapping(value = "/update", method = RequestMethod.PUT)

//    @RequestMapping(value = "/updateStatus", method = RequestMethod.PUT)
}
