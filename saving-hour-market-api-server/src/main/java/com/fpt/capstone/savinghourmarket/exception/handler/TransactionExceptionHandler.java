package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.OrderIsPaidException;
import com.fpt.capstone.savinghourmarket.exception.RequiredEPaymentException;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class TransactionExceptionHandler {
    @ExceptionHandler(OrderIsPaidException.class)
    public ResponseEntity<ApiError> handleOrderIsPaidException(OrderIsPaidException e){
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode()).body(apiError);
    }

    @ExceptionHandler(RequiredEPaymentException.class)
    public ResponseEntity<ApiError> handleRequiredEPaymentException(RequiredEPaymentException e){
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode()).body(apiError);
    }
}
