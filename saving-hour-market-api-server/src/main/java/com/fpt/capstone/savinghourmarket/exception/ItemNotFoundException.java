package com.fpt.capstone.savinghourmarket.exception;


import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class ItemNotFoundException extends ResponseStatusException {
    public ItemNotFoundException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
