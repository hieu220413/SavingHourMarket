package com.fpt.capstone.savinghourmarket.util;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.exception.UnverifiedEmailException;
import com.google.cloud.storage.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.StorageClient;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.http.HttpStatusCode;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.UUID;

public final class Utils {


    private Utils() {

    }

    public static String validateIdToken(String idToken, FirebaseAuth firebaseAuth) throws FirebaseAuthException {
        FirebaseToken token = firebaseAuth.verifyIdToken(idToken, true);
        if(!token.isEmailVerified()){
            throw new UnverifiedEmailException(HttpStatusCode.valueOf(AdditionalResponseCode.UNVERIFIED_EMAIL.getCode()), AdditionalResponseCode.UNVERIFIED_EMAIL.toString());
        }
        return token.getEmail();
    }

    public static String parseBearTokenToIdToken(String bearToken){
        return bearToken.replace("Bearer ", "");
    }


    public static String uploadPublicFileToFirebaseStorage(MultipartFile file) throws IOException {
        StorageClient storageClient = StorageClient.getInstance();
        Bucket bucket = storageClient.bucket();
        String imgName = "public/"+ UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
//        BlobId  blobId = BlobId.of(bucket.getName(), imgName);
//        BlobInfo blobInfo = BlobInfo.newBuilder()
//                .setContentType(file.getContentType())
//                .build();
        bucket.create(imgName, file.getInputStream(), file.getContentType());

        return generatePublicImageUrlFirebaseStorage(imgName);
    }

    public static String generatePublicImageUrlFirebaseStorage(String imageName) throws UnsupportedEncodingException {
        return "https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/"+ URLEncoder.encode(imageName, StandardCharsets.UTF_8.toString()) + "?alt=media";
    }

    public static String hmacSHA512VNPay(final String key, final String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

    public static String hashAllFieldsVNPay(Map fields, String secretKey) {
        List fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512VNPay(secretKey,sb.toString());
    }
    public static String getCustomerEmail(String jwtToken, FirebaseAuth firebaseAuth) throws FirebaseAuthException {
        String idToken = parseBearTokenToIdToken(jwtToken);
        return validateIdToken(idToken, firebaseAuth);
    }

}
