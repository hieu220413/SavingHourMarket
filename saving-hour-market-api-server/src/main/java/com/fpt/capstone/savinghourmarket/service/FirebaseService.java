package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;
import com.google.firebase.messaging.Message;
import com.google.gson.JsonObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONObject;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public interface FirebaseService {

    static String uploadQRCodeToStorage(ByteArrayOutputStream qrCodeStream, UUID orderId) {
        try {
            Storage storage = StorageOptions.newBuilder().setProjectId("capstone-project-398104").build().getService();
            Bucket bucket = StorageClient.getInstance().bucket();

            byte[] qrCodeBytes = qrCodeStream.toByteArray();
            String objectName = "Order_QR_code/" + orderId + ".png"; // Set the desired object name

            bucket.create(objectName, qrCodeBytes, "image/png");

            return Utils.generatePublicImageUrlFirebaseStorage(objectName);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    static String uploadWordToStorage(ByteArrayOutputStream fileStream, UUID orderId) {
        try {
            Storage storage = StorageOptions.newBuilder().setProjectId("capstone-project-398104").build().getService();
            Bucket bucket = StorageClient.getInstance().bucket();

            byte[] qrCodeBytes = fileStream.toByteArray();
            String objectName = "OrderPrintWord/" + orderId + ".pdf"; // Set the desired object name

            bucket.create(objectName, qrCodeBytes, "application/pdf");

            return Utils.generatePublicWordUrlFirebaseStorage(objectName);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    static String uploadImageToStorage(ByteArrayOutputStream qrCodeStream, String imageName) {
        try {
            Storage storage = StorageOptions.newBuilder().setProjectId("capstone-project-398104").build().getService();
            Bucket bucket = StorageClient.getInstance().bucket();

            byte[] qrCodeBytes = qrCodeStream.toByteArray();
            String objectName = "public/" + imageName + ".png"; // Set the desired object name

            bucket.create(objectName, qrCodeBytes, "image/png");

            return Utils.generatePublicImageUrlFirebaseStorage(objectName);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    static HttpResponse sendPushNotification(String title, String messageSend, String topic) throws IOException {
        // Define the topic (channel) you want to send the notification to
        HttpClient client = HttpClientBuilder.create().build();
        HttpPost post = new HttpPost("https://fcm.googleapis.com/fcm/send");
        post.setHeader("Content-type", "application/json");
        post.setHeader("Authorization", "key=AAAAx5hQ_EI:APA91bHRBGKuU0a0FYFguEqLZhngOntEygSZw8Q93KQwllCP6rBcw86V4gXFwuaSvAVkOjD9lxO859vU8Y1L67oFfZTXEOVlJ-QreQiPBxgnHQ1ND4S9VEqlyjO1F5DMbGg6xZZ4sibi");

        JSONObject message = new JSONObject();
        message.put("to", "/topics/" + topic);
        message.put("priority", "high");

        JSONObject notification = new JSONObject();
        notification.put("title", title);
        notification.put("body", messageSend);

        message.put("notification", notification);

        post.setEntity(new StringEntity(message.toString(), "UTF-8"));

        return client.execute(post);
    }


}
