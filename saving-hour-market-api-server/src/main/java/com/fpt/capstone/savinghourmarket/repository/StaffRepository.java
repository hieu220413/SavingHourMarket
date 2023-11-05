package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffRepository extends JpaRepository<Staff, UUID> {
    Optional<Staff> getStaffByEmail(String email);
    Optional<Staff> findByEmail(String email);

    @Query("SELECT s FROM Staff s " +
            "LEFT JOIN FETCH s.pickupPoint " +
            "WHERE UPPER(s.fullName) LIKE UPPER(CONCAT('%',:name,'%')) " +
            "AND " +
            "((:status IS NULL) OR (s.status = :status)) " +
            "AND " +
            "((:role IS NULL) OR (s.role = :role))")

    Page<Staff> getStaffForAdmin(String name, String role, Integer status, Pageable pageable);
}
