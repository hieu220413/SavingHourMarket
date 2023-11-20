package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DiscountOnlyListResponseBody {
    List<DiscountOnly> discountList;
    private Integer totalPage;
    private Long totalDiscount;
}
