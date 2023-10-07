package com.fpt.capstone.savinghourmarket.util;

import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.google.firebase.auth.ExportedUserRecord;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
}
