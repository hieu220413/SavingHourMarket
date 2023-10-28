package com.fpt.capstone.savinghourmarket.config;

import com.fpt.capstone.savinghourmarket.common.PaymentStatus;
import com.fpt.capstone.savinghourmarket.entity.Order;
import com.fpt.capstone.savinghourmarket.repository.OrderRepository;
import com.fpt.capstone.savinghourmarket.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.redisson.Redisson;
import org.redisson.api.RMapCache;
import org.redisson.api.RedissonClient;
import org.redisson.api.map.event.EntryEvent;
import org.redisson.api.map.event.EntryExpiredListener;
import org.redisson.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.Optional;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class RedissonConfig {

    @Value("${REDIS_HOST}")
    private String redisHost;

    @Value("${REDIS_PORT}")
    private int redisPort;

    @Lazy
    @Autowired
    private OrderService orderService;

    private final OrderRepository orderRepository;

    private Logger logger = LoggerFactory.getLogger(RedissonConfig.class);

    @Bean
    RedissonClient redisson() {
        Config config = new Config();
        config.useSingleServer()
                // use "rediss://" for SSL connection
                .setAddress("redis://" + redisHost + ":" + redisPort);
        // Sync and Async API
        RedissonClient redissonClient = Redisson.create(config);
        RMapCache<String, Integer> map = redissonClient.getMapCache("orderCreatedMap");
        int expireListener = map.addListener(new EntryExpiredListener<UUID, Integer>() {
            @Override
            public void onExpired(EntryEvent<UUID, Integer> event) {
                logger.info("Start deleting expired order");
                UUID orderId = event.getKey(); // key
                try {
                    Optional<Order> order = orderRepository.findById(orderId);
                    if (order.isPresent() && order.get().getPaymentStatus() == PaymentStatus.UNPAID.ordinal()){
                        orderService.deleteOrderWithoutAuthen(orderId);
                    } else{
                        logger.info("order is paid or order not exist");
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                logger.info("End deleting expired order");
            }
        });

        return redissonClient;
    }
}
