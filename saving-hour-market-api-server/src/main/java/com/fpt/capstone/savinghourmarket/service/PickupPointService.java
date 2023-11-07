package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.model.*;
import com.google.maps.errors.ApiException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface PickupPointService {
    List<PickupPoint> getAll();

    PickupPointsSortWithSuggestionsResponseBody getWithSortAndSuggestion(Double latitude, Double longitude) throws IOException, InterruptedException, ApiException;

    List<PickupPointWithProductConsolidationArea> getAllForAdmin(EnableDisableStatus enableDisableStatus);

    PickupPointWithProductConsolidationArea create(PickupPointCreateBody pickupPointCreateBody);

    PickupPoint updateInfo(PickupPointUpdateBody pickupPointUpdateBody, UUID pickupPointId);

    PickupPoint updateStatus(EnableDisableStatusChangeBody enableDisableStatusChangeBody);

    PickupPointWithProductConsolidationArea updateProductConsolidationAreaList(ProductConsolidationAreaPickupPointUpdateListBody productConsolidationAreaPickupPointUpdateListBody);
}
