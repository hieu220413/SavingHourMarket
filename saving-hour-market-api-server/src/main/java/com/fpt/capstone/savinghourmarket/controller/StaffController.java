package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.StaffRole;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.model.PasswordRequestBody;
import com.fpt.capstone.savinghourmarket.model.StaffCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.StaffUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.service.StaffService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    private final FirebaseAuth firebaseAuth;

//    @RequestMapping(value = "/getInfoAfterGoogleLogged", method = RequestMethod.GET)
//    public ResponseEntity<Staff> getInfoGoogleLogged(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
//        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
//        String email = Utils.validateIdToken(idToken, firebaseAuth);
//        Staff staff = staffService.getInfoGoogleLogged(email);
//        return ResponseEntity.status(HttpStatus.OK).body(staff);
//    }

    @RequestMapping(value = "getInfo", method = RequestMethod.GET)
    public ResponseEntity<Staff> getInfo(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.getInfo(email);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "getCustomerDetailByEmail", method = RequestMethod.GET)
    public ResponseEntity<Customer> getCustomerDetailByEmail(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken, @RequestParam String email) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Customer customer = staffService.getCustomerDetailByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @RequestMapping(value = "/updateInfo", method = RequestMethod.PUT , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Staff> updateInfo(@RequestPart StaffUpdateRequestBody staffUpdateRequestBody, @RequestPart(required = false) MultipartFile imageFile, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.updateInfo(staffUpdateRequestBody, email, imageFile);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/createStaffAccount", method = RequestMethod.POST)
    public ResponseEntity<Staff> createStaffAccount(@RequestBody StaffCreateRequestBody staffCreateRequestBody, @RequestParam StaffRole role, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, UnsupportedEncodingException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.createStaffAccount(staffCreateRequestBody, role);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

    @RequestMapping(value = "/getStaffByEmail", method = RequestMethod.GET)
    public ResponseEntity<Staff> getStaffByEmail(@RequestParam String email, @Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Staff staff = staffService.getStaffByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(staff);
    }

}
