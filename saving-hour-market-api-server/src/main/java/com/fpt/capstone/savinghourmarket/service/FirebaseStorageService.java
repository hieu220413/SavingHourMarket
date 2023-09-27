package com.fpt.capstone.savinghourmarket.service;

import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;


import java.io.ByteArrayOutputStream;
import java.util.UUID;

public interface FirebaseStorageService {

    static String uploadQRCodeToStorage(ByteArrayOutputStream qrCodeStream, UUID orderId) {
        try {
            Storage storage = StorageOptions.newBuilder().setProjectId("capstone-project-398104").build().getService();
            Bucket bucket = StorageClient.getInstance().bucket();

            byte[] qrCodeBytes = qrCodeStream.toByteArray();
            String objectName = "Order_QR_code/" + orderId + ".png"; // Set the desired object name

            bucket.create(objectName, qrCodeBytes,"image/png");

            return objectName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
