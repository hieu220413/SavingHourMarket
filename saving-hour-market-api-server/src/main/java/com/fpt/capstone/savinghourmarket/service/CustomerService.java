package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.model.PasswordRequestBody;
import com.fpt.capstone.savinghourmarket.model.CustomerRegisterRequestBody;
import com.fpt.capstone.savinghourmarket.model.CustomerUpdateRequestBody;
import com.google.firebase.auth.FirebaseAuthException;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public interface CustomerService {
    String register(CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException, UnsupportedEncodingException;

    Customer getInfoGoogleLogged(String email) throws FirebaseAuthException;

    Customer getInfo(String email);

    Customer updateInfo(CustomerUpdateRequestBody customerUpdateRequestBody, String email) throws IOException;

    void updatePassword(PasswordRequestBody passwordRequestBody, String email) throws FirebaseAuthException;
}