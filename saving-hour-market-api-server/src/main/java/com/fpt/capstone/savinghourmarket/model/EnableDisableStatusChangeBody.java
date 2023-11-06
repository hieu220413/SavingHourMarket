package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class EnableDisableStatusChangeBody {
    @NotNull
    private UUID id;
    @NotNull
    private EnableDisableStatus enableDisableStatus;
}
