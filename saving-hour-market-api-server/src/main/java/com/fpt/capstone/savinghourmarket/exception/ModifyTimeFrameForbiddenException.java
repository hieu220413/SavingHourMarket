package com.fpt.capstone.savinghourmarket.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class ModifyTimeFrameForbiddenException extends ResponseStatusException {
    public ModifyTimeFrameForbiddenException(HttpStatusCode status, String message) {
        super(status, message);
    }
}
