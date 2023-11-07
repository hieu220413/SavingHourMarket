package com.fpt.capstone.savinghourmarket.service;

import com.fpt.capstone.savinghourmarket.common.FeedbackObject;
import com.fpt.capstone.savinghourmarket.common.FeedbackStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.FeedBack;
import com.fpt.capstone.savinghourmarket.exception.FeedBackNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.FeedbackCreate;
import com.fpt.capstone.savinghourmarket.model.FeedbackReplyRequestBody;
import com.google.firebase.auth.FirebaseAuthException;

import java.util.List;
import java.util.UUID;

public interface FeedBackService {
    String createFeedback(String jwtToken, FeedbackCreate feedBackCreate) throws FirebaseAuthException, ResourceNotFoundException;

    String updateStatus(UUID feedbackId, FeedbackStatus feedbackStatus);

    List<FeedBack> getFeedbackForCustomer(String jwtToken,
                                          SortType createTimeSortType,
                                          SortType rateSortType,
                                          FeedbackObject feedbackObject, FeedbackStatus feedbackStatus, int page, int size) throws ResourceNotFoundException, FirebaseAuthException, FeedBackNotFoundException;

    List<FeedBack> getFeedbackForStaff(UUID customerId,
                                       SortType createTimeSortType,
                                       SortType rateSortType,
                                       FeedbackObject feedbackObject, FeedbackStatus feedbackStatus, int page, int size) throws ResourceNotFoundException, FirebaseAuthException, FeedBackNotFoundException;

    FeedBack replyFeedback(UUID feedbackId, FeedbackReplyRequestBody feedbackReplyRequestBody);
}
