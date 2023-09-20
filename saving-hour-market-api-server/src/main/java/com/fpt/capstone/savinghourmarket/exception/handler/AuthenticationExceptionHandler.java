package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.UnverifiedEmailException;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class AuthenticationExceptionHandler {
    @ExceptionHandler(UnverifiedEmailException.class)
    public ResponseEntity<ApiError> unverifiedEmailExceptionHandler(UnverifiedEmailException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getMessage());
        return ResponseEntity.status(e.getStatusCode()).body(apiError);
    }
}
