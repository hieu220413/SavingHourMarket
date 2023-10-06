package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.District;
import com.fpt.capstone.savinghourmarket.common.OrderStatus;
import com.fpt.capstone.savinghourmarket.common.StaffRole;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.*;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.*;
import com.fpt.capstone.savinghourmarket.service.CustomerService;
import com.fpt.capstone.savinghourmarket.service.FirebaseService;
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
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    public List<OrderGroup> fetchOrderGroups(LocalDate deliverDate, UUID timeFrameId, UUID pickupPointId, UUID delivererId) throws NoSuchOrderException, FirebaseAuthException {
        List<OrderGroup> orderGroups = orderGroupRepository.findByTimeFrameOrPickupPointOrDeliverDate(timeFrameId, pickupPointId, delivererId, deliverDate);
        if (orderGroups.isEmpty()) {
            throw new NoSuchOrderException("No such order group left on system");
        }
        return orderGroups;
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
        List<Order> orders = repository.findOrderForCustomer(Utils.getCustomerEmail(jwtToken, firebaseAuth),
                orderStatus == null ? null : orderStatus.ordinal(),
                isPaid,
                getPageableWithSort(totalPriceSortType, createdTimeSortType, deliveryDateSortType, page, limit));
        return orders;
    }

    @Override
    public List<OrderBatch> fetchOrderBatches(District district, LocalDate deliveryDate) throws NoSuchOrderException {
        List<OrderBatch> orderBatches = orderBatchRepository.findByDistrictOrDeliverDate(district != null ? district.getDistrictName() : null, deliveryDate);
        return orderBatches;
    }

    @Override
    @Transactional
    public String assignPackager(UUID orderId, UUID staffId) throws NoSuchOrderException, IOException {
        Order order = repository.findById(orderId)
                .orElseThrow(() -> new NoSuchOrderException("No order found with this id " + orderId));
        Staff staff = staffRepository.findById(staffId).orElseThrow(() -> new NoSuchElementException("Không tìm thấy nhân viên với ID: " + staffId));
        if (staff.getRole().equalsIgnoreCase(StaffRole.STAFF_ORD.toString())) {
            order.setPackager(staff);
            order.setStatus(OrderStatus.PACKAGING.ordinal());
            FirebaseService.sendPushNotification("SHM", "Đơn hàng đang tiến hành đóng gói!", order.getCustomer().getEmail());
        } else {
            return "Nhân viên này không phải là nhân Viên ĐÓNG GÓI!";
        }
        return "Đơn hàng này đã được nhận đóng gói thành công!";
    }

    @Override
    public String assignDeliverToOrderGroupOrBatch(UUID orderGroupId, UUID orderBatchId, UUID staffId) throws NoSuchOrderException, ConflictGroupAndBatchException, IOException {
        Staff staff = staffRepository.findById(staffId).orElseThrow(() -> new NoSuchElementException("No staff found with this id " + staffId));
        if (staff.getRole().equalsIgnoreCase(StaffRole.STAFF_DLV_0.toString())) {
            if (orderGroupId != null && orderBatchId == null) {
                OrderGroup orderGroup = orderGroupRepository.findById(orderGroupId)
                        .orElseThrow(() -> new NoSuchOrderException("No group found with this group id " + orderGroupId));
                orderGroup.setDeliverer(staff);
                for (Order order : orderGroup.getOrderList()) {
                    order.setStatus(OrderStatus.DELIVERING.ordinal());
                    FirebaseService.sendPushNotification("SHM", "Đơn hàng chuẩn bị được giao!", order.getCustomer().getEmail());
                }
            } else if (orderGroupId == null && orderBatchId != null) {
                OrderBatch orderBatch = orderBatchRepository.findById(orderBatchId)
                        .orElseThrow(() -> new NoSuchOrderException("No batch found with this batch id " + orderBatchId));
                orderBatch.setDeliverer(staff);
                for (Order order : orderBatch.getOrderList()) {
                    order.setStatus(OrderStatus.DELIVERING.ordinal());
                    FirebaseService.sendPushNotification("SHM", "Đơn hàng chuẩn bị được giao!", order.getCustomer().getEmail());
                }
            } else {
                throw new ConflictGroupAndBatchException("Group or batch must be specified");
            }
        } else {
            return "Staff with id" + staffId + "is not DELIVERER LEVEL 0";
        }

        return "Staff with id" + staffId + "set successfully";
    }

    @Override
    public List<Order> fetchOrdersForStaff(String totalPriceSortType,
                                           String createdTimeSortType,
                                           String deliveryDateSortType,
                                           OrderStatus orderStatus,
                                           UUID packagerId,
                                           Boolean isPaid,
                                           Boolean isGrouped,
                                           int page,
                                           int limit) throws NoSuchOrderException, FirebaseAuthException {
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
        return orders;
    }

    @Override
    public OrderWithDetails fetchOrderDetail(UUID id) throws ResourceNotFoundException {
        log.info("Fetching order detail of order_id " + id);
        Order order = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No order with id " + id));

        OrderWithDetails orderWithDetails = new OrderWithDetails();
        orderWithDetails.setId(order.getId());
        orderWithDetails.setReceiverName(order.getReceiverName());
        orderWithDetails.setReceiverPhone(order.getReceiverPhone());
        orderWithDetails.setQrCodeUrl(order.getQrCodeUrl());
        orderWithDetails.setTotalPrice(order.getTotalPrice());
        orderWithDetails.setCreatedTime(order.getCreatedTime());
        orderWithDetails.setAddressDeliver(order.getAddressDeliver());
        orderWithDetails.setTotalDiscountPrice(order.getTotalDiscountPrice());
        orderWithDetails.setDeliveryDate(order.getDeliveryDate());
        orderWithDetails.setCustomer(order.getCustomer());
        orderWithDetails.setPaymentStatus(order.getPaymentStatus());
        orderWithDetails.setPaymentMethod(order.getPaymentMethod());
        orderWithDetails.setShippingFee(order.getShippingFee());
        orderWithDetails.setStatus(order.getStatus());
        orderWithDetails.setTransaction(order.getTransaction());

        if (order.getOrderGroup() != null) {
            orderWithDetails.setTimeFrame(order.getOrderGroup().getTimeFrame());
            orderWithDetails.setPickupPoint(order.getOrderGroup().getPickupPoint());
        }

        List<OrderDetail> orderDetails = order.getOrderDetailList();
        List<OrderProduct> orderProducts = orderDetails.stream()
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
                    orderProduct.setProductCategory(product.getProductSubCategory().getProductCategory().getName());

                    return orderProduct;

                }).toList();
        orderWithDetails.setOrderDetailList(orderProducts);
        return orderWithDetails;
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
            List<OrderDetail> orderDetails = order.getOrderDetailList();
            increaseProductQuantity(orderDetails);
            if (order.getDiscountList() != null & order.getDiscountList().size() > 0) {
                increaseDiscountQuantity(order.getDiscountList());
            }
        } else {
            throw new OrderCancellationNotAllowedException("Order with id " + id + " is already in " + order.getStatus().toString() + " process");
        }
        repository.save(order);
        return "Successfully canceled order " + id;
    }

    @Override
    public String deleteOrder(String jwtToken, UUID id) throws FirebaseAuthException, ResourceNotFoundException, OrderDeletionNotAllowedException {
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() -> new AuthorizationServiceException("Access denied with this account: " + email));
        if (customer == null) {
            return "Fail to delete order " + id;
        }
        Order order = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No order with id " + id));
        if (order.getStatus() == OrderStatus.PROCESSING.ordinal()) {
            List<OrderDetail> orderDetails = order.getOrderDetailList();
            increaseProductQuantity(orderDetails);
            if (order.getDiscountList() != null & order.getDiscountList().size() > 0) {
                increaseDiscountQuantity(order.getDiscountList());
            }

        } else {
            throw new OrderDeletionNotAllowedException("Order with id " + id + " is already in " + order.getStatus().toString() + " process");
        }
        repository.deleteById(order.getId());
        return "Successfully deleted  order " + id;
    }

    @Override
    public List<OrderBatch> batchingForStaff(LocalDate deliverDate, UUID timeFrameId, Integer batchQuantity) {
//
//
//        private static final int MIN_POINTS = 5; // Minimum number of points for a cluster
//
//
//        // Define the epsilon (ε) value in degrees for a 10 km radius
//        double epsilonInDegrees = 0.0897;
//
//        // Create a DBSCAN clusterer with the specified epsilon and distance measure
//        DBSCANClusterer<DataPoint> clusterer = new DBSCANClusterer<>(epsilonInDegrees, MIN_POINTS, new DistanceMeasure() {
//            @Override
//            public double compute(double[] a, double[] b) {
//                // Implement the Haversine distance calculation
//                double lat1 = a[0];
//                double lon1 = a[1];
//                double lat2 = b[0];
//                double lon2 = b[1];
//
//                // Convert latitude and longitude from degrees to radians
//                lat1 = Math.toRadians(lat1);
//                lon1 = Math.toRadians(lon1);
//                lat2 = Math.toRadians(lat2);
//                lon2 = Math.toRadians(lon2);
//
//                // Haversine formula
//                double dLat = lat2 - lat1;
//                double dLon = lon2 - lon1;
//
//                double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                        Math.cos(lat1) * Math.cos(lat2) *
//                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
//
//                double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//
//                // Radius of the Earth in kilometers
//                double earthRadiusKm = 6371.0;
//
//                // Calculate the distance
//                double distance = earthRadiusKm * c;
//
//                return distance;
//            }
//        });
//
//        // Perform clustering
//        List<Cluster<DataPoint>> clusters = clusterer.cluster(dataPoints);
//
//        // Process the clusters as needed
//        for (Cluster<DataPoint> cluster : clusters) {
//            List<DataPoint> clusterPoints = cluster.getPoints();
//            // Handle each cluster of data points
//        }
        return null;
    }

    @Override
    public Order createOrder(String jwtToken, OrderCreate orderCreate) throws Exception {
        log.info("Creating new order");
        String email = Utils.getCustomerEmail(jwtToken, firebaseAuth);
        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() -> new AuthorizationServiceException("Access denied with this account: " + email));

        if (repository.getOrdersProcessing(customer.getEmail()).size() < 3) {
            RLock rLock = redissonClient.getLock("createOrderLock");
            Order order = null;
            try {
                rLock.lock();
                order = createOrderTransact(orderCreate, customer);
            } finally {
                rLock.unlock();
            }
            return order;

        } else {
            throw new CustomerLimitOrderProcessingException("Bạn hiện đang có 3 đơn hàng đang chờ xác nhận!");
        }
    }

    @Transactional(rollbackFor = {ResourceNotFoundException.class, InterruptedException.class, IOException.class, OutOfProductQuantityException.class})
    Order createOrderTransact(OrderCreate orderCreate, Customer customer) throws ResourceNotFoundException, InterruptedException, IOException, OutOfProductQuantityException {
        Order order = setOrderData(orderCreate, customer);

        if (orderCreateHasPickupPointAndTimeFrame(orderCreate)) {
            groupingOrder(order, orderCreate);
        }

        Order orderSavedSuccessWithoutQrCodeUrl = repository.save(order);
        String qrCodeUrl = generateAndUploadQRCode(orderSavedSuccessWithoutQrCodeUrl);
        orderSavedSuccessWithoutQrCodeUrl.setQrCodeUrl(qrCodeUrl);

        Order orderSavedSuccess = repository.save(orderSavedSuccessWithoutQrCodeUrl);

        saveOrderDetails(orderSavedSuccess, orderCreate);

        return orderSavedSuccess;
    }


    private Order setOrderData(OrderCreate orderCreate, Customer customer) throws ResourceNotFoundException, InterruptedException {
        Order order = new Order();
        order.setCustomer(customer);
        order.setReceiverName(orderCreate.getReceiverName());
        order.setReceiverPhone(orderCreate.getReceiverPhone());
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
        return FirebaseService.uploadQRCodeToStorage(qrCode, order.getId());
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
        decreaseProductQuantity(product, orderProductCreate.getBoughtQuantity(), order);
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

    private void decreaseProductQuantity(Product product, Integer boughtQuantity, Order order) throws OutOfProductQuantityException {
        if (product.getQuantity() >= boughtQuantity) {
            product.setQuantity(product.getQuantity() - boughtQuantity);
            productRepository.save(product);
        } else {
            repository.delete(order);
            throw new OutOfProductQuantityException(product.getName() + " chỉ còn " + product.getQuantity() + " sản phẩm!");
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


    private void increaseProductQuantity(List<OrderDetail> orderDetails) {
        for (OrderDetail orderDetail : orderDetails) {
            Product product = orderDetail.getProduct();
            product.setQuantity(product.getQuantity() + orderDetail.getBoughtQuantity());
            productRepository.save(product);
        }
    }

    private void increaseDiscountQuantity(List<Discount> discounts) {
        for (Discount discount : discounts) {
            discount.setQuantity(discount.getQuantity() + 1);
            discountRepository.save(discount);
        }
    }
}
