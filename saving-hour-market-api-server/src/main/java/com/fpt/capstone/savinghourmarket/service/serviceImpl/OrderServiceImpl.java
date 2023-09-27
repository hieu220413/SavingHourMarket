package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.NoSuchOrderException;
import com.fpt.capstone.savinghourmarket.exception.OrderCancellationNotAllowedException;
import com.fpt.capstone.savinghourmarket.exception.OutOfProductQuantityException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.OrderCreate;
import com.fpt.capstone.savinghourmarket.model.OrderProduct;
import com.fpt.capstone.savinghourmarket.repository.*;
import com.fpt.capstone.savinghourmarket.service.FirebaseStorageService;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import com.fpt.capstone.savinghourmarket.util.Utils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final FirebaseAuth firebaseAuth;

    @Autowired
    private OrderRepository repository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderGroupRepository orderGroupRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public List<Order> fetchAllNotInGroup() throws NoSuchOrderException {
        log.info("Fetching all orders not in group");
        List<Order> orderList = repository.findOrderByOrderGroupIsNull();
        if (orderList.isEmpty()) {
            throw new NoSuchOrderException("No order left on the system");
        }
        return orderList;
    }

    @Override
    public List<OrderGroup> fetchAllWithGroup() throws NoSuchOrderException {
        List<OrderGroup> orderGroups = orderGroupRepository.findAll();
        if (orderGroups.isEmpty()) {
            throw new NoSuchOrderException("No such order group left on system");
        }
        return orderGroups;
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
                                           int limit) throws NoSuchOrderException, FirebaseAuthException, ResourceNotFoundException {
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        Staff staff = staffRepository.findByEmail(email).orElseThrow(() -> new AuthorizationServiceException("Access denied with this account: " + email));
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



        List<Order> orders = repository.findOrderForStaff(packagerId,
                orderStatus == null ? null: orderStatus.ordinal(),
                isGrouped,
                isPaid,
                pageableWithSort);
        if (orders.size() == 0) {
            throw new NoSuchOrderException("No orders found");
        }
        return orders;
    }

    @Override
    public List<Order> fetchByStatus(Integer status) throws NoSuchOrderException {
        log.info("Fetching orders with status" + status);
        List<Order> orders = repository.findOrderByStatus(status);
        if (orders.isEmpty()) {
            throw new NoSuchOrderException("No such order with status" + status);
        }
        return orders;
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
    public List<Order> fetchAll() throws NoSuchOrderException {
        log.info("Fetching all");
        List<Order> orders = repository.findAll();
        if (orders.isEmpty()) {
            throw new NoSuchOrderException("No order left");
        }
        return orders;
    }

    @Override
    public List<Order> fetchCustomerOrders(String jwtToken, Integer status) throws ResourceNotFoundException, NoSuchOrderException, FirebaseAuthException {
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        log.info("Fetching customer order with email " + email + " by status " + status);
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("There is no customer with email " + email));
        List<Order> orders = repository.findOrderByCustomerAndStatus(customer, status);
        if (orders.isEmpty()) {
            throw new NoSuchOrderException("No order left for this customer");
        }
        return orders;
    }


    @Override
    @Transactional
    public String createOrder(String jwtToken, OrderCreate orderCreate) throws ResourceNotFoundException, IOException, FirebaseAuthException, OutOfProductQuantityException {
        log.info("Creating new order");

        //Mapping orderCreate model to order entity
        Order order = new Order();
        order.setShippingFee(orderCreate.getShippingFee());
        order.setTotalPrice(orderCreate.getTotalPrice());
        order.setDeliveryDate(orderCreate.getDeliveryDate());
        order.setStatus(OrderStatus.PROCESSING.ordinal());
        order.setPayment_method(orderCreate.getPayment_method());
        order.setAddressDeliver(orderCreate.getAddressDeliver());

        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email" + email));
        order.setCustomer(customer);

        UUID discountId = orderCreate.getDiscountId();
        if (discountId != null && !discountId.equals("")) {
            Discount discount = discountRepository
                    .findById(orderCreate.getDiscountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id" + orderCreate.getDiscountId()));
            Integer quantity = discount.getQuantity();
            discount.setQuantity(quantity - 1);
            discountRepository.save(discount);
//            order.setDiscount(discount);
        }

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(orderCreate.getTransaction());
        order.setTransaction(transactions);

        if (orderCreate.getPickupPointId() != null && !orderCreate.getPickupPointId().equals("")) {
            OrderGroup orderGroup = orderGroupRepository
                    .findByTimeFrameIdAndPickupPointId(orderCreate.getTimeFrameId(), orderCreate.getPickupPointId())
                    .orElseThrow(() -> new ResourceNotFoundException("OrderGroup not found with this time_frame_id " + orderCreate.getTimeFrameId() + " and pickup_point_id " + orderCreate.getPickupPointId()));
            order.setOrderGroup(orderGroup);
        }

        Order orderSavedSuccessWithoutQrcodeUrl = repository.save(order);

        //Generate QR Code of order then save it to Firebase Storage
        ByteArrayOutputStream QrCode = generateQRCodeImage(orderSavedSuccessWithoutQrcodeUrl.getId());
        String qrCodeUrl = FirebaseStorageService.uploadQRCodeToStorage(QrCode, order.getId());
        orderSavedSuccessWithoutQrcodeUrl.setQrCodeUrl(qrCodeUrl);

        Order orderSavedSuccess = repository.save(orderSavedSuccessWithoutQrcodeUrl);

        //Save order's details including list of order's products
        List<OrderDetail> orderDetailsSaved = new ArrayList<>();
        List<OrderProduct> orderProducts = orderCreate.getOrderDetailList();
        for (OrderProduct orderProduct : orderProducts) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(orderSavedSuccess);
            Product product = productRepository.findById(orderProduct.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("No Product found with this id " + orderProduct.getId()));
            if (product.getQuantity() > orderProduct.getBoughtQuantity()) {
                product.setQuantity(product.getQuantity() - orderProduct.getBoughtQuantity());
                productRepository.save(product);
            } else {
                throw new OutOfProductQuantityException("Product don't have enough quantity");
            }
            orderDetail.setProduct(product);
            orderDetail.setProductPrice(orderProduct.getProductPrice());
            orderDetail.setProductOriginalPrice(orderProduct.getProductOriginalPrice());
            orderDetail.setBoughtQuantity(orderProduct.getBoughtQuantity());

            orderDetailsSaved.add(orderDetailRepository.save(orderDetail));
        }

        if (!orderDetailsSaved.isEmpty() && orderDetailsSaved.size() == orderProducts.size()) {
            log.info("Created order: %s with details saved: %s".formatted(orderSavedSuccess.getId(), orderDetailsSaved.get(0).toString()));
        }

        return orderSavedSuccess.getQrCodeUrl();
    }

    @Override
    public String cancelOrder(UUID id) throws ResourceNotFoundException, OrderCancellationNotAllowedException {
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
}
