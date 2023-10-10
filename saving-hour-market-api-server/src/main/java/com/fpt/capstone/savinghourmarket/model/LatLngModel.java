package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LatLngModel {
    private Double latitude;
    private Double longtitude;

    @Override
    public String toString() {
        return latitude + "," + longtitude;
    }
}
