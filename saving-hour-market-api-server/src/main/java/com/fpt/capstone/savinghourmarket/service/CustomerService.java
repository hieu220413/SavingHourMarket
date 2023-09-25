package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.model.CustomerPasswordRequestBody;
import com.fpt.capstone.savinghourmarket.model.CustomerRegisterRequestBody;
import com.fpt.capstone.savinghourmarket.model.CustomerUpdateRequestBody;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CustomerService {
    Customer register(CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException;

    Customer getInfoGoogleLogged(String email) throws FirebaseAuthException;

    Customer getInfo(String email);

    Customer updateInfo(CustomerUpdateRequestBody customerUpdateRequestBody, String email);

    void updatePassword(CustomerPasswordRequestBody customerPasswordRequestBody, String email) throws FirebaseAuthException;
}