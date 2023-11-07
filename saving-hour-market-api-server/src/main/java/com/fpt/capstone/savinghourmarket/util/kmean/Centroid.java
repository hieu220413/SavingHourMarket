package com.fpt.capstone.savinghourmarket.util.kmean;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Centroid {
    private  Map<String, Double> coordinates;
}
