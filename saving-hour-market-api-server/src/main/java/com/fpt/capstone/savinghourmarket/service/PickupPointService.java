package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.model.PickupPointsSortWithSuggestionsResponseBody;
import com.google.maps.errors.ApiException;

import java.io.IOException;
import java.util.List;

public interface PickupPointService {
    List<PickupPoint> getAll();

    PickupPointsSortWithSuggestionsResponseBody getWithSortAndSuggestion(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException;
}
