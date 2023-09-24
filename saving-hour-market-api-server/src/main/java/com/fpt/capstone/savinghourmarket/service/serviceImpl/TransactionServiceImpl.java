package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.AdditionalResponseCode;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.service.TransactionService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Getter
public class TransactionServiceImpl implements TransactionService {

    @Value("${VNPAY_TMN_CODE}")
    private String vnpayTmnCode;

    @Value("${VNPAY_HASH_SECRET}")
    private String vnpayHashSecret;

    @Value("${base-path-android}")
    private String basePath;

    private final OrderRepository orderRepository;

    @Override
    public String getPaymentUrl(Integer paidAmount, UUID orderId) {

        if(!orderRepository.findById(orderId).isPresent()){
            throw new ItemNotFoundException(HttpStatusCode.valueOf(AdditionalResponseCode.ORDER_NOT_FOUND.getCode()), AdditionalResponseCode.ORDER_NOT_FOUND.toString());
        }

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("YYYYMMddHHmmss");
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime expiredDateTime = today.plusHours(1);
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
        int vnp_TxnRef = new Random().nextInt(9999999);
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
                return  new RedirectView("http://success.sdk.merchantbackapp/");
            }
        }
        return  new RedirectView("http://fail.sdk.merchantbackapp/");
    }
}
