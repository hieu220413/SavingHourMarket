package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class FeedBackImage {

    @Id
    private UUID id;

    @Column(columnDefinition = "text")
    private String url;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "feed_back_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private FeedBack feedBack;
}
