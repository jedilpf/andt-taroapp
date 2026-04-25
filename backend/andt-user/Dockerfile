# 多阶段构建
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# 复制父 POM 和当前模块
COPY pom.xml .
COPY src ./src

# 安装 Maven 并构建
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /build/target/*.jar app.jar

# 暴露端口
EXPOSE 8081

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]
