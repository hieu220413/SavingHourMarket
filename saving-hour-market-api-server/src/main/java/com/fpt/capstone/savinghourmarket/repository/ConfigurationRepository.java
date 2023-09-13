package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConfigurationRepository extends JpaRepository<Configuration,UUID> {
}
