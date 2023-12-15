package com.fpt.capstone.savinghourmarket.controller;


import com.fpt.capstone.savinghourmarket.common.SystemStatus;
import com.fpt.capstone.savinghourmarket.entity.Configuration;
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

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/api/configuration")
@RequiredArgsConstructor
public class ConfigurationController {

    private final FirebaseAuth firebaseAuth;

    private final SystemConfigurationService configurationService;

    @RequestMapping(value = "/getConfiguration", method = RequestMethod.GET)
    public ResponseEntity<Configuration> getConfiguration() {
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

    @RequestMapping(value = "/updateSystemState", method = RequestMethod.PUT)
    public ResponseEntity<Map<String, Integer>> updateSystemState(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam SystemStatus systemState) throws FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Map<String, Integer> systemStatusBody = configurationService.updateSystemState(systemState);
        return ResponseEntity.status(HttpStatus.OK).body(systemStatusBody);
    }
}
