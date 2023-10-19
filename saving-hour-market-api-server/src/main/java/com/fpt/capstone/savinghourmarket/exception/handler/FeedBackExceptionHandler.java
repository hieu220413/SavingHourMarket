package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.exception.FeedBackNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class FeedBackExceptionHandler {

    @ExceptionHandler(FeedBackNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiError> handleFeedBackNotFoundException (Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(LocalDateTime.now().toString(), HttpStatus.NOT_FOUND.value(),e.getMessage()));
    }
}
