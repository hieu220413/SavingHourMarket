package com.fpt.capstone.savinghourmarket.controller;

import com.fpt.capstone.savinghourmarket.common.FeedbackObject;
import com.fpt.capstone.savinghourmarket.common.FeedbackStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.FeedBack;
import com.fpt.capstone.savinghourmarket.exception.FeedBackNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.FeedbackCreate;
import com.fpt.capstone.savinghourmarket.model.FeedbackReplyRequestBody;
import com.fpt.capstone.savinghourmarket.service.FeedBackService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/feedback")
@RequiredArgsConstructor
public class FeedBackController {

    @Autowired
    private FeedBackService feedBackService;

    private final FirebaseAuth firebaseAuth;

    @PutMapping("/create")
    public ResponseEntity<String> createFeedback(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                 @Valid @RequestBody FeedbackCreate feedBackCreate) throws ResourceNotFoundException, FirebaseAuthException {
        return ResponseEntity.status(HttpStatus.OK).body(feedBackService.createFeedback(jwtToken, feedBackCreate));
    }

    @PutMapping("/reply")
    public ResponseEntity<FeedBack> replyFeedback(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken
            , @RequestParam UUID feedbackId
            , @Valid @RequestBody FeedbackReplyRequestBody feedbackReplyRequestBody) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(feedBackService.replyFeedback(feedbackId, feedbackReplyRequestBody));
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<String> updateStatus(@RequestParam UUID feedbackId, @RequestParam FeedbackStatus status,@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken) throws FirebaseAuthException {
        String idToken = Utils.parseBearTokenToIdToken(jwtToken);
        Utils.validateIdToken(idToken, firebaseAuth);
        return ResponseEntity.status(HttpStatus.OK).body(feedBackService.updateStatus(feedbackId, status));
    }


    @GetMapping("/getFeedbackForCustomer")
    public ResponseEntity<List<FeedBack>> getFeedbackForCustomer(@RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwtToken,
                                                                 @RequestParam(defaultValue = "DESC") SortType createTimeSortType,
                                                                 @RequestParam(required = false) SortType rateSortType,
                                                                 @RequestParam(required = false) FeedbackObject feedbackObject,
                                                                 @RequestParam(required = false) FeedbackStatus feedbackStatus,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "5") int size) throws ResourceNotFoundException, FirebaseAuthException, FeedBackNotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(feedBackService.getFeedbackForCustomer(jwtToken, createTimeSortType, rateSortType, feedbackObject, feedbackStatus, page, size));
    }

    @GetMapping("/getFeedbackForStaff")
    public ResponseEntity<List<FeedBack>> getFeedbackForStaff(
            @RequestParam(required = false) UUID customerId,
            @RequestParam(defaultValue = "DESC") SortType createTimeSortType,
            @RequestParam(required = false) SortType rateSortType,
            @RequestParam(required = false) FeedbackObject feedbackObject,
            @RequestParam(required = false) FeedbackStatus feedbackStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) throws ResourceNotFoundException, FirebaseAuthException, FeedBackNotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(feedBackService.getFeedbackForStaff(customerId, createTimeSortType, rateSortType, feedbackObject, feedbackStatus, page, size));

    }
}
