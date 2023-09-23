package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import com.fpt.capstone.savinghourmarket.service.TimeFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/timeframe")
public class TimeFrameController {

    private final TimeFrameService timeFrameService;

    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    public ResponseEntity<List<TimeFrame>> getAll() {
        List<TimeFrame> timeFrameList = timeFrameService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(timeFrameList);
    }
}
