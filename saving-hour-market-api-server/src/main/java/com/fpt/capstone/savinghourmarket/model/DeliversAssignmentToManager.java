package com.fpt.capstone.savinghourmarket.model;

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
public class DeliversAssignmentToManager {
    @NotNull
    private UUID deliverManagerId;
    @NotNull
    private List<UUID> deliverIdList;
}
