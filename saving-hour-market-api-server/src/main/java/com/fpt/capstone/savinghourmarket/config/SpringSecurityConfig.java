package com.fpt.capstone.savinghourmarket.config;

import com.fpt.capstone.savinghourmarket.common.StaffRole;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class SpringSecurityConfig {
    private final AccessDeniedHandlerCustom accessDeniedHandlerCustom;
    private final AuthenticationEntryPointCustom authenticationEntryPointCustom;

    private String[] allStaffAndAdmin= {StaffRole.STAFF_DLV_0.toString()
            , StaffRole.STAFF_DLV_1.toString()
            , StaffRole.STAFF_MKT.toString()
            , StaffRole.STAFF_ORD.toString()
            , StaffRole.STAFF_SLT.toString()
            , "ADMIN"};

    private String[] selectionStaffAndAdmin= {StaffRole.STAFF_SLT.toString()
            , "ADMIN"};

    private String[] marketingStaffAndAdmin= {StaffRole.STAFF_MKT.toString(), "ADMIN"};

    private String[] deliverManagerAndAdmin = {StaffRole.STAFF_DLV_1.toString(), "ADMIN"};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).cors(httpSecurityCorsConfigurer -> {
                new CorsRegistry().addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS");;
                })
                .authorizeHttpRequests((auth) -> {
                    auth.dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()
                            .requestMatchers("/swagger-ui/**").permitAll()
                            .requestMatchers("/swagger-resources/**").permitAll()
                            .requestMatchers("/v3/api-docs/**").permitAll()
                            .requestMatchers("/swagger-ui.html").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/customer/registerWithEmailPassword").permitAll()
//                            .requestMatchers("/api/customer/updateInfo").authenticated()

                            .requestMatchers("/api/product/getProductsForCustomer").permitAll()
                            .requestMatchers("/api/product/getById").permitAll()
                            .requestMatchers("/api/product/getAllCategory").permitAll()
                            .requestMatchers("/api/product/getCategoryForStaff").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getSubCategoryForStaff").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getAllSubCategory").permitAll()
                            .requestMatchers("/api/product/getProductsForStaff").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/product/getSaleReportSupermarket").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getRevenueReportForEachMonth").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getRevenueReportForEachYear").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getRevenueReportForEachProduct").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getAllSupermarketSaleReport").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getRevenueReportForEachProductForSupermarket").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/getOrderTotalAllCategorySupermarketReport").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/createCategory").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/createSubCategory").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/update").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/updateSubCategory").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/updateCategory").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/uploadExcelFile").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/create").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/create/list").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/disable").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/product/enable").hasAnyRole(selectionStaffAndAdmin)

                            .requestMatchers("/api/discount/getDiscountsForCustomer").permitAll()
                            .requestMatchers("/api/discount/getDiscountById").permitAll()
                            .requestMatchers("/api/discount/getDiscountUsageReport").hasAnyRole(marketingStaffAndAdmin)
                            .requestMatchers("/api/discount/getCategoryWithSubCategoryDiscountUsageReport").hasAnyRole(marketingStaffAndAdmin)
                            .requestMatchers("/api/discount/getDiscountsForStaff").hasAnyRole(allStaffAndAdmin)

                            .requestMatchers("/api/timeframe/getAll").permitAll()
                            .requestMatchers("/api/timeframe/getForPickupPoint").permitAll()
                            .requestMatchers("/api/timeframe/getForHomeDelivery").permitAll()
                            .requestMatchers("/api/timeframe/getAllForStaff").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/timeframe/getAllForAdmin").hasRole("ADMIN")
                            .requestMatchers("/api/timeframe/create").hasRole("ADMIN")
                            .requestMatchers("/api/timeframe/update").hasRole("ADMIN")
                            .requestMatchers("/api/timeframe/updateStatus").hasRole("ADMIN")

                            .requestMatchers("/api/pickupPoint/getAll").permitAll()
                            .requestMatchers("/api/pickupPoint/getWithSortAndSuggestion").permitAll()
                            .requestMatchers("/api/pickupPoint/getAllForStaff").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/pickupPoint/getAllForAdmin").hasRole("ADMIN")
                            .requestMatchers("/api/pickupPoint/create").hasRole("ADMIN")
                            .requestMatchers("/api/pickupPoint/updateInfo").hasRole("ADMIN")
                            .requestMatchers("/api/pickupPoint/updateStatus").hasRole("ADMIN")
                            .requestMatchers("/api/pickupPoint/updateProductConsolidationAreaList").hasRole("ADMIN")

                            .requestMatchers("/api/productConsolidationArea/create").hasRole("ADMIN")
                            .requestMatchers("/api/productConsolidationArea/updateInfo").hasRole("ADMIN")
                            .requestMatchers("/api/productConsolidationArea/updateStatus").hasRole("ADMIN")
                            .requestMatchers("/api/productConsolidationArea/updatePickupPointList").hasRole("ADMIN")
                            .requestMatchers("/api/productConsolidationArea/getAllForStaff").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/productConsolidationArea/getAllForAdmin").hasRole("ADMIN")
                            .requestMatchers("/api/productConsolidationArea/getByPickupPointForStaff").hasAnyRole(allStaffAndAdmin)


                            .requestMatchers("/api/transaction/processPaymentResult").permitAll()
                            .requestMatchers("/api/transaction/getTransactionForAdmin").hasRole("ADMIN")
                            .requestMatchers("/api/transaction/refundTransaction").hasRole("ADMIN")
