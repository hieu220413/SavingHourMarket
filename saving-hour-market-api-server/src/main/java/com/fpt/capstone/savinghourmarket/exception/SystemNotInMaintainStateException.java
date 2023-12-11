package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class SystemNotInMaintainStateException extends ResponseStatusException {
    public SystemNotInMaintainStateException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
