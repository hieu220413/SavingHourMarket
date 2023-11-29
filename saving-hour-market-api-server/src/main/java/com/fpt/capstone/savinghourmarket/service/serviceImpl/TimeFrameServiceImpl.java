package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.DeliverMethodAvailableTimeFrame;
import com.fpt.capstone.savinghourmarket.common.EnableDisableStatus;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ModifyTimeFrameForbiddenException;
import com.fpt.capstone.savinghourmarket.model.EnableDisableStatusChangeBody;
import com.fpt.capstone.savinghourmarket.model.PickupPointWithProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.model.TimeFrameCreateUpdateBody;
import com.fpt.capstone.savinghourmarket.model.TimeFrameListResponseBody;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.repository.TimeFrameRepository;
import com.fpt.capstone.savinghourmarket.service.TimeFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
    public List<TimeFrame> getAllForStaff(EnableDisableStatus enableDisableStatus) {
        List<TimeFrame> timeFrames = timeFrameRepository.findAllForStaff(enableDisableStatus == null ? null : enableDisableStatus.ordinal());
        return timeFrames;
    }

    @Override
    public TimeFrameListResponseBody getAllForAdmin(EnableDisableStatus enableDisableStatus, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<TimeFrame> result = timeFrameRepository.findAllForAdmin(enableDisableStatus == null ? null : enableDisableStatus.ordinal(), pageable);

        int totalPage = result.getTotalPages();
        long totalTimeFrame = result.getTotalElements();

        List<TimeFrame> timeFrameList = result.stream().toList();


        return new TimeFrameListResponseBody(timeFrameList, totalPage, totalTimeFrame);
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

//        if(timeFrameRepository.findByHour(timeFrameCreateUpdateBody.getFromHour()).size() > 0) {
//            errorFields.put("fromHourError", "Start hour collides with hour from other timeframe");
//        }

//        if(timeFrameRepository.findByHour(timeFrameCreateUpdateBody.getToHour()).size() > 0 ) {
//            errorFields.put("toHourError", "End hour collides with hour from other timeframe");
//        }
        List<TimeFrame> collideHourValidation = timeFrameRepository.findByCollideHour(timeFrameCreateUpdateBody.getFromHour(), timeFrameCreateUpdateBody.getToHour());
        if(collideHourValidation.size() > 0) {
            errorFields.put("fromHourError", "This timeframe is collided with other timeframe");
            errorFields.put("toHourError", "This timeframe is collided with other timeframe");
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




//        List<TimeFrame> fromHourValidate = timeFrameRepository.findByHour(timeFrameUpdateBody.getFromHour());
//        if(fromHourValidate.size() > 0 ) {
//            List<TimeFrame> selfTimeFrame = fromHourValidate.stream().filter(frame -> frame.getId().equals(timeFrameId)).collect(Collectors.toList());
//            if(selfTimeFrame.size() == 0 ){
//                errorFields.put("fromHourError", "Start hour collides with hour from other timeframe");
//            }
//        }

//        List<TimeFrame> toHourValidate = timeFrameRepository.findByHour(timeFrameUpdateBody.getToHour());
//        if(toHourValidate.size() > 0 ) {
//            List<TimeFrame> selfTimeFrame = toHourValidate.stream().filter(frame -> frame.getId().equals(timeFrameId)).collect(Collectors.toList());
//            if(selfTimeFrame.size() == 0 ){
//                errorFields.put("toHourError", "End hour collides with hour from other timeframe");
//            }
//
//
//        }

        List<TimeFrame> collideHourValidation = timeFrameRepository.findByCollideHour(timeFrameUpdateBody.getFromHour(), timeFrameUpdateBody.getToHour());
        if(collideHourValidation.size() > 0) {
            if(collideHourValidation.size() == 1) {
                if(!collideHourValidation.get(0).getId().equals(timeFrameId)){
                    errorFields.put("fromHourError", "This timeframe is collided with other timeframe");
                    errorFields.put("toHourError", "This timeframe is collided with other timeframe");
                }
            } else {
                errorFields.put("fromHourError", "This timeframe is collided with other timeframe");
                errorFields.put("toHourError", "This timeframe is collided with other timeframe");
            }
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
