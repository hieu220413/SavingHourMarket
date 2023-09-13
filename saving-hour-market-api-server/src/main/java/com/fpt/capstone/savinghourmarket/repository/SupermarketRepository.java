package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SupermarketRepository extends JpaRepository<Supermarket, UUID> {
}
