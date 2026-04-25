import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

content = '''
---

## 第八部分 公共组件和工具类

## 8.1 通用响应结果类

```java
package com.andiantong.ims.common.core.result;

import lombok.Data;
import java.io.Serializable;

@Data
public class Result<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;
    private T data;
    private Long timestamp;

    public Result() {
        this.timestamp = System.currentTimeMillis();
    }

    public Result(Integer code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage());
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), message, data);
    }

    public static <T> Result<T> fail() {
        return new Result<>(ResultCode.FAIL.getCode(), ResultCode.FAIL.getMessage());
    }

    public static <T> Result<T> fail(String message) {
        return new Result<>(ResultCode.FAIL.getCode(), message);
    }

    public static <T> Result<T> fail(Integer code, String message) {
        return new Result<>(code, message);
    }

    public static <T> Result<T> fail(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMessage());
    }

    public static <T> Result<T> fail(ResultCode resultCode, String message) {
        return new Result<>(resultCode.getCode(), message);
    }

    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code);
    }
}

@Data
public class PageVO<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<T> records;
    private Long total;
    private Integer pageNum;
    private Integer pageSize;
    private Integer pages;

    public PageVO() {
    }

    public PageVO(List<T> records, Long total, Integer pageNum, Integer pageSize) {
        this.records = records;
        this.total = total;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.pages = (int) Math.ceil((double) total / pageSize);
    }
}

public enum ResultCode {
    SUCCESS(200, "操作成功"),
    FAIL(500, "操作失败"),
    NOT_FOUND(404, "资源不存在"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    VALIDATE_FAIL(400, "参数校验失败"),
    TOKEN_EXPIRED(401, "Token已过期"),
    TOKEN_INVALID(401, "Token无效"),
    USER_NOT_EXIST(404, "用户不存在"),
    USER_PASSWORD_ERROR(400, "用户名或密码错误"),
    USER_DISABLED(403, "用户已被禁用"),
    USER_LOCKED(403, "用户已被锁定"),
    ROLE_NOT_EXIST(404, "角色不存在"),
    PERMISSION_DENIED(403, "权限不足"),
    DATA_NOT_EXIST(404, "数据不存在"),
    DATA_EXIST(400, "数据已存在"),
    ORDER_NOT_EXIST(404, "订单不存在"),
    ORDER_STATUS_ERROR(400, "订单状态异常"),
    ORDER_CANCEL_FAILED(500, "订单取消失败"),
    PAY_FAILED(500, "支付失败"),
    PAY_TIMEOUT(500, "支付超时"),
    REFUND_FAILED(500, "退款失败"),
    ELECTRICIAN_NOT_EXIST(404, "电工不存在"),
    ELECTRICIAN_NOT_AVAILABLE(400, "电工不可用"),
    SERVICE_NOT_EXIST(404, "服务不存在"),
    SERVICE_OFFLINE(400, "服务已下架"),
    COUPON_NOT_EXIST(404, "优惠券不存在"),
    COUPON_EXPIRED(400, "优惠券已过期"),
    COUPON_USED(400, "优惠券已使用"),
    COUPON_LIMIT(400, "优惠券领取已达上限"),
    STOCK_NOT_ENOUGH(400, "库存不足"),
    ADDRESS_NOT_EXIST(404, "地址不存在"),
    FILE_UPLOAD_FAILED(500, "文件上传失败"),
    FILE_TOO_LARGE(400, "文件过大"),
    FILE_TYPE_ERROR(400, "文件类型错误"),
    SMS_SEND_FAILED(500, "短信发送失败"),
    SMS_CODE_ERROR(400, "验证码错误"),
    SMS_CODE_EXPIRED(400, "验证码已过期"),
    SYSTEM_ERROR(500, "系统异常"),
    THIRD_PARTY_ERROR(500, "第三方服务异常");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

## 8.2 全局异常处理器

```java
package com.andiantong.ims.common.core.exception;

import com.andiantong.ims.common.core.result.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public Result<Void> handleBusinessException(BusinessException e, HttpServletRequest request) {
        logger.warn("业务异常: {} - {}", request.getRequestURI(), e.getMessage());
        return Result.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        logger.warn("参数校验失败: {} - {}", request.getRequestURI(), message);
        return Result.fail(ResultCode.VALIDATE_FAIL.getCode(), message);
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleBindException(BindException e, HttpServletRequest request) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        logger.warn("参数绑定失败: {} - {}", request.getRequestURI(), message);
        return Result.fail(ResultCode.VALIDATE_FAIL.getCode(), message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e, HttpServletRequest request) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        logger.warn("参数校验失败: {} - {}", request.getRequestURI(), message);
        return Result.fail(ResultCode.VALIDATE_FAIL.getCode(), message);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        String message = String.format("参数 '%s' 类型错误", e.getName());
        logger.warn("参数类型错误: {} - {}", request.getRequestURI(), message);
        return Result.fail(ResultCode.VALIDATE_FAIL.getCode(), message);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Result<Void> handleNoHandlerFoundException(NoHandlerFoundException e, HttpServletRequest request) {
        logger.warn("资源不存在: {} - {}", request.getRequestURI(), e.getMessage());
        return Result.fail(ResultCode.NOT_FOUND.getCode(), "资源不存在");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e, HttpServletRequest request) {
        logger.warn("文件过大: {} - {}", request.getRequestURI(), e.getMessage());
        return Result.fail(ResultCode.FILE_TOO_LARGE.getCode(), "上传文件超过限制大小");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        logger.warn("非法参数: {} - {}", request.getRequestURI(), e.getMessage());
        return Result.fail(ResultCode.VALIDATE_FAIL.getCode(), e.getMessage());
    }

    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleNullPointerException(NullPointerException e, HttpServletRequest request) {
        logger.error("空指针异常: " + request.getRequestURI(), e);
        return Result.fail(ResultCode.SYSTEM_ERROR.getCode(), "系统异常");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception e, HttpServletRequest request) {
        logger.error("系统异常: " + request.getRequestURI(), e);
        return Result.fail(ResultCode.SYSTEM_ERROR.getCode(), "系统异常，请稍后重试");
    }
}

@Data
@EqualsAndHashCode(callSuper = true)
public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.FAIL.getCode();
        this.message = message;
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }

    public BusinessException(ResultCode resultCode, String message) {
        super(message);
        this.code = resultCode.getCode();
        this.message = message;
    }
}
```

## 8.3 通用工具类

```java
package com.andiantong.ims.common.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.*;

public class DateUtil {

    private static final Logger logger = LoggerFactory.getLogger(DateUtil.class);

    private static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    private static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";

    public static String format(Date date) {
        if (date == null) {
            return null;
        }
        return new SimpleDateFormat(DEFAULT_DATETIME_FORMAT).format(date);
    }

    public static String format(Date date, String pattern) {
        if (date == null) {
            return null;
        }
        return new SimpleDateFormat(pattern).format(date);
    }

    public static String formatDate(Date date) {
        if (date == null) {
            return null;
        }
        return new SimpleDateFormat(DEFAULT_DATE_FORMAT).format(date);
    }

    public static String formatTime(Date date) {
        if (date == null) {
            return null;
        }
        return new SimpleDateFormat(DEFAULT_TIME_FORMAT).format(date);
    }

    public static Date parse(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return new SimpleDateFormat(DEFAULT_DATETIME_FORMAT).parse(dateStr);
        } catch (Exception e) {
            logger.error("日期解析失败: {}", dateStr, e);
            return null;
        }
    }

    public static Date parse(String dateStr, String pattern) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return new SimpleDateFormat(pattern).parse(dateStr);
        } catch (Exception e) {
            logger.error("日期解析失败: {} - {}", dateStr, pattern, e);
            return null;
        }
    }

    public static Date parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return new SimpleDateFormat(DEFAULT_DATE_FORMAT).parse(dateStr);
        } catch (Exception e) {
            logger.error("日期解析失败: {}", dateStr, e);
            return null;
        }
    }

    public static Date addYears(Date date, int amount) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.YEAR, amount);
        return calendar.getTime();
    }

    public static Date addMonths(Date date, int amount) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, amount);
        return calendar.getTime();
    }

    public static Date addDays(Date date, int amount) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, amount);
        return calendar.getTime();
    }

    public static Date addHours(Date date, int amount) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.HOUR, amount);
        return calendar.getTime();
    }

    public static Date addMinutes(Date date, int amount) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, amount);
        return calendar.getTime();
    }

    public static Date addSeconds(Date date, int amount) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.SECOND, amount);
        return calendar.getTime();
    }

    public static long getDaysBetween(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        long diff = endDate.getTime() - startDate.getTime();
        return diff / (1000 * 60 * 60 * 24);
    }

    public static long getHoursBetween(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        long diff = endDate.getTime() - startDate.getTime();
        return diff / (1000 * 60 * 60);
    }

    public static long getMinutesBetween(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        long diff = endDate.getTime() - startDate.getTime();
        return diff / (1000 * 60);
    }

    public static boolean isSameDay(Date date1, Date date2) {
        if (date1 == null || date2 == null) {
            return false;
        }
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);
        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date2);
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR)
                && cal1.get(Calendar.MONTH) == cal2.get(Calendar.MONTH)
                && cal1.get(Calendar.DAY_OF_MONTH) == cal2.get(Calendar.DAY_OF_MONTH);
    }

    public static boolean isToday(Date date) {
        return isSameDay(date, new Date());
    }

    public static Date getStartOfDay(Date date) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    public static Date getEndOfDay(Date date) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    public static Date getStartOfMonth(Date date) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        return getStartOfDay(calendar.getTime());
    }

    public static Date getEndOfMonth(Date date) {
        if (date == null) {
            return null;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        return getEndOfDay(calendar.getTime());
    }

    public static int getYear(Date date) {
        if (date == null) {
            return 0;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.YEAR);
    }

    public static int getMonth(Date date) {
        if (date == null) {
            return 0;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MONTH) + 1;
    }

    public static int getDay(Date date) {
        if (date == null) {
            return 0;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DAY_OF_MONTH);
    }

    public static int getHour(Date date) {
        if (date == null) {
            return 0;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.HOUR_OF_DAY);
    }

    public static int getMinute(Date date) {
        if (date == null) {
            return 0;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MINUTE);
    }

    public static int getSecond(Date date) {
        if (date == null) {
            return 0;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.SECOND);
    }
}
```

## 8.4 文件上传工具类

```java
package com.andiantong.ims.common.core.util;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.UUID;

public class FileUtil {

    private static final Logger logger = LoggerFactory.getLogger(FileUtil.class);

    private static final String[] ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "bmp", "webp"};
    private static final String[] ALLOWED_VIDEO_EXTENSIONS = {"mp4", "avi", "mov", "wmv", "flv", "mkv"};
    private static final String[] ALLOWED_DOCUMENT_EXTENSIONS = {"doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt"};

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024;

    public static String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int lastIndexOf = fileName.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return "";
        }
        return fileName.substring(lastIndexOf + 1).toLowerCase();
    }

    public static String getFileName(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int lastIndexOf = fileName.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return fileName;
        }
        return fileName.substring(0, lastIndexOf);
    }

    public static String generateFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String timestamp = String.valueOf(new Date().getTime());
        return uuid + "_" + timestamp + "." + extension;
    }

    public static String getFileMD5(InputStream inputStream) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] buffer = new byte[8192];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                md.update(buffer, 0, length);
            }
            return new BigInteger(1, md.digest()).toString(16);
        } catch (NoSuchAlgorithmException | IOException e) {
            logger.error("计算文件MD5失败", e);
            return null;
        }
    }

    public static String getFileMD5(File file) {
        try (FileInputStream fis = new FileInputStream(file)) {
            return getFileMD5(fis);
        } catch (IOException e) {
            logger.error("计算文件MD5失败", e);
            return null;
        }
    }

    public static boolean isImage(String fileName) {
        String extension = getFileExtension(fileName);
        for (String allowedExtension : ALLOWED_IMAGE_EXTENSIONS) {
            if (allowedExtension.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isVideo(String fileName) {
        String extension = getFileExtension(fileName);
        for (String allowedExtension : ALLOWED_VIDEO_EXTENSIONS) {
            if (allowedExtension.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isDocument(String fileName) {
        String extension = getFileExtension(fileName);
        for (String allowedExtension : ALLOWED_DOCUMENT_EXTENSIONS) {
            if (allowedExtension.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isAllowedExtension(String fileName, String[] allowedExtensions) {
        String extension = getFileExtension(fileName);
        for (String allowedExtension : allowedExtensions) {
            if (allowedExtension.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    public static boolean validateFileSize(long size, long maxSize) {
        return size > 0 && size <= maxSize;
    }

    public static boolean validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        String originalFilename = file.getOriginalFilename();
        if (!isImage(originalFilename)) {
            return false;
        }
        return validateFileSize(file.getSize(), MAX_IMAGE_SIZE);
    }

    public static boolean validateVideo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        String originalFilename = file.getOriginalFilename();
        if (!isVideo(originalFilename)) {
            return false;
        }
        return validateFileSize(file.getSize(), MAX_VIDEO_SIZE);
    }

    public static boolean validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        return validateFileSize(file.getSize(), MAX_FILE_SIZE);
    }

    public static File uploadFile(MultipartFile file, String uploadPath) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }
        File dir = new File(uploadPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String fileName = generateFileName(file.getOriginalFilename());
        String filePath = uploadPath + File.separator + fileName;
        File targetFile = new File(filePath);
        file.transferTo(targetFile);
        return targetFile;
    }

    public static String uploadFileAndGetUrl(MultipartFile file, String uploadPath, String domain) throws IOException {
        File targetFile = uploadFile(file, uploadPath);
        String fileName = targetFile.getName();
        return domain + "/" + fileName;
    }

    public static boolean deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        File file = new File(filePath);
        if (file.exists()) {
            return file.delete();
        }
        return false;
    }

    public static boolean deleteFile(File file) {
        if (file == null || !file.exists()) {
            return false;
        }
        return file.delete();
    }

    public static long getFileSize(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return 0;
        }
        File file = new File(filePath);
        if (file.exists()) {
            return file.length();
        }
        return 0;
    }

    public static String getFileSizeString(long size) {
        if (size < 1024) {
            return size + "B";
        } else if (size < 1024 * 1024) {
            return String.format("%.2fKB", size / 1024.0);
        } else if (size < 1024 * 1024 * 1024) {
            return String.format("%.2fMB", size / 1024.0 / 1024.0);
        } else {
            return String.format("%.2fGB", size / 1024.0 / 1024.0 / 1024.0);
        }
    }

    public static byte[] readFile(String filePath) throws IOException {
        File file = new File(filePath);
        return readFile(file);
    }

    public static byte[] readFile(File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file);
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int length;
            while ((length = fis.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
            return baos.toByteArray();
        }
    }

    public static void writeFile(String filePath, byte[] data) throws IOException {
        File file = new File(filePath);
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(data);
            fos.flush();
        }
    }
}
```

## 8.5 字符串工具类

```java
package com.andiantong.ims.common.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil extends org.apache.commons.lang3.StringUtils {

    private static final Logger logger = LoggerFactory.getLogger(StringUtil.class);

    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$");

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    public static String defaultIfEmpty(String str, String defaultStr) {
        return isEmpty(str) ? defaultStr : str;
    }

    public static String defaultIfBlank(String str, String defaultStr) {
        return isBlank(str) ? defaultStr : str;
    }

    public static boolean isPhone(String str) {
        if (isEmpty(str)) {
            return false;
        }
        return PHONE_PATTERN.matcher(str).matches();
    }

    public static boolean isEmail(String str) {
        if (isEmpty(str)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(str).matches();
    }

    public static boolean isIdCard(String str) {
        if (isEmpty(str)) {
            return false;
        }
        return ID_CARD_PATTERN.matcher(str).matches();
    }

    public static String maskPhone(String phone) {
        if (isEmpty(phone) || phone.length() < 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }

    public static String maskEmail(String email) {
        if (isEmpty(email) || !email.contains("@")) {
            return email;
        }
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) {
            return email;
        }
        String prefix = email.substring(0, atIndex);
        String suffix = email.substring(atIndex);
        if (prefix.length() <= 2) {
            return prefix.charAt(0) + "***" + suffix;
        }
        return prefix.substring(0, 2) + "***" + suffix;
    }

    public static String maskIdCard(String idCard) {
        if (isEmpty(idCard) || idCard.length() < 18) {
            return idCard;
        }
        return idCard.substring(0, 6) + "********" + idCard.substring(14);
    }

    public static String toCamelCase(String str) {
        if (isEmpty(str)) {
            return str;
        }
        StringBuilder result = new StringBuilder();
        boolean upperNext = false;
        for (char c : str.toCharArray()) {
            if (c == '_' || c == '-') {
                upperNext = true;
            } else {
                if (upperNext) {
                    result.append(Character.toUpperCase(c));
                    upperNext = false;
                } else {
                    result.append(Character.toLowerCase(c));
                }
            }
        }
        return result.toString();
    }

    public static String toSnakeCase(String str) {
        if (isEmpty(str)) {
            return str;
        }
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (Character.isUpperCase(c)) {
                if (i > 0) {
                    result.append('_');
                }
                result.append(Character.toLowerCase(c));
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }

    public static String toPascalCase(String str) {
        if (isEmpty(str)) {
            return str;
        }
        String camelCase = toCamelCase(str);
        return camelCase.substring(0, 1).toUpperCase() + camelCase.substring(1);
    }

    public static String join(String[] array, String separator) {
        if (array == null || array.length == 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < array.length; i++) {
            if (i > 0) {
                sb.append(separator);
            }
            sb.append(array[i]);
        }
        return sb.toString();
    }

    public static String[] split(String str, String separator) {
        if (isEmpty(str)) {
            return new String[0];
        }
        return str.split(separator);
    }

    public static List<String> splitToList(String str, String separator) {
        List<String> list = new ArrayList<>();
        if (isEmpty(str)) {
            return list;
        }
        String[] array = str.split(separator);
        for (String item : array) {
            if (isNotBlank(item)) {
                list.add(item.trim());
            }
        }
        return list;
    }

    public static String truncate(String str, int maxLength) {
        if (isEmpty(str) || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }

    public static String truncateWithEllipsis(String str, int maxLength) {
        if (isEmpty(str) || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }

    public static String removeSpecialChars(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.replaceAll("[^a-zA-Z0-9\\u4e00-\\u9fa5]", "");
    }

    public static String extractNumber(String str) {
        if (isEmpty(str)) {
            return "";
        }
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(str);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            sb.append(matcher.group());
        }
        return sb.toString();
    }

    public static String capitalize(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    public static String uncapitalize(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.substring(0, 1).toLowerCase() + str.substring(1);
    }
}
```

## 8.6 加密解密工具类

```java
package com.andiantong.ims.common.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

public class EncryptUtil {

    private static final Logger logger = LoggerFactory.getLogger(EncryptUtil.class);

    private static final String AES_ALGORITHM = "AES";
    private static final String AES_TRANSFORMATION = "AES/ECB/PKCS5Padding";
    private static final String DES_ALGORITHM = "DES";
    private static final String DES_TRANSFORMATION = "DES/ECB/PKCS5Padding";
    private static final String MD5_ALGORITHM = "MD5";
    private static final String SHA_ALGORITHM = "SHA";
    private static final String SHA256_ALGORITHM = "SHA-256";
    private static final String HMAC_MD5_ALGORITHM = "HmacMD5";
    private static final String HMAC_SHA256_ALGORITHM = "HmacSHA256";

    public static String md5(String text) {
        return hash(text, MD5_ALGORITHM);
    }

    public static String sha(String text) {
        return hash(text, SHA_ALGORITHM);
    }

    public static String sha256(String text) {
        return hash(text, SHA256_ALGORITHM);
    }

    private static String hash(String text, String algorithm) {
        if (text == null) {
            return null;
        }
        try {
            MessageDigest md = MessageDigest.getInstance(algorithm);
            byte[] bytes = md.digest(text.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            logger.error("加密失败: {}", algorithm, e);
            return null;
        }
    }

    public static String hmacMd5(String text, String key) {
        return hmac(text, key, HMAC_MD5_ALGORITHM);
    }

    public static String hmacSha256(String text, String key) {
        return hmac(text, key, HMAC_SHA256_ALGORITHM);
    }

    private static String hmac(String text, String key, String algorithm) {
        if (text == null || key == null) {
            return null;
        }
        try {
            SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), algorithm);
            Mac mac = Mac.getInstance(algorithm);
            mac.init(secretKey);
            byte[] bytes = mac.doFinal(text.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(bytes);
        } catch (Exception e) {
            logger.error("HMAC加密失败: {}", algorithm, e);
            return null;
        }
    }

    public static String aesEncrypt(String text, String key) {
        return aes(text, key, Cipher.ENCRYPT_MODE);
    }

    public static String aesDecrypt(String text, String key) {
        return aes(text, key, Cipher.DECRYPT_MODE);
    }

    private static String aes(String text, String key, int mode) {
        if (text == null || key == null) {
            return null;
        }
        try {
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), AES_ALGORITHM);
            Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
            cipher.init(mode, secretKey);
            byte[] bytes = cipher.doFinal(text.getBytes(StandardCharsets.UTF_8));
            return mode == Cipher.ENCRYPT_MODE ? Base64.getEncoder().encodeToString(bytes) : new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logger.error("AES加解密失败", e);
            return null;
        }
    }

    public static String desEncrypt(String text, String key) {
        return des(text, key, Cipher.ENCRYPT_MODE);
    }

    public static String desDecrypt(String text, String key) {
        return des(text, key, Cipher.DECRYPT_MODE);
    }

    private static String des(String text, String key, int mode) {
        if (text == null || key == null) {
            return null;
        }
        try {
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), DES_ALGORITHM);
            Cipher cipher = Cipher.getInstance(DES_TRANSFORMATION);
            cipher.init(mode, secretKey);
            byte[] bytes = cipher.doFinal(text.getBytes(StandardCharsets.UTF_8));
            return mode == Cipher.ENCRYPT_MODE ? Base64.getEncoder().encodeToString(bytes) : new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logger.error("DES加解密失败", e);
            return null;
        }
    }

    public static String generateKey(String algorithm) {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(algorithm);
            SecureRandom secureRandom = new SecureRandom();
            keyGenerator.init(secureRandom);
            SecretKey secretKey = keyGenerator.generateKey();
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            logger.error("生成密钥失败: {}", algorithm, e);
            return null;
        }
    }

    public static String generateAesKey() {
        return generateKey(AES_ALGORITHM);
    }

    public static String generateDesKey() {
        return generateKey(DES_ALGORITHM);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(b & 0xff);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public static String base64Encode(String text) {
        if (text == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(text.getBytes(StandardCharsets.UTF_8));
    }

    public static String base64Decode(String text) {
        if (text == null) {
            return null;
        }
        try {
            return new String(Base64.getDecoder().decode(text), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            logger.error("Base64解码失败", e);
            return null;
        }
    }

    public static String urlEncode(String text) {
        if (text == null) {
            return null;
        }
        return java.net.URLEncoder.encode(text, StandardCharsets.UTF_8);
    }

    public static String urlDecode(String text) {
        if (text == null) {
            return null;
        }
        try {
            return java.net.URLDecoder.decode(text, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logger.error("URL解码失败", e);
            return null;
        }
    }
}
```

## 8.7 HTTP请求工具类

```java
package com.andiantong.ims.common.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class HttpUtil {

    private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);

    private static final int DEFAULT_CONNECT_TIMEOUT = 30000;
    private static final int DEFAULT_READ_TIMEOUT = 30000;
    private static final String DEFAULT_CHARSET = "UTF-8";

    public static String get(String urlString) {
        return get(urlString, null, null);
    }

    public static String get(String urlString, Map<String, String> params) {
        return get(urlString, params, null);
    }

    public static String get(String urlString, Map<String, String> params, Map<String, String> headers) {
        StringBuilder url = new StringBuilder(urlString);
        if (params != null && !params.isEmpty()) {
            if (!url.toString().contains("?")) {
                url.append("?");
            } else {
                url.append("&");
            }
            for (Map.Entry<String, String> entry : params.entrySet()) {
                url.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
            }
            url.deleteCharAt(url.length() - 1);
        }
        HttpURLConnection connection = null;
        InputStream inputStream = null;
        BufferedReader reader = null;
        try {
            URL urlObj = new URL(url.toString());
            connection = (HttpURLConnection) urlObj.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(DEFAULT_CONNECT_TIMEOUT);
            connection.setReadTimeout(DEFAULT_READ_TIMEOUT);
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            connection.setRequestProperty("Accept", "*/*");
            if (headers != null && !headers.isEmpty()) {
                for (Map.Entry<String, String> entry : headers.entrySet()) {
                    connection.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                inputStream = connection.getInputStream();
                reader = new BufferedReader(new InputStreamReader(inputStream, DEFAULT_CHARSET));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            } else {
                logger.error("GET请求失败: {}, 响应码: {}", url, responseCode);
                return null;
            }
        } catch (IOException e) {
            logger.error("GET请求异常: {}", url, e);
            return null;
        } finally {
            closeQuietly(reader);
            closeQuietly(inputStream);
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    public static String post(String urlString, String body) {
        return post(urlString, body, null);
    }

    public static String post(String urlString, String body, Map<String, String> headers) {
        HttpURLConnection connection = null;
        OutputStream outputStream = null;
        InputStream inputStream = null;
        BufferedReader reader = null;
        try {
            URL urlObj = new URL(urlString);
            connection = (HttpURLConnection) urlObj.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(DEFAULT_CONNECT_TIMEOUT);
            connection.setReadTimeout(DEFAULT_READ_TIMEOUT);
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setUseCaches(false);
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            connection.setRequestProperty("Accept", "*/*");
            if (headers != null && !headers.isEmpty()) {
                for (Map.Entry<String, String> entry : headers.entrySet()) {
                    connection.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }
            if (body != null && !body.isEmpty()) {
                outputStream = connection.getOutputStream();
                outputStream.write(body.getBytes(DEFAULT_CHARSET));
                outputStream.flush();
            }
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                inputStream = connection.getInputStream();
                reader = new BufferedReader(new InputStreamReader(inputStream, DEFAULT_CHARSET));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            } else {
                logger.error("POST请求失败: {}, 响应码: {}", urlString, responseCode);
                return null;
            }
        } catch (IOException e) {
            logger.error("POST请求异常: {}", urlString, e);
            return null;
        } finally {
            closeQuietly(outputStream);
            closeQuietly(reader);
            closeQuietly(inputStream);
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    public static String postForm(String urlString, Map<String, String> params) {
        StringBuilder body = new StringBuilder();
        if (params != null && !params.isEmpty()) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                body.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
            }
            body.deleteCharAt(body.length() - 1);
        }
        HttpURLConnection connection = null;
        OutputStream outputStream = null;
        InputStream inputStream = null;
        BufferedReader reader = null;
        try {
            URL urlObj = new URL(urlString);
            connection = (HttpURLConnection) urlObj.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(DEFAULT_CONNECT_TIMEOUT);
            connection.setReadTimeout(DEFAULT_READ_TIMEOUT);
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setUseCaches(false);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            if (body.length() > 0) {
                outputStream = connection.getOutputStream();
                outputStream.write(body.toString().getBytes(DEFAULT_CHARSET));
                outputStream.flush();
            }
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                inputStream = connection.getInputStream();
                reader = new BufferedReader(new InputStreamReader(inputStream, DEFAULT_CHARSET));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            } else {
                logger.error("POST Form请求失败: {}, 响应码: {}", urlString, responseCode);
                return null;
            }
        } catch (IOException e) {
            logger.error("POST Form请求异常: {}", urlString, e);
            return null;
        } finally {
            closeQuietly(outputStream);
            closeQuietly(reader);
            closeQuietly(inputStream);
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    public static boolean downloadFile(String fileUrl, String savePath) {
        HttpURLConnection connection = null;
        InputStream inputStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            URL url = new URL(fileUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(DEFAULT_CONNECT_TIMEOUT);
            connection.setReadTimeout(DEFAULT_READ_TIMEOUT);
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                inputStream = connection.getInputStream();
                File file = new File(savePath);
                File parent = file.getParentFile();
                if (parent != null && !parent.exists()) {
                    parent.mkdirs();
                }
                fileOutputStream = new FileOutputStream(file);
                byte[] buffer = new byte[8192];
                int length;
                while ((length = inputStream.read(buffer)) != -1) {
                    fileOutputStream.write(buffer, 0, length);
                }
                fileOutputStream.flush();
                return true;
            } else {
                logger.error("文件下载失败: {}, 响应码: {}", fileUrl, responseCode);
                return false;
            }
        } catch (IOException e) {
            logger.error("文件下载异常: {}", fileUrl, e);
            return false;
        } finally {
            closeQuietly(fileOutputStream);
            closeQuietly(inputStream);
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private static void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                logger.error("关闭流异常", e);
            }
        }
    }
}
```

---

## 第九部分 数据库表结构

## 9.1 用户相关表

```sql
CREATE TABLE `ims_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别 0-未知 1-男 2-女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-正常',
  `user_type` tinyint(1) DEFAULT '1' COMMENT '用户类型 1-普通用户 2-VIP用户',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE `ims_user_address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) NOT NULL COMMENT '收货人电话',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `detail` varchar(255) NOT NULL COMMENT '详细地址',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `is_default` tinyint(1) DEFAULT '0' COMMENT '是否默认 0-否 1-是',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';
```

## 9.2 订单相关表

```sql
CREATE TABLE `ims_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `service_id` bigint(20) NOT NULL COMMENT '服务ID',
  `electrician_id` bigint(20) DEFAULT NULL COMMENT '电工ID',
  `service_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '服务金额',
  `material_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '材料金额',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '订单总金额',
  `pay_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `pay_type` tinyint(1) DEFAULT NULL COMMENT '支付方式 1-微信 2-支付宝 3-余额',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '订单状态 1-待支付 2-待接单 3-已接单 4-服务中 5-待确认 6-已完成 7-已取消 8-退款中 9-已退款',
  `book_date` varchar(20) DEFAULT NULL COMMENT '预约日期',
  `book_time` varchar(20) DEFAULT NULL COMMENT '预约时间',
  `service_start_time` datetime DEFAULT NULL COMMENT '服务开始时间',
  `service_end_time` datetime DEFAULT NULL COMMENT '服务结束时间',
  `service_duration` int(11) DEFAULT NULL COMMENT '服务时长(分钟)',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_electrician_id` (`electrician_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

CREATE TABLE `ims_order_address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `detail` varchar(255) NOT NULL COMMENT '详细地址',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单地址表';

CREATE TABLE `ims_order_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `action` varchar(100) NOT NULL COMMENT '操作',
  `operator` varchar(50) DEFAULT NULL COMMENT '操作人',
  `operator_id` bigint(20) DEFAULT NULL COMMENT '操作人ID',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单日志表';
```

## 9.3 电工相关表

```sql
CREATE TABLE `ims_electrician` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '电工ID',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别 0-未知 1-男 2-女',
  `age` int(11) DEFAULT NULL COMMENT '年龄',
  `certificate_no` varchar(50) DEFAULT NULL COMMENT '证书编号',
  `certificate_image` varchar(255) DEFAULT NULL COMMENT '证书图片',
  `main_category_id` bigint(20) DEFAULT NULL COMMENT '主服务分类ID',
  `main_service_id` bigint(20) DEFAULT NULL COMMENT '主服务ID',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-正常',
  `certified` tinyint(1) DEFAULT '0' COMMENT '是否认证 0-未认证 1-已认证',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT '评分',
  `order_count` int(11) DEFAULT '0' COMMENT '订单数量',
  `total_income` decimal(12,2) DEFAULT '0.00' COMMENT '累计收入',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_certified` (`certified`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电工表';

CREATE TABLE `ims_electrician_skill` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `electrician_id` bigint(20) NOT NULL COMMENT '电工ID',
  `category_id` bigint(20) NOT NULL COMMENT '服务分类ID',
  `skill_level` tinyint(1) DEFAULT '1' COMMENT '技能等级 1-初级 2-中级 3-高级',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_electrician_id` (`electrician_id`),
  KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电工技能表';
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(content)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
