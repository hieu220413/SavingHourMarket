package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ModifyTimeFrameForbiddenException;
import com.fpt.capstone.savinghourmarket.model.EnableDisableStatusChangeBody;
import com.fpt.capstone.savinghourmarket.model.TimeFrameCreateUpdateBody;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.repository.TimeFrameRepository;
import com.fpt.capstone.savinghourmarket.service.TimeFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeFrameServiceImpl implements TimeFrameService {

    private final TimeFrameRepository timeFrameRepository;

    private final OrderRepository orderRepository;

    @Override
    public List<TimeFrame> getAll() {
        List<TimeFrame> timeFrames = timeFrameRepository.findAllForCustomer();
        return timeFrames;
    }

    @Override
    public List<TimeFrame> getAllForAdmin(EnableDisableStatus enableDisableStatus) {
        List<TimeFrame> timeFrames = timeFrameRepository.findAllForAdmin(enableDisableStatus == null ? null : enableDisableStatus.ordinal());
        return timeFrames;
    }

    @Override
    public List<TimeFrame> getForPickupPoint() {
        List<TimeFrame> timeFrames = timeFrameRepository.findForPickupPoint();
        return timeFrames;
    }

    @Override
    public List<TimeFrame> getForHomeDelivery() {
        LocalTime endTime = LocalTime.of(18,0,0);
        List<TimeFrame> timeFrames = timeFrameRepository.findForHomeDelivery(endTime);
        return timeFrames;
    }

    @Override
    public TimeFrame create(TimeFrameCreateUpdateBody timeFrameCreateUpdateBody) {
        HashMap errorFields = new HashMap<>();

        if(timeFrameCreateUpdateBody.getFromHour().isAfter(timeFrameCreateUpdateBody.getToHour()) || timeFrameCreateUpdateBody.getFromHour().equals(timeFrameCreateUpdateBody.getToHour())) {
            errorFields.put("fromHourError", "Start hour can not be after or equal end hour");
        }

        if(timeFrameCreateUpdateBody.getToHour().isBefore(timeFrameCreateUpdateBody.getFromHour()) || timeFrameCreateUpdateBody.getToHour().equals(timeFrameCreateUpdateBody.getFromHour())) {
            errorFields.put("toHourError", "End hour can not be before or equal start hour");

        }

        if(timeFrameRepository.findByFromHourAndToHour(timeFrameCreateUpdateBody.getFromHour(), timeFrameCreateUpdateBody.getToHour()).isPresent()){
            errorFields.put("fromHourError", "This time frame is existed");
            errorFields.put("toHourError", "This time frame is existed");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        TimeFrame timeFrame = new TimeFrame();
        timeFrame.setFromHour(timeFrameCreateUpdateBody.getFromHour());
        timeFrame.setToHour(timeFrameCreateUpdateBody.getToHour());
        timeFrame.setAllowableDeliverMethod(timeFrameCreateUpdateBody.getAllowableDeliverMethod().ordinal());
        timeFrame.setStatus(EnableDisableStatus.ENABLE.ordinal());

        return timeFrameRepository.save(timeFrame);
    }

    @Override
    @Transactional
    public TimeFrame update(TimeFrameCreateUpdateBody timeFrameUpdateBody, UUID timeFrameId) {
        HashMap errorFields = new HashMap<>();
        Optional<TimeFrame> timeFrame = timeFrameRepository.findById(timeFrameId);
        List<Order> processingOrderList = orderRepository.findTimeFrameInProcessingOrderById(timeFrame.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));

        if(processingOrderList.size() > 0) {
            throw new ModifyTimeFrameForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.TIME_FRAME_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.TIME_FRAME_IS_IN_PROCESSING_ORDER.toString());
        }

        if(!timeFrame.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.TIME_FRAME_NOT_FOUND.getCode()), AdditionalResponseCode.TIME_FRAME_NOT_FOUND.toString());
        }

        if(timeFrameUpdateBody.getFromHour().isAfter(timeFrameUpdateBody.getToHour()) || timeFrameUpdateBody.getFromHour().equals(timeFrameUpdateBody.getToHour())) {
            errorFields.put("fromHourError", "Start hour can not be after or equal end hour");
        }

        if(timeFrameUpdateBody.getToHour().isBefore(timeFrameUpdateBody.getFromHour()) || timeFrameUpdateBody.getToHour().equals(timeFrameUpdateBody.getFromHour())) {
            errorFields.put("toHourError", "End hour can not be before or equal start hour");

        }

        Optional<TimeFrame> duplicateTimeFrame = timeFrameRepository.findByFromHourAndToHour(timeFrameUpdateBody.getFromHour(), timeFrameUpdateBody.getToHour());


        if(duplicateTimeFrame.isPresent() && !duplicateTimeFrame.get().getId().equals(timeFrame.get().getId())){
            errorFields.put("fromHourError", "This time frame is existed");
            errorFields.put("toHourError", "This time frame is existed");
        }

        if(errorFields.size() > 0){
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        timeFrame.get().setFromHour(timeFrameUpdateBody.getFromHour());
        timeFrame.get().setToHour(timeFrameUpdateBody.getToHour());
        timeFrame.get().setAllowableDeliverMethod(timeFrameUpdateBody.getAllowableDeliverMethod().ordinal());

        return timeFrame.get();
    }

    @Override
    @Transactional
    public TimeFrame updateStatus(EnableDisableStatusChangeBody enableDisableStatusChangeBody) {
        Optional<TimeFrame> timeFrame = timeFrameRepository.findById(enableDisableStatusChangeBody.getId());

        if(!timeFrame.isPresent()){
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.TIME_FRAME_NOT_FOUND.getCode()), AdditionalResponseCode.TIME_FRAME_NOT_FOUND.toString());
        }

        if(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal() == EnableDisableStatus.ENABLE.ordinal()){
            timeFrame.get().setStatus(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal());
        } else {
            List<Order> processingOrderList = orderRepository.findTimeFrameInProcessingOrderById(timeFrame.get().getId(), PageRequest.of(0,1), List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
            if(processingOrderList.size() > 0) {
                throw new ModifyTimeFrameForbiddenException(HttpStatus.valueOf(AdditionalResponseCode.TIME_FRAME_IS_IN_PROCESSING_ORDER.getCode()), AdditionalResponseCode.TIME_FRAME_IS_IN_PROCESSING_ORDER.toString());
            }
            timeFrame.get().setStatus(enableDisableStatusChangeBody.getEnableDisableStatus().ordinal());
        }


        return timeFrame.get();
    }
}
