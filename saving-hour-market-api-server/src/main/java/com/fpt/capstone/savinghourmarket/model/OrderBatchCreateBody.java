package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import com.fpt.capstone.savinghourmarket.entity.TimeFrame;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.aspectj.lang.annotation.After;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderBatchCreateBody {

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deliverDate;

    @NotNull
    private UUID timeFrameId;

    @NotNull
    private UUID productConsolidationAreaId;

    @NotNull
    @Size(min = 1)
    private List<UUID> orderIdList;


}
