package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Valid
public class ProductConsolidationAreaCreateBody {

    @NotNull
    private String address;

    @NotNull
    private Double longitude;

    @NotNull
    private Double latitude;

    @NotNull
    private List<UUID> pickupPointIdList;

}
