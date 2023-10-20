package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.StaffRole;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.model.AccountStatusChangeBody;
import com.fpt.capstone.savinghourmarket.model.StaffCreateRequestBody;
import com.fpt.capstone.savinghourmarket.model.StaffListResponseBody;
import com.fpt.capstone.savinghourmarket.model.StaffUpdateRequestBody;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public interface StaffService {
//    Staff getInfoGoogleLogged(String email) throws FirebaseAuthException;

    Staff getInfo(String email);

    Staff updateInfo(StaffUpdateRequestBody staffUpdateRequestBody, String email, MultipartFile imageFile) throws IOException;

    Customer getCustomerDetailByEmail(String email);

    Staff createStaffAccount(StaffCreateRequestBody staffCreateRequestBody, StaffRole role) throws FirebaseAuthException, UnsupportedEncodingException;

    Staff getStaffByEmail(String email);

    StaffListResponseBody getStaffForAdmin(String name, Integer page, Integer limit);

    Staff updateStaffAccountStatus(AccountStatusChangeBody accountStatusChangeBody, String email) throws FirebaseAuthException;
}
