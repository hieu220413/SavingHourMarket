package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountStatusChangeBody {
    @NotNull
    private UUID accountId;
    @NotNull
    private EnableDisableStatus enableDisableStatus;
}
