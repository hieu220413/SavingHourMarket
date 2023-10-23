package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupermarketRepository extends JpaRepository<Supermarket, UUID> {
    Optional<Supermarket> findByName(String name);

    @Query("SELECT s FROM Supermarket s " +
            "WHERE UPPER(s.name) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND s.status = :status")
    Page<Supermarket> getSupermarketForStaff(String name, Integer status, Pageable pageable);
}
