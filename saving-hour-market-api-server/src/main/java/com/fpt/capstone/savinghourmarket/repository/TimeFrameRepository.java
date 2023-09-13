package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TimeFrameRepository extends JpaRepository<TimeFrame, UUID> {
}
