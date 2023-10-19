package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.FeedbackObject;
import com.fpt.capstone.savinghourmarket.common.FeedbackStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Customer;
import com.fpt.capstone.savinghourmarket.entity.FeedBack;
import com.fpt.capstone.savinghourmarket.entity.FeedBackImage;
import com.fpt.capstone.savinghourmarket.exception.FeedBackNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.FeedbackCreate;
import com.fpt.capstone.savinghourmarket.repository.CustomerRepository;
import com.fpt.capstone.savinghourmarket.repository.FeedBackRepository;
import com.fpt.capstone.savinghourmarket.service.FeedBackService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedBackServiceImpl implements FeedBackService {

    private final FirebaseAuth firebaseAuth;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private FeedBackRepository feedBackRepository;

    @Override
    @Transactional
    public String createFeedback(String jwtToken, FeedbackCreate feedBackCreate) throws FirebaseAuthException, ResourceNotFoundException {
        Customer customer = getCustomerInfo(jwtToken);
        FeedBack feedBack = new FeedBack();
        feedBack.setRate(feedBackCreate.getRate());
        feedBack.setMessage(feedBackCreate.getMessage());
        feedBack.setObject(feedBackCreate.getObject());
        feedBack.setCreatedTime(LocalDateTime.now());
        feedBack.setStatus(FeedbackStatus.PROCESSING);
        if (!feedBackCreate.getImageUrls().isEmpty()) {
            List<FeedBackImage> feedBackImages = new ArrayList<>();
            for (String url : feedBackCreate.getImageUrls()) {
                feedBackImages.add(FeedBackImage.builder().url(url).feedBack(feedBack).build());
            }
            feedBack.setImageUrls(feedBackImages);
        }
        feedBack.setCustomer(customer);
        feedBackRepository.save(feedBack);
        return "Feedback sent successfully";
    }

    @Override
    @Transactional
    public String updateStatus(UUID feedbackId, FeedbackStatus feedbackStatus) {
        FeedBack feedBack = feedBackRepository.findById(feedbackId).orElseThrow(() -> new NoSuchElementException("Feedback not found with id " + feedbackId));
        feedBack.setStatus(feedbackStatus);
        return "Feedback updated successfully";
    }

    @Override
    public List<FeedBack> getFeedbackForCustomer(String jwtToken, SortType createTimeSortType, SortType rateSortType, FeedbackObject feedbackObject, FeedbackStatus feedbackStatus, int page, int size) throws ResourceNotFoundException, FirebaseAuthException, FeedBackNotFoundException {
        Customer customer = getCustomerInfo(jwtToken);
        List<FeedBack> feedBacks = feedBackRepository.findFeedbackForCustomer(
                customer.getId(),
                feedbackObject,
                feedbackStatus,
                getPageableWithSort(createTimeSortType, rateSortType, page, size)
        );

        if (feedBacks.size() == 0) {
            throw new FeedBackNotFoundException("Hiện tại khách hàng chưa có ý kiến đánh giá!");
        }
        return feedBacks;
    }

    @Override
    public List<FeedBack> getFeedbackForStaff(UUID customerId, SortType createTimeSortType, SortType rateSortType, FeedbackObject feedbackObject, FeedbackStatus feedbackStatus, int page, int size) throws FeedBackNotFoundException {
        List<FeedBack> feedBacks = feedBackRepository.findFeedBackForStaff(
                customerId,
                feedbackObject,
                feedbackStatus,
                getPageableWithSort(createTimeSortType, rateSortType, page, size)
        );

        if (feedBacks.size() == 0) {
            throw new FeedBackNotFoundException("Danh sách trống!");
        }
        return feedBacks;
    }

    private Pageable getPageableWithSort(SortType createTimeSortType, SortType rateSortType, int page, int size) {
        Sort sort;

        if (rateSortType != null && rateSortType.equals(SortType.ASC)) {
            sort = Sort.by("rate").ascending();
        } else if (rateSortType != null && rateSortType.equals(SortType.DESC)) {
            sort = Sort.by("rate").descending();
        } else if (createTimeSortType != null && createTimeSortType.equals(SortType.ASC)) {
            sort = Sort.by("createdTime").ascending();
        } else{
            sort = Sort.by("createdTime").descending();
        }

        Pageable pageableWithSort;
        if (sort != null) {
            pageableWithSort = PageRequest.of(page, size, sort);
        } else {
            pageableWithSort = PageRequest.of(page, size);
        }
        return pageableWithSort;
    }

    private Customer getCustomerInfo(String jwtToken) throws FirebaseAuthException, ResourceNotFoundException {
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with this email " + email));
    }
}
