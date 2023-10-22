package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupermarketSaleReportResponseBody {

    public SupermarketSaleReportResponseBody(Supermarket supermarket) {
        this.id = supermarket.getId();
        this.name = supermarket.getName();
        this.totalSale = 0;
        this.totalIncome = Long.parseLong("0");
    }

    public SupermarketSaleReportResponseBody(UUID id, Long totalSale, Long totalIncome) {
        this.id = id;
        this.totalSale = totalSale.intValue();
        this.totalIncome = totalIncome;
    }

    private UUID id;
    private String name;
    private Integer totalSale;
    private Long totalIncome;
}
