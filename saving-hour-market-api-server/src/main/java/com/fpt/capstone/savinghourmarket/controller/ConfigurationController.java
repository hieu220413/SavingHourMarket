package com.fpt.capstone.savinghourmarket.controller;


import com.fpt.capstone.savinghourmarket.entity.Configuration;
import com.fpt.capstone.savinghourmarket.service.ConfigurationService;
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

import java.io.IOException;


@RestController
@RequestMapping("/api/configuration")
@RequiredArgsConstructor
public class ConfigurationController {

    private final FirebaseAuth firebaseAuth;

    private final ConfigurationService configurationService;

    @RequestMapping(value = "/getConfiguration", method = RequestMethod.GET)
    public ResponseEntity<Configuration> getConfiguration(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = configurationService.getConfiguration();
        return ResponseEntity.status(HttpStatus.OK).body(configuration);
    }

    @RequestMapping(value = "/updateConfiguration", method = RequestMethod.PUT)
    public ResponseEntity<Configuration> updateConfiguration(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @Valid @RequestBody Configuration configurationUpdateBody) throws FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Configuration configuration = configurationService.updateConfiguration(configurationUpdateBody);
        return ResponseEntity.status(HttpStatus.OK).body(configuration);
    }
}
