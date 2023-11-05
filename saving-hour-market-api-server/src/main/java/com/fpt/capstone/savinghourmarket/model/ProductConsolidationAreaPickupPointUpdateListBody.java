package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductConsolidationAreaPickupPointUpdateListBody {
    @NotNull
    private UUID id;
    @NotNull
    private List<UUID> newUpdateIdList;
}
