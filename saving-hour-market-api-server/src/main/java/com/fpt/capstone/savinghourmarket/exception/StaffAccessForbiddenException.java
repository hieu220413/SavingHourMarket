package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class StaffAccessForbiddenException extends ResponseStatusException {
    public StaffAccessForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