//                            .requestMatchers("/api/staff/getInfoAfterGoogleLogged").hasAnyRole(allStaffAndAdmin)

                            .requestMatchers("/api/staff/getInfo").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/staff/updateInfo").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/staff/getCustomerDetailByEmail").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/staff/getStaffForDeliverManager").hasAnyRole(deliverManagerAndAdmin)
                            .requestMatchers("/api/staff/createStaffAccount").hasRole("ADMIN")
                            .requestMatchers("/api/staff/getStaffByEmail").hasRole("ADMIN")
                            .requestMatchers("/api/staff/getStaffForAdmin").hasRole("ADMIN")
                            .requestMatchers("/api/staff/updateStaffAccountStatus").hasRole("ADMIN")
                            .requestMatchers("/api/staff/updateStaffRole").hasRole("ADMIN")
                            .requestMatchers("/api/staff/assignPickupPoint").hasRole("ADMIN")
                            .requestMatchers("/api/staff/unAssignPickupPoint").hasRole("ADMIN")

                            .requestMatchers("/api/customer/getCustomerForAdmin").hasRole("ADMIN")
                            .requestMatchers("/api/customer/updateCustomerAccountStatus").hasRole("ADMIN")

                            .requestMatchers("/api/supermarket/getSupermarketForStaff").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/supermarket/create").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/supermarket/changeStatus").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/supermarket/updateInfo").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/supermarket/createSupermarketAddressForSupermarket").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/supermarket/updateSupermarketAddressForSupermarket").hasAnyRole(selectionStaffAndAdmin)
                            .requestMatchers("/api/supermarket/deleteSupermarketAddressForSupermarket").hasAnyRole(selectionStaffAndAdmin)

                            .requestMatchers("/api/order/staff/**").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/order/deliveryManager/**").hasRole(StaffRole.STAFF_DLV_1.toString())
                            .requestMatchers("/api/order/deliveryStaff/**").hasRole(StaffRole.STAFF_DLV_0.toString())
                            .requestMatchers("/api/order/packageStaff/**").hasRole(StaffRole.STAFF_ORD.toString())
                            .requestMatchers("/api/order/sendNotification").permitAll()

                            .requestMatchers("/api/feedback/updateStatus").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/feedback/getFeedbackForStaff").hasAnyRole(allStaffAndAdmin)
                            .requestMatchers("/api/feedback/reply").hasRole("ADMIN")

                            .requestMatchers("/api/configuration/getConfiguration").hasRole("ADMIN")
                            .requestMatchers("/api/configuration/updateConfiguration").hasRole("ADMIN")
                    ;
                    auth.anyRequest().authenticated();
                });
//        http.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable()).authorizeHttpRequests((auth) -> auth
//                .anyRequest().authenticated());
        http.oauth2ResourceServer((res) -> res.jwt(jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(jwtAuthenticationConverter())).accessDeniedHandler(accessDeniedHandlerCustom).authenticationEntryPoint(authenticationEntryPointCustom));
        return http.build();
    }

//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return (web -> web.ignoring().requestMatchers("/swagger-ui/index.html").requestMatchers("/swagger-ui.html"));
//    }

    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> Optional.ofNullable(jwt.getClaimAsString("user_role"))
                .stream()
                .map(s -> "ROLE_"+s.toString().toUpperCase())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList()));
        return converter;
    }

}
