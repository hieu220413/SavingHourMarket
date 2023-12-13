package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.*;
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
    public ResponseEntity<ApiError> handleSelfStatusChangeNotAllowedException(SelfStatusChangeNotAllowedException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }

    @ExceptionHandler(SelfRoleChangeNotAllowedException.class)
    public ResponseEntity<ApiError> handleSelfRoleChangeNotAllowedException(SelfRoleChangeNotAllowedException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }

    @ExceptionHandler(DisableStaffForbiddenException.class)
    public ResponseEntity<ApiError> disableStaffForbiddenExceptionHandler(DisableStaffForbiddenException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }

    @ExceptionHandler(UnAssignPickupPointForStaffForbiddenException.class)
    public ResponseEntity<ApiError> unAssignPickupPointForStaffForbiddenExceptionHandler(UnAssignPickupPointForStaffForbiddenException e) {
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), e.getStatusCode().value(), e.getReason());
        return ResponseEntity.status(e.getStatusCode().value()).body(apiError);
    }
}
