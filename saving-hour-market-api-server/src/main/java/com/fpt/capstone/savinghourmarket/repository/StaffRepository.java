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
            "WHERE UPPER(s.fullName) LIKE UPPER(CONCAT('%',:name,'%')) ")
    Page<Staff> getStaffForAdmin(String name, Pageable pageable);
}
