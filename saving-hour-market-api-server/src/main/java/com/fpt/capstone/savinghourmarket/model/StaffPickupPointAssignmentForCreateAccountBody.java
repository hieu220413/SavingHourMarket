package com.fpt.capstone.savinghourmarket.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class StaffPickupPointAssignmentForCreateAccountBody {
    @NotNull
    private String staffEmail;
    @NotNull
    @Size(min = 1)
    private List<UUID> pickupPointIdList;
}
