package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.model.SupermarketAddressCreateBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketListResponseBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.service.SupermarketService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/supermarket")
@RequiredArgsConstructor
@Validated
public class SupermarketController {

    private final SupermarketService supermarketService;

    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<Supermarket> create(@RequestBody @Valid SupermarketCreateRequestBody supermarketCreateRequestBody, @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Supermarket supermarket = supermarketService.create(supermarketCreateRequestBody);
        return ResponseEntity.status(HttpStatus.OK).body(supermarket);
    }

    @RequestMapping(value = "/updateInfo", method = RequestMethod.PUT)
    public ResponseEntity<Supermarket> updateInfo(@RequestBody SupermarketUpdateRequestBody supermarketUpdateRequestBody, @RequestParam UUID supermarketId, @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Supermarket supermarket = supermarketService.update(supermarketUpdateRequestBody, supermarketId);
        return ResponseEntity.status(HttpStatus.OK).body(supermarket);
    }

    @RequestMapping(value = "createSupermarketAddressForSupermarket", method = RequestMethod.POST)
    public ResponseEntity<Supermarket> createSupermarketAddressForSupermarket(@RequestBody @Size(min = 1) List<@Valid SupermarketAddressCreateBody> supermarketAddressCreateBodyList, @RequestParam UUID supermarketId, @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Supermarket supermarket = supermarketService.createSupermarketAddress(supermarketAddressCreateBodyList, supermarketId);
        return ResponseEntity.status(HttpStatus.OK).body(supermarket);
    }

    @RequestMapping(value = "/changeStatus", method = RequestMethod.PUT)
    public ResponseEntity<Supermarket> changeStatus(@RequestParam EnableDisableStatus status, @RequestParam UUID supermarketId, @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Supermarket supermarket = supermarketService.changeStatus(supermarketId, status);
        return ResponseEntity.status(HttpStatus.OK).body(supermarket);
    }

    @RequestMapping(value = "/getSupermarketForStaff", method = RequestMethod.GET)
    public ResponseEntity<SupermarketListResponseBody> getSupermarketForStaff(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(required = false) EnableDisableStatus status
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        SupermarketListResponseBody supermarketList = supermarketService.getSupermarketForStaff(name, status, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(supermarketList);
    }
}
