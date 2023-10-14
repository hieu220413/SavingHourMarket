package com.fpt.capstone.savinghourmarket.exception.handler;

import com.fpt.capstone.savinghourmarket.model.ApiError;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class BadRequestExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> errors = new ArrayList<>();
        for (ObjectError objectError : ex.getBindingResult()
                .getAllErrors()) {
            String defaultMessage = ((FieldError) objectError).getField() + ": " + objectError.getDefaultMessage();
            errors.add(defaultMessage);
        }
        ApiError error = new ApiError(LocalDateTime.now().toString(), HttpStatus.BAD_REQUEST.value(), errors.toString());
        return ResponseEntity.badRequest().body(error);
    }
}
