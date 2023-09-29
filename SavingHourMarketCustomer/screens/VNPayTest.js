import React from 'react';
import {
  NativeEventEmitter,
  Text,
  View,
  LogBox,
  TouchableOpacity,
} from 'react-native';
import VnpayMerchant, {
  VnpayMerchantModule,
} from '../react-native-vnpay-merchant';
LogBox.ignoreLogs(['new NativeEventEmitter']);
const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);
const VNPayTest = () => {
  return (
    <View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 24,
          paddingVertical: 10,
          backgroundColor: 'blue',
          borderRadius: 10,
        }}
        onPress={() => {
          // mở sdk
          eventEmitter.addListener('PaymentBack', e => {
            console.log('Sdk back!');
            if (e) {
              console.log('e.resultCode = ' + e.resultCode);
              //   switch (
              //     e.resultCode
              //     resultCode == -1
              //     vi: Người dùng nhấn back từ sdk để quay lại
              //     en: back from sdk (user press back in button title or button back in hardware android)

              //     resultCode == 10
              //     vi: Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...) lúc này app tích hợp sẽ cần lưu lại cái PNR, khi nào người dùng mở lại app tích hợp thì sẽ gọi kiểm tra trạng thái thanh toán của PNR Đó xem đã thanh toán hay chưa.
              //     en: user select app to payment (Mobile banking, wallet ...) you need save your PNR code. because we don't know when app banking payment successfully. so when user re-open your app. you need call api check your PNR code (is paid or unpaid). PNR: it's vnp_TxnRef. Reference code of transaction at Merchant system

              //     resultCode == 99
              //     vi: Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp
              //     en: back from button (button: done, ...) in the webview when payment success. (incase payment with card, atm card, visa ...)

              //     resultCode == 98
              //     vi: giao dịch thanh toán bị failed
              //     en: payment failed

              //     resultCode == 97
              //     vi: thanh toán thành công trên webview
              //     en: payment success
              //   ) {
              //   }

              //   khi tắt sdk
              eventEmitter.removeAllListeners('PaymentBack');
            }
          });

          // VnpayMerchant.show({
          //   iconBackName: 'ic_back',
          //   paymentUrl: 'https://sandbox.vnpayment.vn/testsdk',
          //   scheme: 'sampleapp',
          //   tmn_code: 'FAHASA03',
          // })
          // VnpayMerchant.show({
          //   iconBackName: 'ic_back',
          //   paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=15000000&vnp_Command=pay&vnp_CreateDate=20210225130220&vnp_CurrCode=VND&vnp_Locale=vn&vnp_OrderInfo=TEST%20BAEMIN%20ORDER&vnp_TmnCode=BAEMIN01&vnp_TxnRef=130220&vnp_Version=2.0.0&vnp_SecureHashType=SHA256&vnp_SecureHash=c7d9dedc25b304c961bd9a5c6ae21cb604700193ecb6b67ed871c1d084a462f4',
          //   scheme: 'swing',
          //   tmn_code: 'BAEMIN01',
          //   title: 'payment'
          // })
          // VnpayMerchant.show({
          //   iconBackName: 'ic_back',
          //   // paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=15000000&vnp_BankCode=MBAPP&vnp_Command=pay&vnp_CreateDate=20210225130220&vnp_CurrCode=VND&vnp_Locale=vn&vnp_OrderInfo=TEST%20BAEMIN%20ORDER&vnp_TmnCode=BAEMIN01&vnp_TxnRef=130220&vnp_Version=2.0.0&vnp_SecureHashType=SHA256&vnp_SecureHash=129664d02f0852765c8ade75b3fcca644bd0bfb26ceeb64b576e672c17f2cba1',
          //   paymentUrl: 'https://sandbox.vnpayment.vn/testsdk/',
          //   scheme: 'swing',
          //   tmn_code: 'BAEMIN01',
          //   title: 'tittlelelelel',
          //   beginColor: '#ffffff',
          //   endColor: '#ffffff', //6 ký tự.
          //   titleColor: '#000000'
          // })

          // VnpayMerchant.show({
          //   isSandbox: true,
          //   paymentUrl: 'https://sandbox.vnpayment.vn/testsdk',
          //   tmn_code: 'FAHASA03',
          //   backAlert: 'Bạn có chắc chắn trở lại ko?',
          //   title: 'VNPAY',
          //   iconBackName: 'ic_close',
          //   beginColor: 'ffffff',
          //   endColor: 'ffffff',
          //   titleColor: '000000',
          //   scheme: 'swing'
          // });

          VnpayMerchant.show({
            isSandbox: true,
            scheme: 'savingHourMarket',
            title: 'Thanh toán VNPAY',
            titleColor: '#333333',
            beginColor: '#ffffff',
            endColor: '#ffffff',
            iconBackName: 'close',
            paymentUrl:
              'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=11111100&vnp_Command=pay&vnp_CreateDate=20230929074953&vnp_CurrCode=VND&vnp_ExpireDate=20230929084953&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=ec5dcac6-56dc-11ee-8a50-a85e45c41921&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2F10.0.2.2%3A8082%2Fapi%2Ftransaction%2FprocessPaymentResult&vnp_TmnCode=MNWQOE3L&vnp_TxnRef=d59c1fd4-ff0e-4c94-b3ae-010bf61944f1&vnp_Version=2.1.0&vnp_SecureHash=16ad32cb765bdc1412010e41c561797a4ebc144ebbc05e8e8f880cf60638f837cf442a8a20e9ca79fe17b736031f18998767f0fb6c43579948d4f9a874e931cd',
          });

          console.log('Sdk opened');
        }}>
        <Text>Click activate vnpay webview</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VNPayTest;
