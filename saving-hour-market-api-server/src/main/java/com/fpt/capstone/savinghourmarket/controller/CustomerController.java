package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.model.CustomerRegisterRequestBody;
import com.fpt.capstone.savinghourmarket.service.CustomerService;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    @RequestMapping(value = "/registerWithEmailPassword", method = RequestMethod.POST , consumes = {"application/json"}, produces = {"application/json"})
    public ResponseEntity<Customer> register(@Valid @RequestBody CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException {
        Customer customer = customerService.register(customerRegisterRequestBody);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }



}
