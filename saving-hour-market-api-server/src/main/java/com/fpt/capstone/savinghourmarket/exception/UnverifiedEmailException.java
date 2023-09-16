package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class UnverifiedEmailException extends ResponseStatusException {
    public UnverifiedEmailException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
