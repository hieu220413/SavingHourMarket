package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.SupermarketAddress;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupermarketCreateRequestBody {

    @NotNull
    private String name;

    @NotNull
    @Size(min = 1)
    private List<SupermarketAddressCreateBody> supermarketAddressList;

    @NotNull
    private String phone;
}
