package com.fpt.capstone.savinghourmarket.repository;

import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.entity.PickupPoint;
import com.fpt.capstone.savinghourmarket.entity.Staff;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((:packageId IS NULL) OR (o.packager.id = :packageId)) " +
            "AND " +
            "((:deliveryDate IS NULL) OR (o.deliveryDate = :deliveryDate)) " +
            "AND " +
            "(((:deliverId IS NULL) AND ((o.status < 3) OR (o.deliverer IN :staffManaged))) OR (o.deliverer.id = :deliverId)) " +
            "AND " +
            "((:status IS NULL) OR (o.status = :status)) " +
            "AND " +
            "(((:isGrouped IS NULL) " +
            "OR " +
            "((:isGrouped = FALSE) AND (o.orderGroup IS NULL)) " +
            "OR " +
            "((:isGrouped = TRUE) AND (o.orderGroup IS NOT NULL)))) " +
            "AND " +
            "(((:getOldOrder IS NULL) " +
            "OR " +
            "((:getOldOrder = FALSE) AND (o.deliveryDate >= CURRENT_DATE)) " +
            "OR " +
            "((:getOldOrder = TRUE)))) " +
            "AND " +
            "(((:isBatched IS NULL) " +
            "OR " +
            "((:isBatched = FALSE) AND (o.orderBatch IS NULL)) " +
            "OR " +
            "((:isBatched = TRUE) AND (o.orderBatch IS NOT NULL)))) " +
            "AND " +
            "((o.paymentMethod = 0) OR ((o.paymentMethod = 1) AND (o.paymentStatus = 1))) " +
            "AND " +
            "((:timeFrameId IS NULL) OR (o.timeFrame.id = :timeFrameId)) " +
            "AND " +
            "(((:isPaid IS NULL) OR (:isPaid = FALSE)) " +
            "OR " +
            "((:isPaid = TRUE) AND (SIZE(o.transaction) > 0)))"
    )
    List<Order> findOrderForStaff(List<Staff> staffManaged,
                                  Boolean getOldOrder,
                                  Date deliveryDate,
                                  UUID packageId,
                                  UUID deliverId,
                                  UUID timeFrameId,
                                  Integer status,
                                  Boolean isGrouped,
                                  Boolean isBatched,
                                  Boolean isPaid,
                                  Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((:deliveryDate IS NULL) OR (o.deliveryDate = :deliveryDate)) " +
            "AND " +
            "(((:pickupPointId IS NULL) AND (o.pickupPoint IN :pickupPointList)) OR (o.pickupPoint.id = :pickupPointId)) " +
            "AND " +
            "((:status IS NULL) OR (o.status = :status)) " +
            "AND " +
            "((o.status = 0) OR ((o.status > 0) AND ((:packager IS NULL) OR (o.packager.id = :packager)))) " +
            "AND " +
            "((:timeFrameId IS NULL) OR (o.timeFrame.id = :timeFrameId)) " +
            "AND " +
            "((:deliveryMethod IS NULL) OR (o.deliveryMethod = :deliveryMethod)) " +
            "AND " +
            "(((:getOldOrder IS NULL) " +
            "OR " +
            "((:getOldOrder = FALSE) AND (o.deliveryDate >= CURRENT_DATE)) " +
            "OR " +
            "((:getOldOrder = TRUE)))) " +
            "AND " +
            "((o.paymentMethod = 0) OR ((o.paymentMethod = 1) AND (o.paymentStatus = 1))) " +
            "AND " +
            "(((:isPaid IS NULL) OR (:isPaid = FALSE)) " +
            "OR " +
            "((:isPaid = TRUE) AND (o.paymentStatus = 1)))"
    )
    List<Order> findOrderForPackageStaff(UUID packager,
                                         UUID pickupPointId,
                                         UUID timeFrameId,
                                         Date deliveryDate,
                                         Boolean getOldOrder,
                                         List<PickupPoint> pickupPointList,
                                         Integer status,
                                         Integer deliveryMethod,
                                         Boolean isPaid,
                                         Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "WHERE " +
            "((o.customer.email = :customerEmail)) " +
            "AND " +
            "((:status IS NULL) OR (o.status = :status)) " +
            "AND " +
            "(((:isPaid IS NULL) " +
            "OR " +
            "((:isPaid = FALSE) AND (o.paymentMethod = 1) AND (o.paymentStatus = 0))) " +
            "OR " +
            "((:isPaid = TRUE) AND (o.paymentMethod = 1) AND (o.paymentStatus = 1)))"
    )
    List<Order> findOrderForCustomer(String customerEmail,
                                     Integer status,
                                     Boolean isPaid,
                                     Pageable pageable);

    @Query("SELECT o FROM Order o " +
            "WHERE o.status = 0 " +
            "AND o.customer.email = :customerEmail")
    List<Order> getOrdersProcessing(String customerEmail);

    @Query("SELECT o FROM Order o " +
            "JOIN o.customer cs " +
            "WHERE cs.id = :customerId " +
            "AND o.status IN :statusList")
    List<Order> findCustomerProcessingOrderById(UUID customerId, Pageable pageable, List<Integer> statusList);


    @Query("SELECT o FROM Order o " +
            "JOIN o.packager pk " +
            "WHERE pk.id = :staffId " +
            "AND o.status IN :statusList")
    List<Order> findStaffProcessingOrderById(UUID staffId, Pageable pageable, List<Integer> statusList);

    @Query("SELECT o FROM Order o " +
            "JOIN o.packager pk " +
            "JOIN o.pickupPoint pp " +
            "WHERE pk.id = :staffId " +
            "AND pp.id = :pickupPointId " +
            "AND o.status IN :statusList")
    List<Order> findStaffProcessingOrderInPickupPointById(UUID staffId, UUID pickupPointId, Pageable pageable, List<Integer> statusList);

    @Query("SELECT o FROM Order o " +
            "JOIN o.timeFrame tf " +
            "WHERE tf.id = :timeFrameId " +
            "AND o.status IN :statusList")
    List<Order> findTimeFrameInProcessingOrderById(UUID timeFrameId, Pageable pageable, List<Integer> statusList);

    @Query("SELECT o FROM Order o " +
            "JOIN o.productConsolidationArea pca " +
            "WHERE pca.id = :productConsolidationAreaId " +
            "AND o.status IN :statusList")
    List<Order> findProductConsolidationAreaInProcessingOrderById(UUID productConsolidationAreaId, Pageable pageable, List<Integer> statusList);

    @Query("SELECT o FROM Order o " +
            "JOIN o.pickupPoint p " +
            "WHERE p.id = :pickupPointId " +
            "AND o.status IN :statusList")
    List<Order> findPickupPointInProcessingOrderById(UUID pickupPointId, Pageable pageable, List<Integer> statusList);

    @Query("SELECT DATE(o.createdTime) AS date, " +
            "SUM(CASE WHEN o.status = 0 THEN 1 ELSE 0 END) AS processingCount, " +
            "SUM(CASE WHEN o.status = 1 THEN 1 ELSE 0 END) AS packagingCount, " +
            "SUM(CASE WHEN o.status = 2 THEN 1 ELSE 0 END) AS packagedCount, " +
            "SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END) AS deliveringCount, " +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount, " +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 6 THEN 1 ELSE 0 END) AS cancelCount " +
            "FROM Order o " +
            "WHERE ((:startDate IS NULL) OR (o.createdTime >= :startDate)) " +
            "AND ((:endDate IS NULL) OR (o.createdTime <= :endDate)) " +
            "AND ((:month IS NULL) OR (MONTH(o.createdTime) = :month )) " +
            "AND ((:year IS NULL) OR (YEAR(o.createdTime) = :year )) " +
            "GROUP BY DATE(o.createdTime)")
    List<Object[]> getOrdersReportByDay(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Integer month,
            Integer year
    );

    @Query("SELECT YEAR(o.createdTime) AS year, " +
            "MONTH(o.createdTime) AS month, " +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount, " +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 6 THEN 1 ELSE 0 END) AS cancelCount " +
            "FROM Order o " +
            "WHERE ((:month IS NULL) OR (MONTH(o.createdTime) = :month ))" +
            "AND ((:year IS NULL) OR (YEAR(o.createdTime) = :year )) " +
            "GROUP BY YEAR(o.createdTime), MONTH(o.createdTime)")
    List<Object[]> getOrdersReportByMonth(Integer month, Integer year);

    @Query("SELECT YEAR(o.createdTime) AS year, " +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount, " +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 6 THEN 1 ELSE 0 END) AS cancelCount " +
            "FROM Order o " +
            "WHERE ((:year IS NULL) OR (YEAR(o.createdTime) = :year))" +
            "GROUP BY YEAR(o.createdTime)")
    List<Object[]> getOrdersReportByYear(Integer year);

    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN FETCH o.timeFrame tf " +
            "JOIN FETCH o.productConsolidationArea pca " +
            "LEFT JOIN FETCH o.deliverer dlv " +
            "LEFT JOIN FETCH o.orderBatch obt " +
            "WHERE " +
            "(o.status = 2)" +
            "AND " +
            "(obt IS NULL) " +
            "AND " +
            "(o.orderGroup IS NULL) " +
            "AND " +
            "(tf.id = :timeframeId) " +
            "AND " +
            "(pca.id = :productConsolidationAreaId) " +
            "AND " +
            "(o.deliveryMethod = 1)" +
            "AND " +
            "(dlv IS NULL) " +
            "AND " +
            "(o.deliveryDate = :deliverDate) ")
    List<Order> findOrderWithoutGroups(UUID timeframeId, Date deliverDate, UUID productConsolidationAreaId);

    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN FETCH o.timeFrame tf " +
            "LEFT JOIN FETCH o.deliverer dlv " +
            "LEFT JOIN FETCH o.orderBatch obt " +
            "WHERE " +
            "(o.status = 2)" +
            "AND " +
            "(obt IS NULL) " +
            "AND " +
            "(o.orderGroup IS NULL) " +
            "AND " +
            "(tf.id = :timeframeId) " +
            "AND " +
            "(o.deliveryMethod = 1)" +
            "AND " +
            "(dlv IS NULL) " +
            "AND " +
            "(o.deliveryDate = :deliverDate) " +
            "AND " +
            "o.id IN :orderIdList")
    List<Order> findOrderByIdListWithDeliveredStatus(List<UUID> orderIdList, UUID timeframeId, Date deliverDate);

    @Query("SELECT o FROM Order o " +
            "JOIN o.orderDetailList od " +
            "JOIN od.orderDetailProductBatches pb " +
            "WHERE pb.productBatch.id = :productBatchId ")
    List<Order> findOrderByProductBatchId(UUID productBatchId, Pageable pageable);


    @Query("SELECT o.deliveryDate as deliverDate," +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount," +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 2 THEN 1 ELSE 0 END) AS packagedCount, " +
            "SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END) AS deliveringCount " +
            "FROM Order o " +
            "WHERE o.deliveryDate = :reportDate " +
            "GROUP BY o.deliveryDate")
    List<Object[]> getDailyReportOrderForManager(LocalDate reportDate);

    @Query("SELECT o.deliverer.id as delivererId," +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount," +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END) AS deliveringCount," +
            "COUNT(o.deliverer.id) AS assignedCount " +
            "FROM Order o " +
            "WHERE o.deliveryDate = :reportDate " +
            "AND " +
            "o.deliverer.id = :deliverId " +
            "GROUP BY o.deliverer.id")
    List<Object[]> getDailyReportOrderDeliverStaff(UUID deliverId, LocalDate reportDate);

    @Query("SELECT " +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount," +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 2 THEN 1 ELSE 0 END) AS packagedCount, " +
            "SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END) AS deliveringCount " +
            "FROM Order o " +
            "WHERE " +
            "((:monthInNumber IS NULL) OR (MONTH(o.createdTime) = :monthInNumber ))" +
            "AND " +
            "((:year IS NULL) OR (YEAR(o.createdTime) = :year )) ")
    List<Object[]> getReportOrderForManager(Integer year, Integer monthInNumber);

    @Query("SELECT o.deliverer.id as delivererId," +
            "SUM(CASE WHEN o.status = 4 THEN 1 ELSE 0 END) AS successCount," +
            "SUM(CASE WHEN o.status = 5 THEN 1 ELSE 0 END) AS failCount, " +
            "SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END) AS deliveringCount," +
            "COUNT(o.deliverer.id) AS assignedCount " +
            "FROM Order o " +
            "WHERE " +
            "((:monthInNumber IS NULL) OR (MONTH(o.createdTime) = :monthInNumber ))" +
            "AND " +
            "((:year IS NULL) OR (YEAR(o.createdTime) = :year )) " +
            "AND " +
            "o.deliverer.id = :deliverId " +
            "GROUP BY o.deliverer.id")
    List<Object[]> getReportOrderDeliverStaff(UUID deliverId, Integer year, Integer monthInNumber);

    @Query("SELECT ord FROM Order ord " +
            "WHERE " +
            "ord.deliveryDate < CURRENT_DATE " +
            "AND ord.status IN :statusList")
    List<Order> findOrderExceedDeliverDateList(List<Integer> statusList);

    @Query("SELECT ord FROM Order ord " +
            "WHERE DATE(ord.createdTime) = :createdDate")
    List<Order> findByCreateDate(LocalDate createdDate);
}
