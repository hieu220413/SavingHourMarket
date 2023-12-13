package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.SystemStatus;
import com.fpt.capstone.savinghourmarket.entity.Configuration;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import com.fpt.capstone.savinghourmarket.exception.SystemNotInMaintainStateException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.ProductConsolidationAreaService;
import com.fpt.capstone.savinghourmarket.service.SystemConfigurationService;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/productConsolidationArea")
@RequiredArgsConstructor
public class ProductConsolidationAreaController {
    private final FirebaseAuth firebaseAuth;
    private final ProductConsolidationAreaService productConsolidationAreaService;
    private final SystemConfigurationService systemConfigurationService;

    @RequestMapping(value = "/getAllForStaff", method = RequestMethod.GET)
    public ResponseEntity<List<ProductConsolidationArea>> getAllProductConsolidationAreaForStaff(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) EnableDisableStatus enableDisableStatus) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<ProductConsolidationArea> productConsolidationAreaList = productConsolidationAreaService.getAllProductConsolidationAreaForStaff(enableDisableStatus);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationAreaList);
    }

    @RequestMapping(value = "/getAllForAdmin", method = RequestMethod.GET)
    public ResponseEntity<ProductConsolidationAreaListResponse> getAllProductConsolidationAreaForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false) EnableDisableStatus enableDisableStatus
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        ProductConsolidationAreaListResponse productConsolidationAreaListResponse = productConsolidationAreaService.getAllProductConsolidationAreaForAdmin(enableDisableStatus, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationAreaListResponse);
    }

    @RequestMapping(value = "/getByPickupPointForStaff", method = RequestMethod.GET)
    public ResponseEntity<List<ProductConsolidationArea>> getByPickupPointForStaff(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam UUID pickupPointId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<ProductConsolidationArea> productConsolidationAreaList = productConsolidationAreaService.getByPickupPointForStaff(pickupPointId);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationAreaList);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<ProductConsolidationArea> createProductConsolidationArea(
            @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
            @Valid @RequestBody ProductConsolidationAreaCreateBody productConsolidationAreaCreateBody
    ) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
//        Configuration configuration = systemConfigurationService.getConfiguration();
//        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
//            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
//        }
        ProductConsolidationArea productConsolidationArea = productConsolidationAreaService.create(productConsolidationAreaCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationArea);
    }

    @RequestMapping(value = "/updateInfo", method = RequestMethod.PUT)
    public ResponseEntity<ProductConsolidationArea> updateInfo(
            @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
            @RequestBody @Valid ProductConsolidationAreaUpdateBody productConsolidationAreaUpdateBody,
            @RequestParam UUID productConsolidationAreaId
            ) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = systemConfigurationService.getConfiguration();
        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
        }
        ProductConsolidationArea productConsolidationArea = productConsolidationAreaService.updateInfo(productConsolidationAreaUpdateBody, productConsolidationAreaId);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationArea);
    }

    @RequestMapping(value = "/updateStatus", method = RequestMethod.PUT)
    public ResponseEntity<ProductConsolidationArea> updateStatus(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestBody @Valid EnableDisableStatusChangeBody enableDisableStatusChangeBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = systemConfigurationService.getConfiguration();
        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
        }
        ProductConsolidationArea productConsolidationArea = productConsolidationAreaService.updateStatus(enableDisableStatusChangeBody);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationArea);
    }

    @RequestMapping(value = "/updatePickupPointList", method = RequestMethod.PUT)
    public ResponseEntity<ProductConsolidationArea> updatePickupPointList(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestBody @Valid ProductConsolidationAreaPickupPointUpdateListBody productConsolidationAreaPickupPointUpdateListBody
    ) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = systemConfigurationService.getConfiguration();
        if(configuration.getSystemStatus() != SystemStatus.MAINTAINING.ordinal()){
            throw new SystemNotInMaintainStateException(HttpStatus.valueOf(AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.getCode()), AdditionalResponseCode.SYSTEM_IS_NOT_IN_MAINTAINING_STATE.toString());
        }
        ProductConsolidationArea productConsolidationArea = productConsolidationAreaService.updatePickupPointList(productConsolidationAreaPickupPointUpdateListBody);
        return ResponseEntity.status(HttpStatus.OK).body(productConsolidationArea);
    }

}
