package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class OrderExceptionHandler {
    @ExceptionHandler(NoSuchOrderException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiError> handleNoSuchOrderException (Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.NOT_FOUND.value(),e.getMessage()));
    }



    @ExceptionHandler(OrderCancellationNotAllowedException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiError> handleOrderCancellationNotAllowedException (Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.METHOD_NOT_ALLOWED.value(),e.getMessage()));
    }

    @ExceptionHandler(OrderDeletionNotAllowedException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiError> handleOrderDeletionNotAllowedException (Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.METHOD_NOT_ALLOWED.value(),e.getMessage()));
    }


    @ExceptionHandler(OutOfProductQuantityException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiError> handleOrderOutOfProductQuantityException (Exception e){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.CONFLICT.value(),e.getMessage()));
    }

    @ExceptionHandler(OutOfDiscountQuantityException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiError> handleOrderOutOfDiscountQuantityException (Exception e){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.CONFLICT.value(),e.getMessage()));
    }


    @ExceptionHandler(CustomerLimitOrderProcessingException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiError> handleCustomerLimitOrderProcessingException (Exception e){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.CONFLICT.value(),e.getMessage()));
    }

    @ExceptionHandler(ConflictGroupAndBatchException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiError> handleConflictGroupAndBatchException (Exception e){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.CONFLICT.value(),e.getMessage()));
    }

}
