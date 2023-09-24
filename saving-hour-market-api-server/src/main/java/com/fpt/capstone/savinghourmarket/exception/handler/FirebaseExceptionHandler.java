package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuthException;
import org.checkerframework.checker.units.qual.A;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class FirebaseExceptionHandler {

    @ExceptionHandler(FirebaseAuthException.class)
    public ResponseEntity<ApiError> handleFirebaseAuthException(FirebaseAuthException e) {
        if(e.getAuthErrorCode() == AuthErrorCode.REVOKED_ID_TOKEN){
            return ResponseEntity.status(HttpStatus.valueOf(AdditionalResponseCode.REVOKED_ID_TOKEN.getCode())).body(new ApiError(LocalDateTime.now().toString(), AdditionalResponseCode.REVOKED_ID_TOKEN.getCode(), AdditionalResponseCode.REVOKED_ID_TOKEN.toString()));
        }
        if(e.getAuthErrorCode() == AuthErrorCode.EMAIL_ALREADY_EXISTS) {
            return ResponseEntity.status(HttpStatus.valueOf(AdditionalResponseCode.EMAIL_ALREADY_EXISTS.getCode())).body(new ApiError(LocalDateTime.now().toString(), AdditionalResponseCode.EMAIL_ALREADY_EXISTS.getCode(), AdditionalResponseCode.EMAIL_ALREADY_EXISTS.toString()));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.UNAUTHORIZED.value(), e.getAuthErrorCode().toString()));
    }
}
