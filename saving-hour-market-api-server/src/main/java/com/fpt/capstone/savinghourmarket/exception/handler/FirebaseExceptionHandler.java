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
            if(e.getAuthErrorCode() == AuthErrorCode.REVOKED_ID_TOKEN){
                return ResponseEntity.status(HttpStatus.valueOf(AdditionalResponseCode.REVOKED_ID_TOKEN.getCode())).body(new ApiError(LocalDateTime.now(), HttpStatus.UNAUTHORIZED.value(), AdditionalResponseCode.REVOKED_ID_TOKEN.toString()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError(LocalDateTime.now(), HttpStatus.UNAUTHORIZED.value(), "UNAUTHORIZED"));
    }
}
