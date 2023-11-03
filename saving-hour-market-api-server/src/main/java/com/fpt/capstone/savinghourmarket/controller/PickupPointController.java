package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.model.PickupPointsSortWithSuggestionsResponseBody;
import com.fpt.capstone.savinghourmarket.model.ProductConsolidationAreaCreateBody;
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

    @RequestMapping(value = "/getAllForAdmin", method = RequestMethod.GET)
    public ResponseEntity<List<PickupPoint>> getAllForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(required = false)EnableDisableStatus enableDisableStatus) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        List<PickupPoint> pickupPoints = pickupPointService.getAllForAdmin(enableDisableStatus);
        return ResponseEntity.status(HttpStatus.OK).body(pickupPoints);
    }

    @RequestMapping(value = "/getWithSortAndSuggestion", method = RequestMethod.GET)
    public ResponseEntity<PickupPointsSortWithSuggestionsResponseBody> getWithSortAndSuggestion(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) throws IOException, InterruptedException, ApiException {
        PickupPointsSortWithSuggestionsResponseBody result = pickupPointService.getWithSortAndSuggestion(latitude, longitude);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

//    @RequestMapping(value = "/create", method = RequestMethod.POST)

//    @RequestMapping(value = "/update", method = RequestMethod.PUT)

//    @RequestMapping(value = "/updateStatus", method = RequestMethod.PUT)


}
