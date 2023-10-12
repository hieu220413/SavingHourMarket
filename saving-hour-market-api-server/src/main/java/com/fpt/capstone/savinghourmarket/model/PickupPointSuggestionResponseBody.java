package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class PickupPointSuggestionResponseBody {
    private UUID id;
    private String address;
    private Integer status;
    private String distance;
    private Long distanceInValue;
    private Double longitude;
    private Double latitude;

    public PickupPointSuggestionResponseBody(PickupPoint pickupPoint) {
        this.id = pickupPoint.getId();
        this.address = pickupPoint.getAddress();
        this.status = pickupPoint.getStatus();
        this.latitude = pickupPoint.getLatitude();
        this.longitude = pickupPoint.getLongitude();
    }
}
