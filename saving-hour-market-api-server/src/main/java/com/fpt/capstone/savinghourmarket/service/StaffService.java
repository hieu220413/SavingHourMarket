package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.model.PasswordRequestBody;
import com.fpt.capstone.savinghourmarket.model.StaffUpdateRequestBody;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface StaffService {
    Staff getInfoGoogleLogged(String email) throws FirebaseAuthException;

    Staff getInfo(String email);

    Staff updateInfo(StaffUpdateRequestBody staffUpdateRequestBody, String email, MultipartFile imageFile) throws IOException;
}
