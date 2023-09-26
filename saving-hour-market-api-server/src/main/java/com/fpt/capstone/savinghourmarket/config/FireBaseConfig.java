package com.fpt.capstone.savinghourmarket.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;

@Configuration
public class FireBaseConfig {
    @Value("classpath:service_account.json")
    private Resource serviceAccount;

    @Bean
    FirebaseAuth firebaseAuth() throws IOException {
        String bucketName = "capstone-project-398104";
        var credential = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                .setStorageBucket(bucketName +".appspot.com")
                .build();
        var firebaseApp = FirebaseApp.initializeApp(credential);
        return FirebaseAuth.getInstance(firebaseApp);
    }

}
