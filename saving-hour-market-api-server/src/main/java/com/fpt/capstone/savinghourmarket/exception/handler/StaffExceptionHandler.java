package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.DisableCustomerForbiddenException;
import com.fpt.capstone.savinghourmarket.exception.DisableStaffForbiddenException;
import com.fpt.capstone.savinghourmarket.exception.SelfStatusChangeNotAllowedException;
import com.fpt.capstone.savinghourmarket.exception.StaffAccessForbiddenException;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class StaffExceptionHandler {
    @ExceptionHandler(StaffAccessForbiddenException.class)
    public ResponseEntity<ApiError> handleStaffAccessForbiddenException(StaffAccessForbiddenException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }

    @ExceptionHandler(SelfStatusChangeNotAllowedException.class)
    public ResponseEntity<ApiError> selfStatusChangeNotAllowedException(SelfStatusChangeNotAllowedException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }

    @ExceptionHandler(DisableStaffForbiddenException.class)
    public ResponseEntity<ApiError> disableStaffForbiddenExceptionHandler(DisableStaffForbiddenException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }
}
