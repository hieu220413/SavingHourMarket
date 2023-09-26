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

//            bucket.create(objectName, qrCodeBytes);
            // Create a BlobId
            BlobId blobId = BlobId.of(bucket.getName(), objectName);

            // Define BlobInfo and upload the byte array
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            Blob blob = storage.create(blobInfo, qrCodeBytes);

            // Get the public URL of the uploaded QR code
            String publicUrl = blob.getMediaLink();

            return objectName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
