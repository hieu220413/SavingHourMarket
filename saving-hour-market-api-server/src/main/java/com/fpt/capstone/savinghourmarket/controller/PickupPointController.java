package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.PickupPointService;
import com.fpt.capstone.savinghourmarket.service.ProductConsolidationAreaService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.api.Http;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.maps.errors.ApiException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pickupPoint")
@RequiredArgsConstructor
public class PickupPointController {

    private final FirebaseAuth firebaseAuth;
    private final PickupPointService pickupPointService;


    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    public ResponseEntity<List<PickupPoint>> getAll() {
        List<PickupPoint> pickupPoints = pickupPointService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(pickupPoints);
    }

    @RequestMapping(value = "/getAllForStaff", method = RequestMethod.GET)
    public ResponseEntity<List<PickupPointWithProductConsolidationArea>> getAllForStaff(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false)EnableDisableStatus enableDisableStatus) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<PickupPointWithProductConsolidationArea> pickupPointWithProductConsolidationAreaList = pickupPointService.getAllForStaff(enableDisableStatus);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPointWithProductConsolidationAreaList);
    }

    @RequestMapping(value = "/getAllForAdmin", method = RequestMethod.GET)
    public ResponseEntity<PickupPointListResponseBody> getAllForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false)EnableDisableStatus enableDisableStatus
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        PickupPointListResponseBody pickupPointListResponseBody = pickupPointService.getAllForAdmin(enableDisableStatus, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPointListResponseBody);
    }

    @RequestMapping(value = "/getWithSortAndSuggestion", method = RequestMethod.GET)
    public ResponseEntity<PickupPointsSortWithSuggestionsResponseBody> getWithSortAndSuggestion(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) throws IOException, InterruptedException, ApiException {
        PickupPointsSortWithSuggestionsResponseBody result = pickupPointService.getWithSortAndSuggestion(latitude, longitude);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<PickupPointWithProductConsolidationArea> create(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestBody @Valid PickupPointCreateBody pickupPointCreateBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        PickupPointWithProductConsolidationArea pickupPointWithProductConsolidationArea = pickupPointService.create(pickupPointCreateBody);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPointWithProductConsolidationArea);
    }


    @RequestMapping(value = "/updateInfo", method = RequestMethod.PUT)
    public ResponseEntity<PickupPoint> create(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestBody @Valid PickupPointUpdateBody pickupPointUpdateBody,
            @RequestParam UUID pickupPointId) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        PickupPoint pickupPoint = pickupPointService.updateInfo(pickupPointUpdateBody, pickupPointId);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPoint);
    }

    @RequestMapping(value = "/updateStatus", method = RequestMethod.PUT)
    public ResponseEntity<PickupPoint> updateStatus(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestBody @Valid EnableDisableStatusChangeBody enableDisableStatusChangeBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        PickupPoint pickupPoint = pickupPointService.updateStatus(enableDisableStatusChangeBody);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPoint);
    }

    @RequestMapping(value = "/updateProductConsolidationAreaList", method = RequestMethod.PUT)
    public ResponseEntity<PickupPointWithProductConsolidationArea> updatePickupPointList(
            @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken,
            @RequestBody @Valid ProductConsolidationAreaPickupPointUpdateListBody productConsolidationAreaPickupPointUpdateListBody
    ) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        PickupPointWithProductConsolidationArea pickupPointWithProductConsolidationArea = pickupPointService.updateProductConsolidationAreaList(productConsolidationAreaPickupPointUpdateListBody);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPointWithProductConsolidationArea);
    }


}
