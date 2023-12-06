package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.FeedbackObject;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.FeedBackImage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class FeedbackCreate {

    @Positive
    private Integer rate;

    private String message;

    private UUID orderId;

    private List<String> imageUrls;

    @NotNull
    private FeedbackObject object;

}
