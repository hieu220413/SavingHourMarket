package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.common.PaymentMethod;
import com.fpt.capstone.savinghourmarket.common.PaymentStatus;
import com.fpt.capstone.savinghourmarket.common.SortType;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.Transaction;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.OrderIsPaidException;
import com.fpt.capstone.savinghourmarket.exception.RequiredEPaymentException;
import com.fpt.capstone.savinghourmarket.exception.TransactionIsRefundException;
import com.fpt.capstone.savinghourmarket.model.TransactionListResponseBody;
import com.fpt.capstone.savinghourmarket.model.TransactionWithOrderInfo;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.repository.TransactionRepository;
import com.fpt.capstone.savinghourmarket.service.SystemConfigurationService;
import com.fpt.capstone.savinghourmarket.service.TransactionService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Getter
public class TransactionServiceImpl implements TransactionService {

    @Value("MNWQOE3L")
    private String vnpayTmnCode;

    @Value("CZQRWKJUMKNIUPGECAIOTTBLXOJAIMFM")
    private String vnpayHashSecret;

    @Value("${base-path}")
    private String basePath;

    private final OrderRepository orderRepository;

    private final TransactionRepository transactionRepository;

    private final SystemConfigurationService systemConfigurationService;

    @Override
    public String getPaymentUrl(Integer paidAmount, UUID orderId) {

        Optional<Order> order = orderRepository.findById(orderId);

        if(!order.isPresent()){
            throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.ORDER_NOT_FOUND.getCode()), AdditionalResponseCode.ORDER_NOT_FOUND.toString());
        }

        if(order.get().getPaymentMethod() == PaymentMethod.COD.ordinal()){
            throw new RequiredEPaymentException(HttpStatus.valueOf(AdditionalResponseCode.REQUIRED_E_PAYMENT.getCode()), AdditionalResponseCode.REQUIRED_E_PAYMENT.toString());
        }

        if(order.get().getPaymentStatus() == PaymentStatus.PAID.ordinal()){
            throw new OrderIsPaidException(HttpStatusCode.valueOf(AdditionalResponseCode.ORDER_IS_PAID.getCode()), AdditionalResponseCode.ORDER_IS_PAID.toString());
        }

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("YYYYMMddHHmmss");
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime expiredDateTime = today.plusMinutes(systemConfigurationService.getConfiguration().getDeleteUnpaidOrderTime()*60);
        String vpn_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TmnCode = vnpayTmnCode;
        String vnp_CurrCode = "VND";
        String vnp_IpAddr = "127.0.0.1";
        String vnp_Locale = "vn";
        String vnp_ReturnUrl = basePath+"/api/transaction/processPaymentResult"; //http://success.sdk.merchantbackapp/
        String vnp_OrderInfo = orderId.toString();
        String vnp_OrderType = "other";
        int vnp_Amount = paidAmount*100;
        UUID vnp_TxnRef = UUID.randomUUID();
        String vnp_CreateDate = dateTimeFormatter.format(today);
        String vnp_ExpireDate = dateTimeFormatter.format(expiredDateTime);
        String vnp_HashSecret = vnpayHashSecret;

        String queryParamsFirstHalf = "vnp_Amount=" + vnp_Amount + "&vnp_Command=" + vnp_Command + "&vnp_CreateDate=" + vnp_CreateDate + "&vnp_CurrCode=" + vnp_CurrCode + "&vnp_ExpireDate=" + vnp_ExpireDate + "&vnp_IpAddr=" + vnp_IpAddr + "&";

        String queryParamsSecondHalf = null; // vnp_ReturnUrl=${encodeURIComponent(vnp_ReturnUrl)}&

        try {
            queryParamsSecondHalf = "vnp_Locale=" + vnp_Locale + "&vnp_OrderInfo=" + URLEncoder.encode(vnp_OrderInfo, StandardCharsets.US_ASCII.toString()) + "&vnp_OrderType=" + vnp_OrderType + "&vnp_ReturnUrl=" + URLEncoder.encode(vnp_ReturnUrl, StandardCharsets.US_ASCII.toString()) + "&";
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        String queryParamsThirdHalf = "vnp_TmnCode=" + vnp_TmnCode + "&vnp_TxnRef=" + vnp_TxnRef + "&vnp_Version=" + vpn_Version;

        String vnp_SecureHash = Utils.hmacSHA512VNPay(vnp_HashSecret, queryParamsFirstHalf + queryParamsSecondHalf + queryParamsThirdHalf);

        String fullRequestParam = queryParamsFirstHalf + queryParamsSecondHalf + queryParamsThirdHalf + "&vnp_SecureHash=" + vnp_SecureHash;

        String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?"+fullRequestParam;

        return paymentUrl;
    }

    @Override
    @Transactional
    public RedirectView processPaymentResult(Map<String, String> allRequestParams) {
        String vnp_SecureHash = "";
        if (allRequestParams.containsKey("vnp_SecureHashType")) {
            allRequestParams.remove("vnp_SecureHashType");
        }
        if (allRequestParams.containsKey("vnp_SecureHash")) {
            vnp_SecureHash = allRequestParams.get("vnp_SecureHash");
            allRequestParams.remove("vnp_SecureHash");
        }

        String signValue = Utils.hashAllFieldsVNPay(allRequestParams, vnpayHashSecret);

        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(allRequestParams.get("vnp_ResponseCode"))) {
                String orderId = allRequestParams.get("vnp_OrderInfo");
                String transactionNo = allRequestParams.get("vnp_TransactionNo");
                String transactionDateTime = allRequestParams.get("vnp_PayDate");
                String price  = allRequestParams.get("vnp_Amount");

                String year = transactionDateTime.substring(0,4);
                String month = transactionDateTime.substring(4,6);
                String date = transactionDateTime.substring(6,8);
                String hour = transactionDateTime.substring(8,10);
                String minute = transactionDateTime.substring(10,12);
                String second = transactionDateTime.substring(12,14);
                LocalDateTime transactionLocalDateTime = LocalDateTime.parse(""+ year + "-" + month + "-" + date + "T" + hour + ":" + minute + ":" + second );

                Transaction transaction = new Transaction();
                transaction.setTransactionNo(transactionNo);
                transaction.setPaymentTime(transactionLocalDateTime);
                transaction.setAmountOfMoney(Integer.valueOf(price.substring(0, price.length()-2)));
                transaction.setPaymentMethod(PaymentMethod.VNPAY.ordinal());

                //should perform lock from this part
                Order order = orderRepository.findById(UUID.fromString(orderId)).get();
                if(order.getPaymentStatus() == PaymentStatus.PAID.ordinal()){
                    throw new OrderIsPaidException(HttpStatusCode.valueOf(AdditionalResponseCode.ORDER_IS_PAID.getCode()), AdditionalResponseCode.ORDER_IS_PAID.toString());
                }
                order.setPaymentStatus(PaymentStatus.PAID.ordinal());
                transaction.setOrder(order);
                transactionRepository.save(transaction);
                // to this part
                return  new RedirectView("http://success.sdk.merchantbackapp/");
            }
        }
        if("99".equals(allRequestParams.get("vnp_ResponseCode"))){
            return new RedirectView("http://cancel.sdk.merchantbackapp/");
        }
        return  new RedirectView("http://fail.sdk.merchantbackapp/");
    }

    @Override
    public TransactionListResponseBody getTransactionForAdmin(SortType timeSortType, LocalDateTime fromDatetime, LocalDateTime toDatetime, Integer page, Integer limit) {
        Sort sort;
        if(timeSortType == null || timeSortType.equals(SortType.ASC)) {
            sort = Sort.by("paymentTime").ascending();
        } else {
            sort = Sort.by("paymentTime").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sort);

        Page<Transaction> result = transactionRepository.getTransactionForAdmin(fromDatetime, toDatetime, pageableWithSort);

        Integer totalPage = result.getTotalPages();

        Long totalTransaction = result.getTotalElements();

        List<TransactionWithOrderInfo> transactionWithOrderInfoList = result.stream().map(TransactionWithOrderInfo::new).toList();

        return new TransactionListResponseBody(transactionWithOrderInfoList, totalPage, totalTransaction);
    }

    @Override
    public TransactionListResponseBody getTransactionRequiredRefundForAdmin(SortType timeSortType, LocalDateTime fromDatetime, LocalDateTime toDatetime, Integer page, Integer limit, boolean isRefund) {
        Sort sort;
        if(timeSortType == null || timeSortType.equals(SortType.ASC)) {
            sort = Sort.by("paymentTime").ascending();
        } else {
            sort = Sort.by("paymentTime").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sort);

        Page<Transaction> result = transactionRepository.getTransactionRequiredRefundForAdmin(fromDatetime, toDatetime, pageableWithSort, isRefund);

        Integer totalPage = result.getTotalPages();

        Long totalTransaction = result.getTotalElements();

        List<TransactionWithOrderInfo> transactionWithOrderInfoList = result.stream().map(TransactionWithOrderInfo::new).toList();

        return new TransactionListResponseBody(transactionWithOrderInfoList, totalPage, totalTransaction);
    }

    @Override
    @Transactional
    public Transaction refundTransaction(UUID transactionId) {
        Optional<Transaction> transaction = transactionRepository.findById(transactionId);
        if(!transaction.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.TRANSACTION_NOT_FOUND.getCode()), AdditionalResponseCode.TRANSACTION_NOT_FOUND.toString());
        }
        if(transaction.get().getRefundTransaction() != null) {
            throw new TransactionIsRefundException(HttpStatus.valueOf(AdditionalResponseCode.TRANSACTION_IS_REFUNDED.getCode()), AdditionalResponseCode.TRANSACTION_IS_REFUNDED.toString());
        }
        Transaction refundTransaction = new Transaction();
        refundTransaction.setAmountOfMoney(transaction.get().getAmountOfMoney());
        refundTransaction.setPaymentTime(LocalDateTime.now());
        refundTransaction.setPaymentMethod(PaymentMethod.VNPAY.ordinal());

        transaction.get().setRefundTransaction(transactionRepository.save(refundTransaction));

        return transaction.get();
    }
}
