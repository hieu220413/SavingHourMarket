package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FeedBackRepository extends JpaRepository<FeedBack, UUID> {
}
