package com.fpt.capstone.savinghourmarket.config;

import com.fpt.capstone.savinghourmarket.common.StaffRole;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class SpringSecurityConfig {
    private final AccessDeniedHandlerCustom accessDeniedHandlerCustom;
    private final AuthenticationEntryPointCustom authenticationEntryPointCustom;

    private String[] allStaffAndAdmin= {StaffRole.STAFF_DLV.toString()
            , StaffRole.STAFF_MKT.toString()
            , StaffRole.STAFF_ORD.toString()
            , StaffRole.STAFF_SLT.toString()};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable())
                .authorizeHttpRequests((auth) -> {
                    auth.dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-resources/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/customer/registerWithEmailPassword").permitAll()
                        .requestMatchers("/api/product/getProductsForCustomer").permitAll()
                        .requestMatchers("/api/product/getProductsForStaff").hasAnyRole(allStaffAndAdmin);
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
