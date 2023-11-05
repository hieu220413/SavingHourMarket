package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fpt.capstone.savinghourmarket.common.DeliverMethodAvailableTimeFrame;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TimeFrameCreateUpdateBody {
    @NotNull
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime fromHour;
    @NotNull
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime toHour;
    @NotNull
    private DeliverMethodAvailableTimeFrame allowableDeliverMethod;
}
