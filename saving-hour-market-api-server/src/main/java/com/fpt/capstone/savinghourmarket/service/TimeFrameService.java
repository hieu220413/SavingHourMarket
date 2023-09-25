package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TimeFrameService {
    List<TimeFrame> getAll();
}
