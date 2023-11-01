package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProductListCustomerResponseBody {
    private List<ProductDisplayCustomer> productList;
    private int totalPage;
    private long totalProduct;
}
