package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.service.CustomerService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    private final FirebaseAuth firebaseAuth;

    @RequestMapping(value = "/registerWithEmailPassword", method = RequestMethod.POST , consumes = {"application/json"}, produces = {"text/plain"})
    public String register(@Valid @RequestBody CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException, UnsupportedEncodingException {
        String customerCustomToken = customerService.register(customerRegisterRequestBody);
        return customerCustomToken;
    }

    @RequestMapping(value = "/getInfoAfterGoogleLogged", method = RequestMethod.GET)
    public ResponseEntity<Customer> getInfoGoogleLogged(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Customer customer = customerService.getInfoGoogleLogged(email);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @RequestMapping(value = "getInfo", method = RequestMethod.GET)
    public ResponseEntity<Customer> getInfo(@Parameter(hidden = true)  @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Customer customer = customerService.getInfo(email);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @RequestMapping(value = "/updateInfo", method = RequestMethod.PUT , consumes = {"application/json"})
    public ResponseEntity<Customer> updateInfo(@RequestBody CustomerUpdateRequestBody customerUpdateRequestBody, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException, IOException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        Customer customer = customerService.updateInfo(customerUpdateRequestBody, email);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @RequestMapping(value = "/updatePassword", method = RequestMethod.PUT)
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordRequestBody passwordRequestBody, @Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        String email = Utils.validateIdToken(idToken, firebaseAuth);
        customerService.updatePassword(passwordRequestBody, email);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @RequestMapping(value = "/getCustomerForAdmin", method = RequestMethod.GET)
    public ResponseEntity<CustomerListResponseBody> getCustomerForAdmin(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            , @RequestParam(defaultValue = "") String name
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "5") Integer limit) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        CustomerListResponseBody customerListResponseBody = customerService.getCustomerForAdmin(name, page, limit);
        return ResponseEntity.status(HttpStatus.OK).body(customerListResponseBody);
    }

    @RequestMapping(value = "/updateCustomerAccountStatus", method = RequestMethod.PUT)
    public ResponseEntity<Customer> updateCustomerAccountStatus(@Parameter(hidden = true) @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
            ,@RequestBody @Valid AccountStatusChangeBody accountStatusChangeBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        Customer customer = customerService.updateCustomerAccountStatus(accountStatusChangeBody);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }


}
