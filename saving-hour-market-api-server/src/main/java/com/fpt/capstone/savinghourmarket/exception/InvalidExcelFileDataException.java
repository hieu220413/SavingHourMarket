package com.fpt.capstone.savinghourmarket.exception;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;

@Getter
public class InvalidExcelFileDataException extends ResponseStatusException {
    private final LinkedHashMap errorFields;

    public InvalidExcelFileDataException(HttpStatusCode status, String message, LinkedHashMap errorFields) {
        super(status, message);
        this.errorFields = errorFields;
    }
}
