package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.model.PickupPointsSortWithSuggestionsResponseBody;
import com.fpt.capstone.savinghourmarket.service.PickupPointService;
import com.google.maps.errors.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pickupPoint")
@RequiredArgsConstructor
public class PickupPointController {

    private final PickupPointService pickupPointService;
    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    public ResponseEntity<List<PickupPoint>> getAll() {
        List<PickupPoint> pickupPoints = pickupPointService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(pickupPoints);
    }

    @RequestMapping(value = "/getWithSortAndSuggestion", method = RequestMethod.GET)
    public ResponseEntity<PickupPointsSortWithSuggestionsResponseBody> getWithSortAndSuggestion(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) throws IOException, InterruptedException, ApiException {
        PickupPointsSortWithSuggestionsResponseBody result = pickupPointService.getWithSortAndSuggestion(latitude, longitude);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
