package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.InvalidUserInputException;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class CustomerExceptionHandler {
    @ExceptionHandler(InvalidUserInputException.class)
    public ResponseEntity<ApiError> invalidUserInputExceptionHandler(InvalidUserInputException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason(), e.getErrorFields());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }
}
