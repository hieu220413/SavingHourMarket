package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.District;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.CustomerUpdateRequestBody;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderProduct;
import com.fpt.capstone.savinghourmarket.model.OrderProductCreate;
import com.fpt.capstone.savinghourmarket.repository.*;
import com.fpt.capstone.savinghourmarket.service.CustomerService;
import com.fpt.capstone.savinghourmarket.service.FirebaseStorageService;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final FirebaseAuth firebaseAuth;

    @Autowired
    private final RedissonClient redissonClient;

    @Autowired
    private OrderRepository repository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderGroupRepository orderGroupRepository;

    @Autowired
    private OrderBatchRepository orderBatchRepository;

    @Autowired
    private TimeFrameRepository timeFrameRepository;

    @Autowired
    private PickupPointRepository pickupPointRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DiscountRepository discountRepository;


    @Override
    public List<OrderGroup> fetchOrderGroups(String jwtToken, LocalDate deliverDate, UUID timeFrameId, UUID pickupPointId, UUID delivererId) throws NoSuchOrderException, FirebaseAuthException {
        if (Authorization(jwtToken).equalsIgnoreCase("STAFF")) {
            List<OrderGroup> orderGroups = orderGroupRepository.findByTimeFrameOrPickupPointOrDeliverDate(timeFrameId, pickupPointId, delivererId, deliverDate);
            if (orderGroups.isEmpty()) {
                throw new NoSuchOrderException("No such order group left on system");
            }
            return orderGroups;
        } else {
            throw new AuthorizationServiceException("Access denied with this email");
        }
    }

    @Override
    public List<Order> fetchOrdersForCustomer(String jwtToken,
                                              String totalPriceSortType,
                                              String createdTimeSortType,
                                              String deliveryDateSortType,
                                              OrderStatus orderStatus,
                                              Boolean isPaid,
                                              int page,
                                              int limit) throws NoSuchOrderException, FirebaseAuthException {
        if (Authorization(jwtToken).equalsIgnoreCase("CUSTOMER")) {
            List<Order> orders = repository.findOrderForCustomer(Utils.getCustomerEmail(jwtToken, firebaseAuth),
                    orderStatus == null ? null : orderStatus.ordinal(),
                    isPaid,
                    getPageableWithSort(totalPriceSortType, createdTimeSortType, deliveryDateSortType, page, limit));
            if (orders.size() == 0) {
                throw new NoSuchOrderException("No orders found");
            }
            return orders;
        } else {
            throw new AuthorizationServiceException("Access denied with this email");
        }

    }

    @Override
    public List<OrderBatch> fetchOrderBatches(String jwtToken, District district, LocalDate deliveryDate) throws NoSuchOrderException {
        List<OrderBatch> orderBatches = orderBatchRepository.findByDistrictOrDeliverDate(district != null ? district.getDistrictName() : null, deliveryDate);
        if (orderBatches.size() == 0) {
            throw new NoSuchOrderException("No order batch found");
        }
        return orderBatches;
    }

    @Override
    public List<Order> fetchOrdersForStaff(String jwtToken,
                                           String totalPriceSortType,
                                           String createdTimeSortType,
                                           String deliveryDateSortType,
                                           OrderStatus orderStatus,
                                           UUID packagerId,
                                           Boolean isPaid,
                                           Boolean isGrouped,
                                           int page,
                                           int limit) throws NoSuchOrderException, FirebaseAuthException {
        if (Authorization(jwtToken).equalsIgnoreCase("STAFF")) {
            List<Order> orders = repository.findOrderForStaff(packagerId,
                    orderStatus == null ? null : orderStatus.ordinal(),
                    isGrouped,
                    isPaid,
                    getPageableWithSort(totalPriceSortType,
                            createdTimeSortType,
                            deliveryDateSortType,
                            page,
                            limit)
            );
            if (orders.size() == 0) {
                throw new NoSuchOrderException("No orders found");
            }
            return orders;
        } else {
            throw new AuthorizationServiceException("Access denied with this email");
        }
    }

    @Override
    public List<OrderProduct> fetchOrderDetail(UUID id) throws ResourceNotFoundException {
        log.info("Fetching order detail of order_id " + id);
        Order order = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No order with id " + id));
        List<OrderDetail> orderDetails = order.getOrderDetailList();
        return orderDetails.stream()
                .map(o -> {
                    //Map product to model orderProduct
                    OrderProduct orderProduct = new OrderProduct();
                    orderProduct.setId(o.getId());
                    orderProduct.setProductPrice(o.getProductPrice());
                    orderProduct.setProductOriginalPrice(o.getProductOriginalPrice());
                    orderProduct.setBoughtQuantity(o.getBoughtQuantity());

                    Product product = o.getProduct();
                    orderProduct.setName(product.getName());
                    orderProduct.setImageUrl(product.getImageUrl());
                    orderProduct.setDescription(product.getDescription());
                    orderProduct.setExpiredDate(product.getExpiredDate());
                    orderProduct.setProductSubCategory(product.getProductSubCategory().getName());
                    orderProduct.setSupermarketName(product.getSupermarket().getName());
                    orderProduct.setStatus(product.getStatus());

                    return orderProduct;

                })
                .collect(Collectors.toList());
    }

    @Override
    public String cancelOrder(String jwtToken, UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException, FirebaseAuthException {
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() -> new AuthorizationServiceException("Access denied with this account: " + email));
        if (customer == null) {
            return "Fail to canceled order " + id;
        }
        Order order = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No order with id " + id));
        if (order.getStatus() == OrderStatus.PROCESSING.ordinal()) {
            order.setStatus(OrderStatus.CANCEL.ordinal());
        } else {
            throw new OrderCancellationNotAllowedException("Order with id " + id + " is already in " + order.getStatus().toString() + " process");
        }
        repository.save(order);
        return "Successfully canceled order " + id;
    }

    @Override
    public String createOrder(String jwtToken, OrderCreate orderCreate) throws Exception {
        log.info("Creating new order");
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() -> new AuthorizationServiceException("Access denied with this account: " + email));
        saveCustomerInfoIfNeeded(customer, orderCreate);

        if (repository.getOrdersProcessing(customer.getEmail()).size() > 3) {
            throw new CustomerLimitOrderProcessingException("Customer already has 3 PROCESSING orders");
        }

        RLock rLock = redissonClient.getLock("createOrderLock");
        String result;
        try {
            rLock.lock();
            result = createOrderTransact(orderCreate, customer);
        } finally {
            rLock.unlock();
        }
        return result;
    }

    @Transactional(rollbackFor = {ResourceNotFoundException.class, InterruptedException.class, IOException.class, OutOfProductQuantityException.class})
    String createOrderTransact(OrderCreate orderCreate, Customer customer) throws ResourceNotFoundException, InterruptedException, IOException, OutOfProductQuantityException {
        Order order = setOrderData(orderCreate, customer);

        if (orderCreateHasPickupPointAndTimeFrame(orderCreate)) {
            groupingOrder(order, orderCreate);
        } else {
            batchingOrder(order, orderCreate);
        }

        Order orderSavedSuccessWithoutQrCodeUrl = repository.save(order);
        String qrCodeUrl = generateAndUploadQRCode(orderSavedSuccessWithoutQrCodeUrl);
        orderSavedSuccessWithoutQrCodeUrl.setQrCodeUrl(qrCodeUrl);

        Order orderSavedSuccess = repository.save(orderSavedSuccessWithoutQrCodeUrl);

        saveOrderDetails(orderSavedSuccess, orderCreate);

        return orderSavedSuccess.getId().toString();
    }

    private void saveCustomerInfoIfNeeded(Customer customer, OrderCreate orderCreate) throws IOException {
        CustomerUpdateRequestBody customerUpdateRequestBody = new CustomerUpdateRequestBody();
        if (customer.getAddress() == null || customer.getAddress().isEmpty() || customer.getAddress().isBlank()) {
            customerUpdateRequestBody.setAddress(orderCreate.getAddressDeliver());
        } else if (customer.getFullName() == null || customer.getFullName().isEmpty() || customer.getFullName().isBlank()) {
            customerUpdateRequestBody.setFullName(orderCreate.getCustomerName());
        } else if (customer.getPhone() == null || customer.getPhone().isEmpty() || customer.getPhone().isBlank()) {
            customerUpdateRequestBody.setPhone(orderCreate.getPhone());
        }
        customerService.updateInfo(customerUpdateRequestBody, customer.getEmail(), null);
    }

    private void batchingOrder(Order order, OrderCreate orderCreate) throws ResourceNotFoundException {
        String district = extractDistrict(orderCreate.getAddressDeliver());
        if (district != null) {
            log.debug(district);
        } else {
            throw new ResourceNotFoundException("District not found");
        }
        OrderBatch batch = null;
        Optional<OrderBatch> orderBatch = orderBatchRepository.findByDistrictAndDeliverDate(district, orderCreate.getDeliveryDate());
        if (orderBatch.isPresent()) {
            batch = orderBatch.get();
        } else {
            batch = new OrderBatch();
            batch.setDeliverDate(orderCreate.getDeliveryDate());
            batch.setDistrict(district);
            orderBatchRepository.save(batch);
        }
        order.setOrderBatch(batch);
    }

    private Order setOrderData(OrderCreate orderCreate, Customer customer) throws ResourceNotFoundException, InterruptedException {
        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingFee(orderCreate.getShippingFee());
        order.setTotalPrice(orderCreate.getTotalPrice());
        order.setTotalDiscountPrice(orderCreate.getTotalDiscountPrice());
        order.setDeliveryDate(Date.valueOf(orderCreate.getDeliveryDate()));
        order.setPaymentStatus(orderCreate.getPaymentStatus().ordinal());
        order.setStatus(OrderStatus.PROCESSING.ordinal());
        order.setPaymentMethod(orderCreate.getPaymentMethod());
        order.setAddressDeliver(orderCreate.getAddressDeliver());
        order.setCreatedTime(LocalDateTime.now());
        mapDiscountsToOrder(order, orderCreate.getDiscountID());
        mapTransactionToOrder(order, orderCreate.getTransaction());
        return order;
    }

    private boolean orderCreateHasPickupPointAndTimeFrame(OrderCreate orderCreate) {
        return orderCreate.getPickupPointId() != null && !orderCreate.getPickupPointId().toString().isEmpty()
                && orderCreate.getTimeFrameId() != null && !orderCreate.getTimeFrameId().toString().isEmpty();
    }

    private void groupingOrder(Order order, OrderCreate orderCreate) {
        OrderGroup group = null;
        Optional<OrderGroup> orderGroup = orderGroupRepository
                .findByTimeFrameIdAndPickupPointIdAndDeliverDate(
                        orderCreate.getTimeFrameId(),
                        orderCreate.getPickupPointId(),
                        orderCreate.getDeliveryDate()
                );
        if (orderGroup.isPresent()) {
            group = orderGroup.get();
        } else {
            OrderGroup orderGroupNew = createNewOrderGroup(orderCreate);
            group = orderGroupRepository.save(orderGroupNew);
        }
        order.setOrderGroup(group);
    }

    private OrderGroup createNewOrderGroup(OrderCreate orderCreate) {
        OrderGroup orderGroupNew = new OrderGroup();
        orderGroupNew.setTimeFrame(timeFrameRepository.findById(orderCreate.getTimeFrameId())
                .orElseThrow(() -> new NoSuchElementException("No time-frame found with id " + orderCreate.getTimeFrameId())));
        orderGroupNew.setPickupPoint(pickupPointRepository.findById(orderCreate.getPickupPointId())
                .orElseThrow(() -> new NoSuchElementException("No pick-up point found with id " + orderCreate.getPickupPointId())));
        orderGroupNew.setDeliverDate(orderCreate.getDeliveryDate());
        return orderGroupNew;
    }

    private void mapDiscountsToOrder(Order order, List<UUID> discountIds) throws ResourceNotFoundException, InterruptedException {
        if (!discountIds.isEmpty()) {
            order.setDiscountList(new ArrayList<>());
            for (UUID discountId : discountIds) {
                Discount discount = discountRepository
                        .findById(discountId)
                        .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id" + discountId));
                decrementDiscountQuantity(discount);
                order.getDiscountList().add(discount);
            }
        }
    }

    private void decrementDiscountQuantity(Discount discount) {
        Integer quantity = discount.getQuantity();
        discount.setQuantity(quantity - 1);
        discountRepository.save(discount);
    }

    private String generateAndUploadQRCode(Order order) throws IOException {
        ByteArrayOutputStream qrCode = generateQRCodeImage(order.getId());
        return FirebaseStorageService.uploadQRCodeToStorage(qrCode, order.getId());
    }

    private void mapTransactionToOrder(Order order, Transaction transaction) {
        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);
        order.setTransaction(transactions);
    }

    private void saveOrderDetails(Order order, OrderCreate orderCreate) throws OutOfProductQuantityException, ResourceNotFoundException, InterruptedException {
        List<OrderDetail> orderDetailsSaved = new ArrayList<>();
        for (OrderProductCreate orderProductCreate : orderCreate.getOrderDetailList()) {
            OrderDetail orderDetail = mapOrderProductCreateToOrderDetail(order, orderProductCreate);
            orderDetailsSaved.add(orderDetailRepository.save(orderDetail));
        }
        if (!orderDetailsSaved.isEmpty() && orderDetailsSaved.size() == orderCreate.getOrderDetailList().size()) {
            log.info("Created order: %s with details saved: %s".formatted(order.getId(), orderDetailsSaved.get(0).toString()));
        }
    }

    private OrderDetail mapOrderProductCreateToOrderDetail(Order order, OrderProductCreate orderProductCreate) throws OutOfProductQuantityException, ResourceNotFoundException, InterruptedException {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        Product product = getProductById(orderProductCreate.getId());
        updateProductQuantity(product, orderProductCreate.getBoughtQuantity());
        orderDetail.setProduct(product);
        orderDetail.setProductPrice(orderProductCreate.getProductPrice());
        orderDetail.setProductOriginalPrice(orderProductCreate.getProductOriginalPrice());
        orderDetail.setBoughtQuantity(orderProductCreate.getBoughtQuantity());
        return orderDetail;
    }

    private Product getProductById(UUID productId) throws ResourceNotFoundException {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("No Product found with this id " + productId));
    }

    private void updateProductQuantity(Product product, Integer boughtQuantity) throws OutOfProductQuantityException {
        if (product.getQuantity() >= boughtQuantity) {
            product.setQuantity(product.getQuantity() - boughtQuantity);
            productRepository.save(product);
        } else {
            throw new OutOfProductQuantityException("Product don't have enough quantity");
        }
    }

    private Pageable getPageableWithSort(String totalPriceSortType, String createdTimeSortType, String deliveryDateSortType, int page, int limit) {
        Sort sortable = null;
        if (totalPriceSortType != null && totalPriceSortType.equals("ASC")) {
            sortable = Sort.by("totalPrice").ascending();
        } else if (totalPriceSortType != null && totalPriceSortType.equals("DESC")) {
            sortable = Sort.by("totalPrice").descending();
        } else if (createdTimeSortType != null && createdTimeSortType.equals("ASC")) {
            sortable = Sort.by("createdTime").ascending();
        } else if (createdTimeSortType != null && createdTimeSortType.equals("DESC")) {
            sortable = Sort.by("createdTime").descending();
        } else if (deliveryDateSortType != null && deliveryDateSortType.equals("ASC")) {
            sortable = Sort.by("deliveryDate").ascending();
        } else if (deliveryDateSortType != null && deliveryDateSortType.equals("DESC")) {
            sortable = Sort.by("deliveryDate").descending();
        }
        Pageable pageableWithSort;
        if (sortable != null) {
            pageableWithSort = PageRequest.of(page, limit, sortable);
        } else {
            pageableWithSort = PageRequest.of(page, limit);
        }

        return pageableWithSort;
    }

    private String Authorization(String jwtToken) throws FirebaseAuthException {
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);

        if (staffRepository.findByEmail(email).isPresent()) {
            return "STAFF";
        } else if (customerRepository.findByEmail(email).isPresent()) {
            return "CUSTOMER";
        } else {
            return "ACCESS DENIED";
        }
    }

    private ByteArrayOutputStream generateQRCodeImage(UUID orderId) throws IOException {
        try {
            return QRCode.from(orderId.toString())
                    .withSize(200, 200)
                    .to(ImageType.PNG)
                    .stream();
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Error generating QR code");
        }
    }

    private String extractDistrict(String address) {
        // Define a list of common district names in HCMC (you can expand this list).
        String[] districtNames = {
                "District 1",
                "District 2",
                "District 3",
                "District 4",
                "District 5",
                "District 6",
                "District 7",
                "District 8",
                "District 9",
                "District 10",
                "District 11",
                "District 12",
                "Bình Tân",
                "Bình Thạnh",
                "Gò Vấp",
                "Phú Nhuận",
                "Tân Bình",
                "Tân Phú",
                "Thủ Đức",
                "Bình Chánh",
                "Cần Giờ",
                "Củ Chi",
                "Hóc Môn",
                "Nhà Bè"
                /* Add more districts as needed */
        };

        // Create a regular expression pattern to match district names.
        String pattern = "\\b(" + String.join("|", districtNames) + ")\\b";

        // Compile the pattern.
        Pattern districtPattern = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);

        // Create a Matcher to find the district name in the address.
        Matcher matcher = districtPattern.matcher(address);

        // Find the first matching district name.
        if (matcher.find()) {
            return matcher.group(0);
        } else {
            return null;
        }
    }
}
