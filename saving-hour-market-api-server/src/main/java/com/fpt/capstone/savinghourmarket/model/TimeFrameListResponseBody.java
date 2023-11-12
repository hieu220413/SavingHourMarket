package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TimeFrameListResponseBody {
    private List<TimeFrame> pickupPointList;
    private int totalPage;
    private long totalTimeFrame;
}
