package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class SelfStatusChangeNotAllowedException extends ResponseStatusException {
    public SelfStatusChangeNotAllowedException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
