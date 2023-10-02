package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.model.SupermarketCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.SupermarketUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.service.SupermarketService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/supermarket")
@RequiredArgsConstructor
public class SupermarketController {

    private final SupermarketService supermarketService;

    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<Supermarket> create(@RequestBody SupermarketCreateRequestBody supermarketCreateRequestBody, @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
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

    @RequestMapping(value = "/changeStatus", method = RequestMethod.PUT)
    public ResponseEntity<Supermarket> changeStatus(@RequestParam EnableDisableStatus status, @RequestParam UUID supermarketId, @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Supermarket supermarket = supermarketService.changeStatus(supermarketId, status);
        return ResponseEntity.status(HttpStatus.OK).body(supermarket);
    }
}
