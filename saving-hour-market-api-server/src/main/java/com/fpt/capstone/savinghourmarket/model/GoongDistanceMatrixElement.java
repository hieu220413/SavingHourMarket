package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GoongDistanceMatrixElement {
    private String status;
    private GoongDistanceMatrixDuration duration;
    private GoongDistanceMatrixDistance distance;
}
