package com.fpt.capstone.savinghourmarket.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.capstone.savinghourmarket.model.ApiError;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.HashMap;

@Component
public class AccessDeniedHandlerCustom  implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        ApiError apiError = new ApiError(LocalDateTime.now().toString(), HttpStatus.FORBIDDEN.value(), HttpStatus.FORBIDDEN.getReasonPhrase().toUpperCase());
        OutputStream out = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
//        Map< String, Object > body = mapper.convertValue(apiError, Map.class);
        mapper.writeValue(out, apiError);
        out.flush();
    }
}
