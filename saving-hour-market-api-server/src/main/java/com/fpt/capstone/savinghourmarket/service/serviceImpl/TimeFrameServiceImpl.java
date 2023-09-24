package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import com.fpt.capstone.savinghourmarket.repository.TimeFrameRepository;
import com.fpt.capstone.savinghourmarket.service.TimeFrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeFrameServiceImpl implements TimeFrameService {

    private final TimeFrameRepository timeFrameRepository;
    @Override
    public List<TimeFrame> getAll() {
        List<TimeFrame> timeFrames = timeFrameRepository.findAll();
        return timeFrames;
    }
}
