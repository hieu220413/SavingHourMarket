package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class SelfRoleChangeNotAllowedException extends ResponseStatusException {
    public SelfRoleChangeNotAllowedException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
