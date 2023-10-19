package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SupermarketListResponseBody {
    private List<Supermarket> supermarketList;
    private int totalPage;
    private long totalSupermarket;
}
