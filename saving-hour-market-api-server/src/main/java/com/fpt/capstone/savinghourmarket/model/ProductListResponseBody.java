package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProductListResponseBody {
    private List<ProductDisplayStaff> productList;
    private int totalPage;
    private long totalProduct;
}
