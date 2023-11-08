package com.fpt.capstone.savinghourmarket.util.kmean;

import com.fpt.capstone.savinghourmarket.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Record {
    private Order order;
    private Map<String, Double> features;
}
