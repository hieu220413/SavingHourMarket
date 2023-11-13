package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductConsolidationAreaListResponse {
    private List<ProductConsolidationArea> productConsolidationAreaList;
    private int totalPage;
    private long totalProductConsolidationArea;
}
