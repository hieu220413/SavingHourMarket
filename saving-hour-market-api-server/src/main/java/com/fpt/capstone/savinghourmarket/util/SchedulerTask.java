package com.fpt.capstone.savinghourmarket.util;

import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.service.FirebaseService;
import com.google.firebase.auth.ExportedUserRecord;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SchedulerTask {

    private final FirebaseAuth firebaseAuth;

    private final CustomerRepository customerRepository;

    private final OrderRepository orderRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deleteUserWithEmailUnverifiedSchedule() throws FirebaseAuthException {
        ListUsersPage page = firebaseAuth.listUsers(null);
        List<String> expiredUserEmailList = new ArrayList<>();
        for (ExportedUserRecord user : page.iterateAll()) {
            if(!user.isEmailVerified()){
                LocalDateTime userCreatedTime = Instant.ofEpochMilli(user.getUserMetadata().getCreationTimestamp()).atZone(ZoneId.systemDefault()).toLocalDateTime();
                LocalDateTime expiredTime = userCreatedTime.plusHours(5);
                LocalDateTime currentTime = LocalDateTime.now();
                // if email is not verifired => delete after 5 hours
                if(currentTime.isAfter(expiredTime)){
                    expiredUserEmailList.add(user.getEmail());
                    firebaseAuth.deleteUser(user.getUid());
                }
            }
        }
        if(expiredUserEmailList.size() > 0){
            customerRepository.deleteCustomersWithIds(expiredUserEmailList);
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void confirmFailOrderExceedDeliverDate() throws IOException {
        List<Order> orderExceedDeliverDateList = orderRepository.findOrderExceedDeliverDateList(List.of(OrderStatus.PROCESSING.ordinal(), OrderStatus.DELIVERING.ordinal(), OrderStatus.PACKAGING.ordinal(), OrderStatus.PACKAGED.ordinal()));
        for (Order order : orderExceedDeliverDateList) {
            order.setStatus(OrderStatus.FAIL.ordinal());
//            FirebaseService.sendPushNotification("SHM", "Đơn hàng đã không thể giao! Bạn vui lòng liên hệ nhân viên để được hỗ trợ giao lại!", order.getCustomer().getId().toString());
        }
    }
}
