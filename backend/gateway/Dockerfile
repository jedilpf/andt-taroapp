# 多阶段构建
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# 复制Maven文件
COPY pom.xml .
COPY src ./src

# 安装Maven并构建
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /build/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]