package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.DeliverMethodAvailableTimeFrame;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import com.fpt.capstone.savinghourmarket.model.EnableDisableStatusChangeBody;
import com.fpt.capstone.savinghourmarket.model.TimeFrameCreateUpdateBody;
import com.fpt.capstone.savinghourmarket.model.TimeFrameListResponseBody;

import java.util.List;
import java.util.UUID;

public interface TimeFrameService {
    List<TimeFrame> getAll();

    List<TimeFrame> getForPickupPoint();

    List<TimeFrame> getForHomeDelivery();

    List<TimeFrame> getAllForStaff(EnableDisableStatus enableDisableStatus);

    TimeFrame create(TimeFrameCreateUpdateBody timeFrameCreateUpdateBody);

    TimeFrame update(TimeFrameCreateUpdateBody timeFrameUpdateBody, UUID timeframeId);

    TimeFrame updateStatus(EnableDisableStatusChangeBody enableDisableStatusChangeBody);

    TimeFrameListResponseBody getAllForAdmin(EnableDisableStatus enableDisableStatus, Integer page, Integer limit);
}
