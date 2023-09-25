package com.fpt.capstone.savinghourmarket.util;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.exception.UnverifiedEmailException;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatusCode;

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
}
