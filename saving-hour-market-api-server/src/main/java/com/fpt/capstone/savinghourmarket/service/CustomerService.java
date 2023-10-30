package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.model.*;
import com.google.firebase.auth.FirebaseAuthException;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public interface CustomerService {
    String register(CustomerRegisterRequestBody customerRegisterRequestBody) throws FirebaseAuthException, UnsupportedEncodingException;

    Customer getInfoGoogleLogged(String email) throws FirebaseAuthException;

    Customer getInfo(String email);

    Customer updateInfo(CustomerUpdateRequestBody customerUpdateRequestBody, String email) throws IOException;

    void updatePassword(PasswordRequestBody passwordRequestBody, String email) throws FirebaseAuthException;

    CustomerListResponseBody getCustomerForAdmin(String name, EnableDisableStatus status, Integer page, Integer limit);

    Customer updateCustomerAccountStatus(AccountStatusChangeBody accountStatusChangeBody) throws FirebaseAuthException;
}