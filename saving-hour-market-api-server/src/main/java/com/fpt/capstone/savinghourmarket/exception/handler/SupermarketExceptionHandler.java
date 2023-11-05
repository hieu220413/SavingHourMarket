package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.DeleteSuperMarketAddressForbiddenException;
import com.fpt.capstone.savinghourmarket.exception.DisableSupermarketForbidden;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class SupermarketExceptionHandler {
    @ExceptionHandler(DisableSupermarketForbidden.class)
    public ResponseEntity<ApiError> handleDisableSupermarketForbiddenException(DisableSupermarketForbidden e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode()).body(apiError);
    }

    @ExceptionHandler(DeleteSuperMarketAddressForbiddenException.class)
    public ResponseEntity<ApiError> handleDeleteSuperMarketAddressForbiddenException(DeleteSuperMarketAddressForbiddenException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode()).body(apiError);
    }
}
