package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.ModifyProductConsolidationAreaForbiddenException;
import com.fpt.capstone.savinghourmarket.exception.ModifyTimeFrameForbiddenException;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class ProductConsolidationAreaExceptionHandler {

    @ExceptionHandler(ModifyProductConsolidationAreaForbiddenException.class)
    public ResponseEntity<ApiError> handleModifyProductConsolidationAreaForbiddenException(ModifyProductConsolidationAreaForbiddenException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode()).body(apiError);
    }
}
