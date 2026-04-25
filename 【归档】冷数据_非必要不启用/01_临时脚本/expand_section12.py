import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

content = '''
---

## 第十部分 Spring Cloud 微服务架构核心代码

## 10.1 服务注册与发现

```java
package com.andiantong.ims.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.factory.rewrite.ModifyResponseBodyGatewayFilterFactory;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/user/**")
                        .filters(f -> f
                                .stripPrefix(1)
                                .addRequestHeader("X-Gateway", "andiantong")
                                .addResponseHeader("X-Response-Time", String.valueOf(System.currentTimeMillis())))
                        .uri("lb://user-service"))
                .route("order-service", r -> r.path("/api/order/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://order-service"))
                .route("electrician-service", r -> r.path("/api/electrician/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://electrician-service"))
                .route("payment-service", r -> r.path("/api/payment/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://payment-service"))
                .route("notification-service", r -> r.path("/api/notification/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://notification-service"))
                .route("file-service", r -> r.path("/api/file/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://file-service"))
                .build();
    }

    @Bean
    @Order(-1)
    public GlobalFilter globalFilter() {
        return new GlobalFilter() {
            @Override
            public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
                String path = exchange.getRequest().getURI().getPath();
                if (path.startsWith("/api/auth/") || path.startsWith("/api/common/")) {
                    return chain.filter(exchange);
                }
                String token = exchange.getRequest().getHeaders().getFirst("Authorization");
                if (token == null || !token.startsWith("Bearer ")) {
                    ServerHttpResponse response = exchange.getResponse();
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return response.setComplete();
                }
                return chain.filter(exchange);
            }
        };
    }

    @Bean
    public RateLimitGatewayFilterFactory rateLimitGatewayFilterFactory() {
        return new RateLimitGatewayFilterFactory();
    }

    public static class RateLimitGatewayFilterFactory extends AbstractGatewayFilterFactory<RateLimitGatewayFilterFactory.Config> {

        public RateLimitGatewayFilterFactory() {
            super(Config.class);
        }

        @Override
        public GatewayFilter apply(Config config) {
            return (exchange, chain) -> {
                String key = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
                return chain.filter(exchange);
            };
        }

        public static class Config {
            private int maxRequests = 100;
            private int windowMs = 1000;

            public int getMaxRequests() {
                return maxRequests;
            }

            public void setMaxRequests(int maxRequests) {
                this.maxRequests = maxRequests;
            }

            public int getWindowMs() {
                return windowMs;
            }

            public void setWindowMs(int windowMs) {
                this.windowMs = windowMs;
            }
        }
    }
}

package com.andiantong.ims.common.core.interceptor;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String token = request.getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String tokenValue = token.substring(7);
        if (!validateToken(tokenValue)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String userId = getUserIdFromToken(tokenValue);
        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Id", userId)
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth/") ||
                path.startsWith("/api/common/") ||
                path.startsWith("/api/public/") ||
                path.endsWith("/health") ||
                path.endsWith("/actuator/info");
    }

    private boolean validateToken(String token) {
        return token != null && token.length() > 0;
    }

    private String getUserIdFromToken(String token) {
        return "1";
    }

    @Override
    public int getOrder() {
        return -100;
    }
}

package com.andiantong.ims.common.core.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class RequestLogFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();
        String ip = getClientIp(exchange);

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long duration = System.currentTimeMillis() - startTime;
            int status = exchange.getResponse().getStatusCode().value();
            System.out.println(String.format("[%s] %s %s - %dms - %d",
                    ip, method, path, duration, status));
        }));
    }

    private String getClientIp(ServerWebExchange exchange) {
        String xForwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
    }

    @Override
    public int getOrder() {
        return -200;
    }
}
```

## 10.2 服务间调用与负载均衡

```java
package com.andiantong.ims.common.core.feign;

import feign.Logger;
import feign.Request;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import feign.Response;
import feign.codec.Decoder;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Request.Options feignOptions() {
        return new Request.Options(5000, TimeUnit.MILLISECONDS, 10000, TimeUnit.MILLISECONDS, true);
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                template.header("X-Request-Id", java.util.UUID.randomUUID().toString());
                template.header("X-Request-Time", String.valueOf(System.currentTimeMillis()));
            }
        };
    }

    @Bean
    public Decoder feignDecoder() {
        return new Decoder() {
            @Override
            public Object decode(Response response, java.lang.reflect.Type type) throws IOException {
                if (response.status() == 200) {
                    return new feign.gson.GsonDecoder().decode(response, type);
                } else if (response.status() == 401) {
                    throw new feign.FeignException.Unauthorized(response.status(), "Unauthorized",
                            response.request(), response.body().asInputStream());
                } else if (response.status() == 403) {
                    throw new feign.FeignException.Forbidden(response.status(), "Forbidden",
                            response.request(), response.body().asInputStream());
                } else if (response.status() == 404) {
                    throw new feign.FeignException.NotFound(response.status(), "Not Found",
                            response.request(), response.body().asInputStream());
                } else if (response.status() >= 500) {
                    throw new feign.FeignException.ServerError(response.status(), "Server Error",
                            response.request(), response.body().asInputStream());
                }
                return new feign.gson.GsonDecoder().decode(response, type);
            }
        };
    }

    @Bean
    public ErrorDecoder errorDecoder() {
        return new ErrorDecoder() {
            @Override
            public Exception decode(String methodKey, Response response) {
                if (response.status() >= 500) {
                    return new RuntimeException("服务调用失败: " + response.status());
                } else if (response.status() == 401) {
                    return new feign.FeignException.Unauthorized(response.status(), "未授权",
                            response.request(), null);
                } else if (response.status() == 404) {
                    return new feign.FeignException.NotFound(response.status(), "资源不存在",
                            response.request(), null);
                }
                return feign.FeignException.errorStatus(methodKey, response);
            }
        };
    }
}

@FeignClient(name = "user-service", contextId = "userFeignClient", path = "/user",
        configuration = FeignConfig.class, fallback = UserFeignClientFallback.class)
public interface UserFeignClient {

    @GetMapping("/{id}")
    Result<UserVO> getById(@PathVariable("id") Long id);

    @GetMapping("/info")
    Result<UserVO> getUserInfo(@RequestHeader("X-User-Id") String userId);

    @PostMapping
    Result<Long> create(@RequestBody UserCreateDTO dto);

    @PutMapping("/{id}")
    Result<Void> update(@PathVariable("id") Long id, @RequestBody UserUpdateDTO dto);

    @DeleteMapping("/{id}")
    Result<Void> delete(@PathVariable("id") Long id);

    @GetMapping("/list")
    Result<PageVO<UserVO>> list(@RequestParam UserQueryDTO query);

    @PostMapping("/password/reset")
    Result<Void> resetPassword(@RequestBody PasswordResetDTO dto);
}

@Component
public class UserFeignClientFallback implements UserFeignClient {

    @Override
    public Result<UserVO> getById(Long id) {
        return Result.fail("用户服务不可用");
    }

    @Override
    public Result<UserVO> getUserInfo(String userId) {
        return Result.fail("用户服务不可用");
    }

    @Override
    public Result<Long> create(UserCreateDTO dto) {
        return Result.fail("用户服务不可用");
    }

    @Override
    public Result<Void> update(Long id, UserUpdateDTO dto) {
        return Result.fail("用户服务不可用");
    }

    @Override
    public Result<Void> delete(Long id) {
        return Result.fail("用户服务不可用");
    }

    @Override
    public Result<PageVO<UserVO>> list(UserQueryDTO query) {
        return Result.fail("用户服务不可用");
    }

    @Override
    public Result<Void> resetPassword(PasswordResetDTO dto) {
        return Result.fail("用户服务不可用");
    }
}

@FeignClient(name = "order-service", contextId = "orderFeignClient", path = "/order",
        configuration = FeignConfig.class, fallback = OrderFeignClientFallback.class)
public interface OrderFeignClient {

    @GetMapping("/{id}")
    Result<OrderDetailVO> getById(@PathVariable("id") Long id);

    @GetMapping("/no/{orderNo}")
    Result<OrderDetailVO> getByOrderNo(@PathVariable("orderNo") String orderNo);

    @PostMapping
    Result<Long> create(@RequestBody OrderCreateDTO dto);

    @PutMapping("/{id}/status")
    Result<Void> updateStatus(@PathVariable("id") Long id, @RequestParam Integer status);

    @PostMapping("/{id}/cancel")
    Result<Void> cancel(@PathVariable("id") Long id, @RequestParam String reason);

    @PostMapping("/{id}/pay")
    Result<Void> pay(@PathVariable("id") Long id, @RequestParam Integer payType);

    @GetMapping("/user/{userId}")
    Result<PageVO<OrderVO>> listByUser(@PathVariable("userId") Long userId, @RequestParam Integer status);
}

@Component
public class OrderFeignClientFallback implements OrderFeignClient {

    @Override
    public Result<OrderDetailVO> getById(Long id) {
        return Result.fail("订单服务不可用");
    }

    @Override
    public Result<OrderDetailVO> getByOrderNo(String orderNo) {
        return Result.fail("订单服务不可用");
    }

    @Override
    public Result<Long> create(OrderCreateDTO dto) {
        return Result.fail("订单服务不可用");
    }

    @Override
    public Result<Void> updateStatus(Long id, Integer status) {
        return Result.fail("订单服务不可用");
    }

    @Override
    public Result<Void> cancel(Long id, String reason) {
        return Result.fail("订单服务不可用");
    }

    @Override
    public Result<Void> pay(Long id, Integer payType) {
        return Result.fail("订单服务不可用");
    }

    @Override
    public Result<PageVO<OrderVO>> listByUser(Long userId, Integer status) {
        return Result.fail("订单服务不可用");
    }
}
```

## 10.3 服务熔断与降级

```java
package com.andiantong.ims.common.core.sentinel;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.alibaba.csp.sentinel.slots.degrade.DegradeRule;
import com.alibaba.csp.sentinel.slots.degrade.DegradeRuleManager;
import com.alibaba.csp.sentinel.slots.flow.FlowRule;
import com.alibaba.csp.sentinel.slots.flow.FlowRuleManager;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class SentinelConfig {

    @PostConstruct
    public void initRules() {
        initFlowRules();
        initDegradeRules();
    }

    private void initFlowRules() {
        List<FlowRule> rules = new ArrayList<>();

        FlowRule userRule = new FlowRule();
        userRule.setResource("user-service");
        userRule.setGrade(com.alibaba.csp.sentinel.slots.block.flow.FlowGrade.QPS);
        userRule.setCount(100);
        userRule.setControlBehavior(com.alibaba.csp.sentinel.slots.block.flow.FlowControlBehavior.REJECT);
        rules.add(userRule);

        FlowRule orderRule = new FlowRule();
        orderRule.setResource("order-service");
        orderRule.setGrade(com.alibaba.csp.sentinel.slots.block.flow.FlowGrade.QPS);
        orderRule.setCount(200);
        orderRule.setControlBehavior(com.alibaba.csp.sentinel.slots.block.flow.FlowControlBehavior.REJECT);
        rules.add(orderRule);

        FlowRule paymentRule = new FlowRule();
        paymentRule.setResource("payment-service");
        paymentRule.setGrade(com.alibaba.csp.sentinel.slots.block.flow.FlowGrade.QPS);
        paymentRule.setCount(50);
        paymentRule.setControlBehavior(com.alibaba.csp.sentinel.slots.block.flow.FlowControlBehavior.REJECT);
        rules.add(paymentRule);

        FlowRuleManager.loadRules(rules);
    }

    private void initDegradeRules() {
        List<DegradeRule> rules = new ArrayList<>();

        DegradeRule userDegradeRule = new DegradeRule();
        userDegradeRule.setResource("user-service");
        userDegradeRule.setGrade(com.alibaba.csp.sentinel.slots.block.degrade.DegradeGrade.EXCEPTION_RATIO);
        userDegradeRule.setCount(0.5);
        userDegradeRule.setTimeWindow(10);
        userDegradeRule.setMinRequestAmount(5);
        rules.add(userDegradeRule);

        DegradeRule orderDegradeRule = new DegradeRule();
        orderDegradeRule.setResource("order-service");
        orderDegradeRule.setGrade(com.alibaba.csp.sentinel.slots.block.degrade.DegradeGrade.EXCEPTION_RATIO);
        orderDegradeRule.setCount(0.5);
        orderDegradeRule.setTimeWindow(10);
        orderDegradeRule.setMinRequestAmount(5);
        rules.add(orderDegradeRule);

        DegradeManager.loadRules(rules);
    }
}

@Service
public class OrderService {

    @SentinelResource(value = "createOrder", blockHandler = "createOrderBlockHandler", fallback = "createOrderFallback")
    public Result<Long> createOrder(OrderCreateDTO dto) {
        return Result.success(orderMapper.insert(order));
    }

    public Result<Long> createOrderBlockHandler(OrderCreateDTO dto, BlockException e) {
        return Result.fail("系统繁忙，请稍后重试");
    }

    public Result<Long> createOrderFallback(OrderCreateDTO dto, Throwable t) {
        return Result.fail("服务降级，请稍后重试");
    }

    @SentinelResource(value = "getOrder", blockHandler = "getOrderBlockHandler")
    public Result<OrderVO> getOrder(Long id) {
        return Result.success(orderMapper.selectDetailById(id));
    }

    public Result<OrderVO> getOrderBlockHandler(Long id, BlockException e) {
        return Result.fail("查询失败，请稍后重试");
    }
}

@Component
public class SentinelFallbackHandler {

    public Result<Void> userServiceFallback(BlockException e) {
        return Result.fail("用户服务暂时不可用，请稍后重试");
    }

    public Result<OrderVO> getOrderFallback(Long id, BlockException e) {
        return Result.fail("订单服务暂时不可用，请稍后重试");
    }

    public Result<Long> createOrderFallback(OrderCreateDTO dto, BlockException e) {
        return Result.fail("创建订单失败，请稍后重试");
    }

    public Result<Void> paymentFallback(BlockException e) {
        return Result.fail("支付服务暂时不可用，请稍后重试");
    }
}
```

## 10.4 配置中心

```yaml
spring:
  application:
    name: user-service
  cloud:
    nacos:
      discovery:
        server-addr: ${NACOS_SERVER:localhost:8848}
        namespace: ${NACOS_NAMESPACE:public}
        group: ${NACOS_GROUP:ANDT_GROUP}
        ip: ${spring.cloud.client.ip-address}
        port: ${server.port}
      config:
        server-addr: ${NACOS_SERVER:localhost:8848}
        namespace: ${NACOS_NAMESPACE:public}
        group: ${NACOS_GROUP:ANDT_GROUP}
        file-extension: yaml
        refresh-enabled: true
        shared-configs:
          - data-id: common.yml
            group: ${NACOS_GROUP:ANDT_GROUP}
            refresh: true

server:
  port: 8081

management:
  endpoints:
    web:
      exposure:
        include: "*"
  endpoint:
    health:
      show-details: always

feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 10000
        loggerLevel: basic
      user-service:
        connectTimeout: 3000
        readTimeout: 5000
      order-service:
        connectTimeout: 3000
        readTimeout: 5000
  compression:
    request:
      enabled: true
    response:
      enabled: true

sentinel:
  transport:
    dashboard: ${SENTINEL_DASHBOARD:localhost:8080}
    port: 8719
  eager: true

logging:
  level:
    root: INFO
    com.andiantong.ims: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"
```

```java
package com.andiantong.ims.common.core.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@RefreshScope
@ConfigurationProperties(prefix = "andiantong.user")
public class UserProperties {

    private Integer defaultPageSize = 10;
    private Integer maxPageSize = 100;
    private String defaultAvatar = "https://andiantong.com/default-avatar.png";
    private Integer sessionTimeout = 7200;
    private Integer passwordMaxRetryCount = 5;
    private Integer passwordLockMinutes = 30;

    public Integer getDefaultPageSize() {
        return defaultPageSize;
    }

    public void setDefaultPageSize(Integer defaultPageSize) {
        this.defaultPageSize = defaultPageSize;
    }

    public Integer getMaxPageSize() {
        return maxPageSize;
    }

    public void setMaxPageSize(Integer maxPageSize) {
        this.maxPageSize = maxPageSize;
    }

    public String getDefaultAvatar() {
        return defaultAvatar;
    }

    public void setDefaultAvatar(String defaultAvatar) {
        this.defaultAvatar = defaultAvatar;
    }

    public Integer getSessionTimeout() {
        return sessionTimeout;
    }

    public void setSessionTimeout(Integer sessionTimeout) {
        this.sessionTimeout = sessionTimeout;
    }

    public Integer getPasswordMaxRetryCount() {
        return passwordMaxRetryCount;
    }

    public void setPasswordMaxRetryCount(Integer passwordMaxRetryCount) {
        this.passwordMaxRetryCount = passwordMaxRetryCount;
    }

    public Integer getPasswordLockMinutes() {
        return passwordLockMinutes;
    }

    public void setPasswordLockMinutes(Integer passwordLockMinutes) {
        this.passwordLockMinutes = passwordLockMinutes;
    }
}

@Component
@RefreshScope
@ConfigurationProperties(prefix = "andiantong.order")
public class OrderProperties {

    private Integer autoCancelMinutes = 30;
    private Integer autoCompleteHours = 24;
    private Integer maxBookDays = 30;
    private String orderNoPrefix = "ANDT";
    private Boolean enableRefund = true;
    private Integer refundDays = 7;

    public Integer getAutoCancelMinutes() {
        return autoCancelMinutes;
    }

    public void setAutoCancelMinutes(Integer autoCancelMinutes) {
        this.autoCancelMinutes = autoCancelMinutes;
    }

    public Integer getAutoCompleteHours() {
        return autoCompleteHours;
    }

    public void setAutoCompleteHours(Integer autoCompleteHours) {
        this.autoCompleteHours = autoCompleteHours;
    }

    public Integer getMaxBookDays() {
        return maxBookDays;
    }

    public void setMaxBookDays(Integer maxBookDays) {
        this.maxBookDays = maxBookDays;
    }

    public String getOrderNoPrefix() {
        return orderNoPrefix;
    }

    public void setOrderNoPrefix(String orderNoPrefix) {
        this.orderNoPrefix = orderNoPrefix;
    }

    public Boolean getEnableRefund() {
        return enableRefund;
    }

    public void setEnableRefund(Boolean enableRefund) {
        this.enableRefund = enableRefund;
    }

    public Integer getRefundDays() {
        return refundDays;
    }

    public void setRefundDays(Integer refundDays) {
        this.refundDays = refundDays;
    }
}
```

## 10.5 分布式事务

```java
package com.andiantong.ims.service.order.service.impl;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.order.dto.OrderCreateDTO;
import com.andiantong.ims.service.order.entity.Order;
import com.andiantong.ims.service.order.mapper.OrderMapper;
import com.andiantong.ims.service.order.service.OrderService;
import com.andiantong.ims.service.payment.feign.PaymentFeignClient;
import com.andiantong.ims.service.user.feign.UserFeignClient;
import io.seata.spring.annotation.GlobalTransactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserFeignClient userFeignClient;

    @Autowired
    private PaymentFeignClient paymentFeignClient;

    @Autowired
    private OrderFlowService orderFlowService;

    @Override
    @GlobalTransactional(name = "create-order", timeoutMills = 30000, rollbackFor = Exception.class)
    public Result<Long> create(OrderCreateDTO dto) {
        Result<UserVO> userResult = userFeignClient.getById(dto.getUserId());
        if (!userResult.isSuccess() || userResult.getData() == null) {
            return Result.fail("用户不存在");
        }

        Result<ServiceVO> serviceResult = serviceFeignClient.getById(dto.getServiceId());
        if (!serviceResult.isSuccess() || serviceResult.getData() == null) {
            return Result.fail("服务不存在");
        }

        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(dto.getUserId());
        order.setServiceId(dto.getServiceId());
        order.setServiceAmount(serviceResult.getData().getPrice());
        order.setTotalAmount(order.getServiceAmount());
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setPayAmount(order.getTotalAmount());
        order.setStatus(1);
        order.setBookDate(dto.getBookDate());
        order.setBookTime(dto.getBookTime());
        order.setRemark(dto.getRemark());
        order.setCreateTime(new Date());
        order.setUpdateTime(new Date());
        orderMapper.insert(order);

        if (dto.getAddressId() != null) {
            Result<AddressVO> addressResult = userFeignClient.getAddressById(dto.getAddressId());
            if (addressResult.isSuccess() && addressResult.getData() != null) {
                OrderAddress address = new OrderAddress();
                address.setOrderId(order.getId());
                address.setProvince(addressResult.getData().getProvince());
                address.setCity(addressResult.getData().getCity());
                address.setDistrict(addressResult.getData().getDistrict());
                address.setDetail(addressResult.getData().getDetail());
                address.setLatitude(addressResult.getData().getLatitude());
                address.setLongitude(addressResult.getData().getLongitude());
                orderAddressMapper.insert(address);
            }
        }

        orderFlowService.recordLog(order.getId(), "订单创建", "系统");

        return Result.success(order.getId());
    }

    @Override
    @GlobalTransactional(name = "pay-order", timeoutMills = 30000, rollbackFor = Exception.class)
    public Result<Void> pay(Long orderId, Integer payType) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.fail("订单不存在");
        }

        if (order.getStatus() != 1) {
            return Result.fail("订单状态不正确");
        }

        PaymentCreateDTO paymentDTO = new PaymentCreateDTO();
        paymentDTO.setOrderId(orderId);
        paymentDTO.setUserId(order.getUserId());
        paymentDTO.setAmount(order.getPayAmount());
        paymentDTO.setPayType(payType);

        Result<Long> paymentResult = paymentFeignClient.create(paymentDTO);
        if (!paymentResult.isSuccess()) {
            return Result.fail("创建支付记录失败");
        }

        Result<Void> payResult = paymentFeignClient.pay(paymentResult.getData());
        if (!payResult.isSuccess()) {
            return Result.fail("支付失败");
        }

        order.setStatus(2);
        order.setPayType(payType);
        order.setPayTime(new Date());
        order.setUpdateTime(new Date());
        orderMapper.update(order);

        orderFlowService.recordLog(orderId, "订单支付成功", "系统");

        return Result.success();
    }

    @Override
    @GlobalTransactional(name = "cancel-order", timeoutMills = 30000, rollbackFor = Exception.class)
    public Result<Void> cancel(Long orderId, String reason) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.fail("订单不存在");
        }

        if (order.getStatus() != 1 && order.getStatus() != 2) {
            return Result.fail("订单状态不正确");
        }

        order.setStatus(7);
        order.setRemark(reason);
        order.setUpdateTime(new Date());
        orderMapper.update(order);

        if (order.getStatus() == 2 && order.getPayAmount().compareTo(BigDecimal.ZERO) > 0) {
            RefundCreateDTO refundDTO = new RefundCreateDTO();
            refundDTO.setOrderId(orderId);
            refundDTO.setAmount(order.getPayAmount());
            refundDTO.setReason(reason);

            Result<Void> refundResult = paymentFeignClient.refund(refundDTO);
            if (!refundResult.isSuccess()) {
                return Result.fail("退款失败");
            }
        }

        orderFlowService.recordLog(orderId, "订单取消: " + reason, "系统");

        return Result.success();
    }

    private String generateOrderNo() {
        return "ANDT" + System.currentTimeMillis() + String.format("%04d", new Random().nextInt(10000));
    }
}
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(content)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
