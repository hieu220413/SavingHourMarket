package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OverLimitAlertBody {
    private Double limitExceedValue;
    @JsonIgnore
    private LocalTime fromHour;
    @JsonIgnore
    private LocalTime toHour;
    private String limitExceed;
    private String alertMessage;
}
