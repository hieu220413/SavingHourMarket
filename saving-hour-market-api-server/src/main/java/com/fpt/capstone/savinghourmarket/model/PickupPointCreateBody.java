package com.fpt.capstone.savinghourmarket.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PickupPointCreateBody {
    @NotNull
    private String address;

    @NotNull
    private Double longitude;

    @NotNull
    private Double latitude;

    @NotNull
    private List<UUID> productConsolidationAreaIdList;
}
