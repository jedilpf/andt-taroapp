import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

content = '''
---

## 第七部分 数据库层代码

## 7.1 MyBatis Mapper 接口

### 7.1.1 用户管理 Mapper

```java
package com.andiantong.ims.service.user.mapper;

import com.andiantong.ims.service.user.entity.User;
import com.andiantong.ims.service.user.dto.UserQueryDTO;
import com.andiantong.ims.service.user.vo.UserVO;
import com.andiantong.ims.service.user.vo.UserDetailVO;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface UserMapper {

    @Select("<script>" +
            "SELECT u.*, r.role_name, r.role_code FROM ims_user u " +
            "LEFT JOIN ims_user_role ur ON u.id = ur.user_id " +
            "LEFT JOIN ims_role r ON ur.role_id = r.id " +
            "<where>" +
            "<if test='query.username != null and query.username!=\"\"'> AND u.username LIKE CONCAT('%', #{query.username}, '%')</if>" +
            "<if test='query.nickname != null and query.nickname!=\"\"'> AND u.nickname LIKE CONCAT('%', #{query.nickname}, '%')</if>" +
            "<if test='query.phone != null and query.phone!=\"\"'> AND u.phone LIKE CONCAT('%', #{query.phone}, '%')</if>" +
            "<if test='query.status != null'> AND u.status = #{query.status}</if>" +
            "<if test='query.userType != null'> AND u.user_type = #{query.userType}</if>" +
            "<if test='query.startDate != null and query.startDate!=\"\"'> AND u.create_time >= #{query.startDate}</if>" +
            "<if test='query.endDate != null and query.endDate!=\"\"'> AND u.create_time &lt;= #{query.endDate}</if>" +
            "</where>" +
            "ORDER BY u.create_time DESC" +
            "</script>")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "email", column = "email"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "birthday", column = "birthday"),
        @Result(property = "status", column = "status"),
        @Result(property = "userType", column = "user_type"),
        @Result(property = "lastLoginTime", column = "last_login_time"),
        @Result(property = "lastLoginIp", column = "last_login_ip"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "roleName", column = "role_name"),
        @Result(property = "roleCode", column = "role_code")
    })
    List<UserVO> selectByCondition(@Param("query") UserQueryDTO query);

    @Select("SELECT * FROM ims_user WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "password", column = "password"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "email", column = "email"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "birthday", column = "birthday"),
        @Result(property = "status", column = "status"),
        @Result(property = "userType", column = "user_type"),
        @Result(property = "lastLoginTime", column = "last_login_time"),
        @Result(property = "lastLoginIp", column = "last_login_ip"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time")
    })
    User selectById(@Param("id") Long id);

    @Select("SELECT * FROM ims_user WHERE username = #{username}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "password", column = "password"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "email", column = "email"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "birthday", column = "birthday"),
        @Result(property = "status", column = "status"),
        @Result(property = "userType", column = "user_type"),
        @Result(property = "lastLoginTime", column = "last_login_time"),
        @Result(property = "lastLoginIp", column = "last_login_ip"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time")
    })
    User selectByUsername(@Param("username") String username);

    @Select("SELECT * FROM ims_user WHERE phone = #{phone}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "password", column = "password"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "email", column = "email"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "birthday", column = "birthday"),
        @Result(property = "status", column = "status"),
        @Result(property = "userType", column = "user_type"),
        @Result(property = "lastLoginTime", column = "last_login_time"),
        @Result(property = "lastLoginIp", column = "last_login_ip"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time")
    })
    User selectByPhone(@Param("phone") String phone);

    @Insert("INSERT INTO ims_user(username, password, nickname, phone, email, avatar, gender, birthday, status, user_type, create_time, update_time) " +
            "VALUES(#{username}, #{password}, #{nickname}, #{phone}, #{email}, #{avatar}, #{gender}, #{birthday}, #{status}, #{userType}, #{createTime}, #{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE ims_user SET username=#{username}, nickname=#{nickname}, phone=#{phone}, email=#{email}, " +
            "avatar=#{avatar}, gender=#{gender}, birthday=#{birthday}, status=#{status}, user_type=#{userType}, update_time=#{updateTime} WHERE id=#{id}")
    int update(User user);

    @Update("UPDATE ims_user SET password=#{password}, update_time=#{updateTime} WHERE id=#{id}")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Update("UPDATE ims_user SET last_login_time=#{lastLoginTime}, last_login_ip=#{lastLoginIp} WHERE id=#{id}")
    int updateLoginInfo(@Param("id") Long id, @Param("lastLoginTime") java.util.Date lastLoginTime, @Param("lastLoginIp") String lastLoginIp);

    @Delete("UPDATE ims_user SET status=0, update_time=#{updateTime} WHERE id=#{id}")
    int deleteById(@Param("id") Long id, @Param("updateTime") java.util.Date updateTime);

    @Select("SELECT COUNT(*) FROM ims_user WHERE status = 1")
    int countActive();

    @Select("SELECT COUNT(*) FROM ims_user WHERE create_time >= #{startDate} AND create_time <= #{endDate}")
    int countByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT COUNT(*) FROM ims_user WHERE status = 1 " +
            "<if test='startDate != null and startDate!=\"\"'> AND last_login_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND last_login_time &lt;= #{endDate}</if>" +
            "</script>")
    int countActiveByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT date_format(create_time, '%Y-%m-%d') as date, COUNT(*) as count FROM ims_user " +
            "<where>" +
            "<if test='startDate != null and startDate!=\"\"'> AND create_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND create_time &lt;= #{endDate}</if>" +
            "</where>" +
            "GROUP BY date_format(create_time, '%Y-%m-%d') ORDER BY date" +
            "</script>")
    List<com.andiantong.ims.service.statistics.vo.GrowthVO> getGrowth(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("SELECT source, COUNT(*) as count FROM ims_user WHERE status = 1 GROUP BY source")
    List<com.andiantong.ims.service.statistics.vo.SourceCountVO> countBySource();
}
```

### 7.1.2 订单管理 Mapper

```java
package com.andiantong.ims.service.order.mapper;

import com.andiantong.ims.service.order.entity.Order;
import com.andiantong.ims.service.order.dto.OrderQueryDTO;
import com.andiantong.ims.service.order.vo.OrderVO;
import com.andiantong.ims.service.order.vo.OrderDetailVO;
import com.andiantong.ims.service.order.vo.StatusCountVO;
import com.andiantong.ims.service.order.vo.ServiceCountVO;
import com.andiantong.ims.service.order.vo.RegionCountVO;
import com.andiantong.ims.service.order.vo.TrendVO;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface OrderMapper {

    @Select("<script>" +
            "SELECT o.*, u.nickname as user_nickname, u.phone as user_phone, u.avatar as user_avatar, " +
            "s.name as service_name, s.image_url as service_image, sc.name as category_name, " +
            "e.name as electrician_name, e.phone as electrician_phone, e.avatar as electrician_avatar, " +
            "a.province, a.city, a.district, a.detail as address_detail, a.latitude, a.longitude " +
            "FROM ims_order o " +
            "LEFT JOIN ims_user u ON o.user_id = u.id " +
            "LEFT JOIN ims_service s ON o.service_id = s.id " +
            "LEFT JOIN ims_service_category sc ON s.category_id = sc.id " +
            "LEFT JOIN ims_electrician e ON o.electrician_id = e.id " +
            "LEFT JOIN ims_order_address a ON o.id = a.order_id " +
            "<where>" +
            "<if test='query.orderNo != null and query.orderNo!=\"\"'> AND o.order_no LIKE CONCAT('%', #{query.orderNo}, '%')</if>" +
            "<if test='query.userId != null'> AND o.user_id = #{query.userId}</if>" +
            "<if test='query.electricianId != null'> AND o.electrician_id = #{query.electricianId}</if>" +
            "<if test='query.status != null'> AND o.status = #{query.status}</if>" +
            "<if test='query.serviceId != null'> AND o.service_id = #{query.serviceId}</if>" +
            "<if test='query.serviceCategoryId != null'> AND s.category_id = #{query.serviceCategoryId}</if>" +
            "<if test='query.startDate != null and query.startDate!=\"\"'> AND o.create_time >= #{query.startDate}</if>" +
            "<if test='query.endDate != null and query.endDate!=\"\"'> AND o.create_time &lt;= #{query.endDate}</if>" +
            "</where>" +
            "ORDER BY o.create_time DESC" +
            "</script>")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "orderNo", column = "order_no"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "serviceId", column = "service_id"),
        @Result(property = "electricianId", column = "electrician_id"),
        @Result(property = "serviceAmount", column = "service_amount"),
        @Result(property = "materialAmount", column = "material_amount"),
        @Result(property = "discountAmount", column = "discount_amount"),
        @Result(property = "totalAmount", column = "total_amount"),
        @Result(property = "payAmount", column = "pay_amount"),
        @Result(property = "payType", column = "pay_type"),
        @Result(property = "payTime", column = "pay_time"),
        @Result(property = "status", column = "status"),
        @Result(property = "bookDate", column = "book_date"),
        @Result(property = "bookTime", column = "book_time"),
        @Result(property = "serviceStartTime", column = "service_start_time"),
        @Result(property = "serviceEndTime", column = "service_end_time"),
        @Result(property = "serviceDuration", column = "service_duration"),
        @Result(property = "remark", column = "remark"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "userNickname", column = "user_nickname"),
        @Result(property = "userPhone", column = "user_phone"),
        @Result(property = "userAvatar", column = "user_avatar"),
        @Result(property = "serviceName", column = "service_name"),
        @Result(property = "serviceImage", column = "service_image"),
        @Result(property = "categoryName", column = "category_name"),
        @Result(property = "electricianName", column = "electrician_name"),
        @Result(property = "electricianPhone", column = "electrician_phone"),
        @Result(property = "electricianAvatar", column = "electrician_avatar"),
        @Result(property = "province", column = "province"),
        @Result(property = "city", column = "city"),
        @Result(property = "district", column = "district"),
        @Result(property = "addressDetail", column = "address_detail"),
        @Result(property = "latitude", column = "latitude"),
        @Result(property = "longitude", column = "longitude")
    })
    List<OrderVO> selectByCondition(@Param("query") OrderQueryDTO query);

    @Select("SELECT o.*, u.nickname as user_nickname, u.phone as user_phone, u.avatar as user_avatar, " +
            "s.name as service_name, s.image_url as service_image, sc.name as category_name, " +
            "e.name as electrician_name, e.phone as electrician_phone, e.avatar as electrician_avatar, " +
            "a.province, a.city, a.district, a.detail as address_detail, a.latitude, a.longitude " +
            "FROM ims_order o " +
            "LEFT JOIN ims_user u ON o.user_id = u.id " +
            "LEFT JOIN ims_service s ON o.service_id = s.id " +
            "LEFT JOIN ims_service_category sc ON s.category_id = sc.id " +
            "LEFT JOIN ims_electrician e ON o.electrician_id = e.id " +
            "LEFT JOIN ims_order_address a ON o.id = a.order_id " +
            "WHERE o.id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "orderNo", column = "order_no"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "serviceId", column = "service_id"),
        @Result(property = "electricianId", column = "electrician_id"),
        @Result(property = "serviceAmount", column = "service_amount"),
        @Result(property = "materialAmount", column = "material_amount"),
        @Result(property = "discountAmount", column = "discount_amount"),
        @Result(property = "totalAmount", column = "total_amount"),
        @Result(property = "payAmount", column = "pay_amount"),
        @Result(property = "payType", column = "pay_type"),
        @Result(property = "payTime", column = "pay_time"),
        @Result(property = "status", column = "status"),
        @Result(property = "bookDate", column = "book_date"),
        @Result(property = "bookTime", column = "book_time"),
        @Result(property = "serviceStartTime", column = "service_start_time"),
        @Result(property = "serviceEndTime", column = "service_end_time"),
        @Result(property = "serviceDuration", column = "service_duration"),
        @Result(property = "remark", column = "remark"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "userNickname", column = "user_nickname"),
        @Result(property = "userPhone", column = "user_phone"),
        @Result(property = "userAvatar", column = "user_avatar"),
        @Result(property = "serviceName", column = "service_name"),
        @Result(property = "serviceImage", column = "service_image"),
        @Result(property = "categoryName", column = "category_name"),
        @Result(property = "electricianName", column = "electrician_name"),
        @Result(property = "electricianPhone", column = "electrician_phone"),
        @Result(property = "electricianAvatar", column = "electrician_avatar"),
        @Result(property = "province", column = "province"),
        @Result(property = "city", column = "city"),
        @Result(property = "district", column = "district"),
        @Result(property = "addressDetail", column = "address_detail"),
        @Result(property = "latitude", column = "latitude"),
        @Result(property = "longitude", column = "longitude")
    })
    OrderDetailVO selectDetailById(@Param("id") Long id);

    @Insert("INSERT INTO ims_order(order_no, user_id, service_id, service_amount, material_amount, discount_amount, total_amount, pay_amount, book_date, book_time, status, remark, create_time, update_time) " +
            "VALUES(#{orderNo}, #{userId}, #{serviceId}, #{serviceAmount}, #{materialAmount}, #{discountAmount}, #{totalAmount}, #{payAmount}, #{bookDate}, #{bookTime}, #{status}, #{remark}, #{createTime}, #{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Order order);

    @Update("UPDATE ims_order SET status=#{status}, update_time=#{updateTime}<if test='payTime != null'>, pay_time=#{payTime}</if><if test='electricianId != null'>, electrician_id=#{electricianId}</if><if test='serviceStartTime != null'>, service_start_time=#{serviceStartTime}</if><if test='serviceEndTime != null'>, service_end_time=#{serviceEndTime}</if><if test='serviceDuration != null'>, service_duration=#{serviceDuration}</if> WHERE id=#{id}")
    int update(Order order);

    @Update("UPDATE ims_order SET status=#{status}, update_time=#{updateTime} WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status, @Param("updateTime") java.util.Date updateTime);

    @Delete("UPDATE ims_order SET status=7, update_time=#{updateTime} WHERE id=#{id}")
    int cancelById(@Param("id") Long id, @Param("updateTime") java.util.Date updateTime);

    @Select("SELECT COUNT(*) FROM ims_order WHERE status = 1 AND DATE(create_time) = CURDATE()")
    int countToday();

    @Select("SELECT COUNT(*) FROM ims_order WHERE status = 1")
    int countAll();

    @Select("SELECT COUNT(*) FROM ims_order WHERE status = 1 AND DATE(create_time) >= #{startDate} AND DATE(create_time) <= #{endDate}")
    int countByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("SELECT COUNT(*) FROM ims_order WHERE status = #{status} AND DATE(create_time) >= #{startDate} AND DATE(create_time) <= #{endDate}")
    int countByStatusAndDate(@Param("status") Integer status, @Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("SELECT IFNULL(SUM(total_amount), 0) FROM ims_order WHERE status IN (6, 5) AND DATE(create_time) >= #{startDate} AND DATE(create_time) <= #{endDate}")
    java.math.BigDecimal sumAmountByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("SELECT IFNULL(AVG(total_amount), 0) FROM ims_order WHERE status IN (6, 5) AND DATE(create_time) >= #{startDate} AND DATE(create_time) <= #{endDate}")
    java.math.BigDecimal avgAmountByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT status as status, COUNT(*) as count FROM ims_order " +
            "<where>" +
            "<if test='startDate != null and startDate!=\"\"'> AND create_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND create_time &lt;= #{endDate}</if>" +
            "</where>" +
            "GROUP BY status" +
            "</script>")
    List<StatusCountVO> countByStatus(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT sc.name as service_name, COUNT(*) as count FROM ims_order o " +
            "LEFT JOIN ims_service s ON o.service_id = s.id " +
            "LEFT JOIN ims_service_category sc ON s.category_id = sc.id " +
            "<where>" +
            "<if test='startDate != null and startDate!=\"\"'> AND o.create_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND o.create_time &lt;= #{endDate}</if>" +
            "</where>" +
            "GROUP BY sc.id, sc.name ORDER BY count DESC" +
            "</script>")
    List<ServiceCountVO> countByService(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT a.city as region_name, COUNT(*) as count FROM ims_order o " +
            "LEFT JOIN ims_order_address a ON o.id = a.order_id " +
            "<where>" +
            "a.city IS NOT NULL " +
            "<if test='startDate != null and startDate!=\"\"'> AND o.create_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND o.create_time &lt;= #{endDate}</if>" +
            "</where>" +
            "GROUP BY a.city ORDER BY count DESC" +
            "</script>")
    List<RegionCountVO> countByRegion(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT date_format(create_time, '%Y-%m-%d') as date, COUNT(*) as count FROM ims_order " +
            "<where>" +
            "<if test='startDate != null and startDate!=\"\"'> AND create_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND create_time &lt;= #{endDate}</if>" +
            "</where>" +
            "GROUP BY date_format(create_time, '%Y-%m-%d') ORDER BY date" +
            "</script>")
    List<TrendVO> getTrend(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("type") String type);
}
```

### 7.1.3 电工管理 Mapper

```java
package com.andiantong.ims.service.electrician.mapper;

import com.andiantong.ims.service.electrician.entity.Electrician;
import com.andiantong.ims.service.electrician.dto.ElectricianQueryDTO;
import com.andiantong.ims.service.electrician.vo.ElectricianVO;
import com.andiantong.ims.service.electrician.vo.ElectricianDetailVO;
import com.andiantong.ims.service.electrician.vo.ElectricianRankingVO;
import com.andiantong.ims.service.electrician.vo.ScoreVO;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface ElectricianMapper {

    @Select("<script>" +
            "SELECT e.*, c.name as category_name, s.name as service_name " +
            "FROM ims_electrician e " +
            "LEFT JOIN ims_service_category c ON e.main_category_id = c.id " +
            "LEFT JOIN ims_service s ON e.main_service_id = s.id " +
            "<where>" +
            "<if test='query.name != null and query.name!=\"\"'> AND e.name LIKE CONCAT('%', #{query.name}, '%')</if>" +
            "<if test='query.phone != null and query.phone!=\"\"'> AND e.phone LIKE CONCAT('%', #{query.phone}, '%')</if>" +
            "<if test='query.status != null'> AND e.status = #{query.status}</if>" +
            "<if test='query.certified != null'> AND e.certified = #{query.certified}</if>" +
            "<if test='query.mainCategoryId != null'> AND e.main_category_id = #{query.mainCategoryId}</if>" +
            "<if test='query.startDate != null and query.startDate!=\"\"'> AND e.create_time >= #{query.startDate}</if>" +
            "<if test='query.endDate != null and query.endDate!=\"\"'> AND e.create_time &lt;= #{query.endDate}</if>" +
            "</where>" +
            "ORDER BY e.create_time DESC" +
            "</script>")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "age", column = "age"),
        @Result(property = "certificateNo", column = "certificate_no"),
        @Result(property = "certificateImage", column = "certificate_image"),
        @Result(property = "mainCategoryId", column = "main_category_id"),
        @Result(property = "mainServiceId", column = "main_service_id"),
        @Result(property = "status", column = "status"),
        @Result(property = "certified", column = "certified"),
        @Result(property = "rating", column = "rating"),
        @Result(property = "orderCount", column = "order_count"),
        @Result(property = "totalIncome", column = "total_income"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "categoryName", column = "category_name"),
        @Result(property = "serviceName", column = "service_name")
    })
    List<ElectricianVO> selectByCondition(@Param("query") ElectricianQueryDTO query);

    @Select("SELECT e.*, c.name as category_name, s.name as service_name " +
            "FROM ims_electrician e " +
            "LEFT JOIN ims_service_category c ON e.main_category_id = c.id " +
            "LEFT JOIN ims_service s ON e.main_service_id = s.id " +
            "WHERE e.id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "age", column = "age"),
        @Result(property = "certificateNo", column = "certificate_no"),
        @Result(property = "certificateImage", column = "certificate_image"),
        @Result(property = "mainCategoryId", column = "main_category_id"),
        @Result(property = "mainServiceId", column = "main_service_id"),
        @Result(property = "status", column = "status"),
        @Result(property = "certified", column = "certified"),
        @Result(property = "rating", column = "rating"),
        @Result(property = "orderCount", column = "order_count"),
        @Result(property = "totalIncome", column = "total_income"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "categoryName", column = "category_name"),
        @Result(property = "serviceName", column = "service_name")
    })
    ElectricianDetailVO selectDetailById(@Param("id") Long id);

    @Insert("INSERT INTO ims_electrician(name, phone, avatar, gender, age, certificate_no, certificate_image, main_category_id, main_service_id, status, certified, rating, order_count, total_income, create_time, update_time) " +
            "VALUES(#{name}, #{phone}, #{avatar}, #{gender}, #{age}, #{certificateNo}, #{certificateImage}, #{mainCategoryId}, #{mainServiceId}, #{status}, #{certified}, #{rating}, #{orderCount}, #{totalIncome}, #{createTime}, #{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Electrician electrician);

    @Update("UPDATE ims_electrician SET name=#{name}, phone=#{phone}, avatar=#{avatar}, gender=#{gender}, age=#{age}, " +
            "certificate_no=#{certificateNo}, certificate_image=#{certificateImage}, main_category_id=#{mainCategoryId}, " +
            "main_service_id=#{mainServiceId}, status=#{status}, certified=#{certified}, rating=#{rating}, " +
            "order_count=#{orderCount}, total_income=#{totalIncome}, update_time=#{updateTime} WHERE id=#{id}")
    int update(Electrician electrician);

    @Update("UPDATE ims_electrician SET rating=#{rating}, update_time=#{updateTime} WHERE id=#{id}")
    int updateRating(@Param("id") Long id, @Param("rating") java.math.BigDecimal rating, @Param("updateTime") java.util.Date updateTime);

    @Update("UPDATE ims_electrician SET order_count=order_count+1, update_time=#{updateTime} WHERE id=#{id}")
    int incrementOrderCount(@Param("id") Long id, @Param("updateTime") java.util.Date updateTime);

    @Update("UPDATE ims_electrician SET total_income=total_income+#{amount}, update_time=#{updateTime} WHERE id=#{id}")
    int addIncome(@Param("id") Long id, @Param("amount") java.math.BigDecimal amount, @Param("updateTime") java.util.Date updateTime);

    @Delete("UPDATE ims_electrician SET status=0, update_time=#{updateTime} WHERE id=#{id}")
    int deleteById(@Param("id") Long id, @Param("updateTime") java.util.Date updateTime);

    @Select("SELECT COUNT(*) FROM ims_electrician WHERE status = 1")
    int countActive();

    @Select("SELECT COUNT(*) FROM ims_electrician WHERE status = 1 AND DATE(create_time) = CURDATE()")
    int countToday();

    @Select("SELECT COUNT(*) FROM ims_electrician WHERE status = 1 AND DATE(create_time) >= #{startDate} AND DATE(create_time) <= #{endDate}")
    int countByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT e.id, e.name, e.avatar, e.rating, e.order_count, e.total_income, COUNT(o.id) as order_count " +
            "FROM ims_electrician e " +
            "LEFT JOIN ims_order o ON e.id = o.electrician_id AND o.status IN (6, 5) " +
            "<where>" +
            "e.status = 1 " +
            "<if test='startDate != null and startDate!=\"\"'> AND o.create_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND o.create_time &lt;= #{endDate}</if>" +
            "</where>" +
            "GROUP BY e.id, e.name, e.avatar, e.rating, e.order_count, e.total_income " +
            "ORDER BY order_count DESC LIMIT #{limit}" +
            "</script>")
    List<ElectricianRankingVO> getRanking(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("limit") Integer limit);

    @Select("SELECT FLOOR(rating / 0.5) * 0.5 as score_range, COUNT(*) as count FROM ims_electrician WHERE status = 1 GROUP BY FLOOR(rating / 0.5) * 0.5 ORDER BY score_range")
    List<ScoreVO> countByScore();

    @Select("SELECT * FROM ims_electrician WHERE status = 1 AND certified = 1 ORDER BY rating DESC, order_count DESC")
    List<Electrician> selectRecommended();

    @Select("SELECT * FROM ims_electrician WHERE status = 1 AND certified = 1 " +
            "AND (6371 * acos(cos(#{latitude}) * cos(latitude) * cos(longitude - #{longitude}) + sin(#{latitude}) * sin(latitude))) <= #{radiusKm} " +
            "ORDER BY rating DESC")
    List<Electrician> selectNearby(@Param("latitude") java.math.BigDecimal latitude, @Param("longitude") java.math.BigDecimal longitude, @Param("radiusKm") Double radiusKm);
}
```

### 7.1.4 支付管理 Mapper

```java
package com.andiantong.ims.service.payment.mapper;

import com.andiantong.ims.service.payment.entity.Payment;
import com.andiantong.ims.service.payment.dto.PaymentQueryDTO;
import com.andiantong.ims.service.payment.vo.PaymentVO;
import com.andiantong.ims.service.payment.vo.TrendVO;
import com.andiantong.ims.service.payment.vo.PaymentCountVO;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface PaymentMapper {

    @Select("<script>" +
            "SELECT p.*, o.order_no, u.nickname as user_nickname, u.phone as user_phone " +
            "FROM ims_payment p " +
            "LEFT JOIN ims_order o ON p.order_id = o.id " +
            "LEFT JOIN ims_user u ON p.user_id = u.id " +
            "<where>" +
            "<if test='query.orderNo != null and query.orderNo!=\"\"'> AND o.order_no LIKE CONCAT('%', #{query.orderNo}, '%')</if>" +
            "<if test='query.userId != null'> AND p.user_id = #{query.userId}</if>" +
            "<if test='query.payType != null'> AND p.pay_type = #{query.payType}</if>" +
            "<if test='query.status != null'> AND p.status = #{query.status}</if>" +
            "<if test='query.startDate != null and query.startDate!=\"\"'> AND p.pay_time >= #{query.startDate}</if>" +
            "<if test='query.endDate != null and query.endDate!=\"\"'> AND p.pay_time &lt;= #{query.endDate}</if>" +
            "</where>" +
            "ORDER BY p.pay_time DESC" +
            "</script>")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "orderId", column = "order_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "amount", column = "amount"),
        @Result(property = "payType", column = "pay_type"),
        @Result(property = "payTime", column = "pay_time"),
        @Result(property = "transactionId", column = "transaction_id"),
        @Result(property = "status", column = "status"),
        @Result(property = "remark", column = "remark"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "orderNo", column = "order_no"),
        @Result(property = "userNickname", column = "user_nickname"),
        @Result(property = "userPhone", column = "user_phone")
    })
    List<PaymentVO> selectByCondition(@Param("query") PaymentQueryDTO query);

    @Select("SELECT * FROM ims_payment WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "orderId", column = "order_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "amount", column = "amount"),
        @Result(property = "payType", column = "pay_type"),
        @Result(property = "payTime", column = "pay_time"),
        @Result(property = "transactionId", column = "transaction_id"),
        @Result(property = "status", column = "status"),
        @Result(property = "remark", column = "remark"),
        @Result(property = "createTime", column = "create_time")
    })
    Payment selectById(@Param("id") Long id);

    @Select("SELECT * FROM ims_payment WHERE order_id = #{orderId}")
    Payment selectByOrderId(@Param("orderId") Long orderId);

    @Insert("INSERT INTO ims_payment(order_id, user_id, amount, pay_type, status, remark, create_time) " +
            "VALUES(#{orderId}, #{userId}, #{amount}, #{payType}, #{status}, #{remark}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Payment payment);

    @Update("UPDATE ims_payment SET status=#{status}, pay_time=#{payTime}, transaction_id=#{transactionId}, remark=#{remark} WHERE id=#{id}")
    int update(Payment payment);

    @Select("SELECT IFNULL(SUM(amount), 0) FROM ims_payment WHERE status = 2 AND DATE(pay_time) = CURDATE()")
    java.math.BigDecimal sumToday();

    @Select("SELECT IFNULL(SUM(amount), 0) FROM ims_payment WHERE status = 2 AND DATE(pay_time) >= #{startDate} AND DATE(pay_time) <= #{endDate}")
    java.math.BigDecimal sumByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("SELECT COUNT(*) FROM ims_payment WHERE status = 2 AND DATE(pay_time) >= #{startDate} AND DATE(pay_time) <= #{endDate}")
    int countByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT date_format(pay_time, '%Y-%m-%d') as date, IFNULL(SUM(amount), 0) as amount FROM ims_payment " +
            "WHERE status = 2 " +
            "<if test='startDate != null and startDate!=\"\"'> AND pay_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND pay_time &lt;= #{endDate}</if>" +
            "GROUP BY date_format(pay_time, '%Y-%m-%d') ORDER BY date" +
            "</script>")
    List<TrendVO> getTrend(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT pay_type as payment_type, COUNT(*) as count, IFNULL(SUM(amount), 0) as amount FROM ims_payment " +
            "WHERE status = 2 " +
            "<if test='startDate != null and startDate!=\"\"'> AND pay_time >= #{startDate}</if>" +
            "<if test='endDate != null and endDate!=\"\"'> AND pay_time &lt;= #{endDate}</if>" +
            "GROUP BY pay_type" +
            "</script>")
    List<PaymentCountVO> countByPayment(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
```

## 7.2 MyBatis XML 映射文件

### 7.2.1 用户管理 XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.andiantong.ims.service.user.mapper.UserMapper">

    <resultMap id="BaseResultMap" type="com.andiantong.ims.service.user.entity.User">
        <id column="id" property="id" jdbcType="BIGINT"/>
        <result column="username" property="username" jdbcType="VARCHAR"/>
        <result column="password" property="password" jdbcType="VARCHAR"/>
        <result column="nickname" property="nickname" jdbcType="VARCHAR"/>
        <result column="phone" property="phone" jdbcType="VARCHAR"/>
        <result column="email" property="email" jdbcType="VARCHAR"/>
        <result column="avatar" property="avatar" jdbcType="VARCHAR"/>
        <result column="gender" property="gender" jdbcType="TINYINT"/>
        <result column="birthday" property="birthday" jdbcType="DATE"/>
        <result column="status" property="status" jdbcType="TINYINT"/>
        <result column="user_type" property="userType" jdbcType="TINYINT"/>
        <result column="last_login_time" property="lastLoginTime" jdbcType="TIMESTAMP"/>
        <result column="last_login_ip" property="lastLoginIp" jdbcType="VARCHAR"/>
        <result column="create_time" property="createTime" jdbcType="TIMESTAMP"/>
        <result column="update_time" property="updateTime" jdbcType="TIMESTAMP"/>
    </resultMap>

    <resultMap id="VOResultMap" type="com.andiantong.ims.service.user.vo.UserVO" extends="BaseResultMap">
        <result column="role_name" property="roleName" jdbcType="VARCHAR"/>
        <result column="role_code" property="roleCode" jdbcType="VARCHAR"/>
    </resultMap>

    <sql id="Base_Column_List">
        id, username, password, nickname, phone, email, avatar, gender, birthday, 
        status, user_type, last_login_time, last_login_ip, create_time, update_time
    </sql>

    <select id="selectByCondition" resultMap="VOResultMap">
        SELECT u.*, r.role_name, r.role_code 
        FROM ims_user u 
        LEFT JOIN ims_user_role ur ON u.id = ur.user_id 
        LEFT JOIN ims_role r ON ur.role_id = r.id 
        <where>
            <if test="query.username != null and query.username != ''">
                AND u.username LIKE CONCAT('%', #{query.username}, '%')
            </if>
            <if test="query.nickname != null and query.nickname != ''">
                AND u.nickname LIKE CONCAT('%', #{query.nickname}, '%')
            </if>
            <if test="query.phone != null and query.phone != ''">
                AND u.phone LIKE CONCAT('%', #{query.phone}, '%')
            </if>
            <if test="query.status != null">
                AND u.status = #{query.status}
            </if>
            <if test="query.userType != null">
                AND u.user_type = #{query.userType}
            </if>
            <if test="query.startDate != null and query.startDate != ''">
                AND u.create_time &gt;= #{query.startDate}
            </if>
            <if test="query.endDate != null and query.endDate != ''">
                AND u.create_time &lt;= #{query.endDate}
            </if>
        </where>
        ORDER BY u.create_time DESC
    </select>

    <select id="selectById" resultMap="BaseResultMap">
        SELECT <include refid="Base_Column_List"/>
        FROM ims_user 
        WHERE id = #{id}
    </select>

    <select id="selectByUsername" resultMap="BaseResultMap">
        SELECT <include refid="Base_Column_List"/>
        FROM ims_user 
        WHERE username = #{username}
    </select>

    <select id="selectByPhone" resultMap="BaseResultMap">
        SELECT <include refid="Base_Column_List"/>
        FROM ims_user 
        WHERE phone = #{phone}
    </select>

    <insert id="insert" parameterType="com.andiantong.ims.service.user.entity.User" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO ims_user(
            username, password, nickname, phone, email, avatar, gender, birthday, 
            status, user_type, create_time, update_time
        ) VALUES (
            #{username}, #{password}, #{nickname}, #{phone}, #{email}, #{avatar}, #{gender}, #{birthday}, 
            #{status}, #{userType}, #{createTime}, #{updateTime}
        )
    </insert>

    <update id="update" parameterType="com.andiantong.ims.service.user.entity.User">
        UPDATE ims_user SET
            username = #{username},
            nickname = #{nickname},
            phone = #{phone},
            email = #{email},
            avatar = #{avatar},
            gender = #{gender},
            birthday = #{birthday},
            status = #{status},
            user_type = #{userType},
            update_time = #{updateTime}
        WHERE id = #{id}
    </update>

    <update id="updatePassword">
        UPDATE ims_user SET
            password = #{password},
            update_time = #{updateTime}
        WHERE id = #{id}
    </update>

    <update id="updateLoginInfo">
        UPDATE ims_user SET
            last_login_time = #{lastLoginTime},
            last_login_ip = #{lastLoginIp}
        WHERE id = #{id}
    </update>

    <delete id="deleteById">
        UPDATE ims_user SET 
            status = 0, 
            update_time = #{updateTime} 
        WHERE id = #{id}
    </delete>

    <select id="countActive" resultType="int">
        SELECT COUNT(*) FROM ims_user WHERE status = 1
    </select>

    <select id="countByDate" resultType="int">
        SELECT COUNT(*) FROM ims_user 
        WHERE create_time &gt;= #{startDate} AND create_time &lt;= #{endDate}
    </select>

    <select id="countActiveByDate" resultType="int">
        SELECT COUNT(*) FROM ims_user WHERE status = 1
        <if test="startDate != null and startDate != ''">
            AND last_login_time &gt;= #{startDate}
        </if>
        <if test="endDate != null and endDate != ''">
            AND last_login_time &lt;= #{endDate}
        </if>
    </select>

    <select id="getGrowth" resultType="com.andiantong.ims.service.statistics.vo.GrowthVO">
        SELECT 
            date_format(create_time, '%Y-%m-%d') as date, 
            COUNT(*) as count 
        FROM ims_user 
        <where>
            <if test="startDate != null and startDate != ''">
                AND create_time &gt;= #{startDate}
            </if>
            <if test="endDate != null and endDate != ''">
                AND create_time &lt;= #{endDate}
            </if>
        </where>
        GROUP BY date_format(create_time, '%Y-%m-%d') 
        ORDER BY date
    </select>

    <select id="countBySource" resultType="com.andiantong.ims.service.statistics.vo.SourceCountVO">
        SELECT source, COUNT(*) as count 
        FROM ims_user WHERE status = 1 
        GROUP BY source
    </select>

</mapper>
```

### 7.2.2 订单管理 XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.andiantong.ims.service.order.mapper.OrderMapper">

    <resultMap id="BaseResultMap" type="com.andiantong.ims.service.order.entity.Order">
        <id column="id" property="id" jdbcType="BIGINT"/>
        <result column="order_no" property="orderNo" jdbcType="VARCHAR"/>
        <result column="user_id" property="userId" jdbcType="BIGINT"/>
        <result column="service_id" property="serviceId" jdbcType="BIGINT"/>
        <result column="electrician_id" property="electricianId" jdbcType="BIGINT"/>
        <result column="service_amount" property="serviceAmount" jdbcType="DECIMAL"/>
        <result column="material_amount" property="materialAmount" jdbcType="DECIMAL"/>
        <result column="discount_amount" property="discountAmount" jdbcType="DECIMAL"/>
        <result column="total_amount" property="totalAmount" jdbcType="DECIMAL"/>
        <result column="pay_amount" property="payAmount" jdbcType="DECIMAL"/>
        <result column="pay_type" property="payType" jdbcType="TINYINT"/>
        <result column="pay_time" property="payTime" jdbcType="TIMESTAMP"/>
        <result column="status" property="status" jdbcType="TINYINT"/>
        <result column="book_date" property="bookDate" jdbcType="VARCHAR"/>
        <result column="book_time" property="bookTime" jdbcType="VARCHAR"/>
        <result column="service_start_time" property="serviceStartTime" jdbcType="TIMESTAMP"/>
        <result column="service_end_time" property="serviceEndTime" jdbcType="TIMESTAMP"/>
        <result column="service_duration" property="serviceDuration" jdbcType="INTEGER"/>
        <result column="remark" property="remark" jdbcType="VARCHAR"/>
        <result column="create_time" property="createTime" jdbcType="TIMESTAMP"/>
        <result column="update_time" property="updateTime" jdbcType="TIMESTAMP"/>
    </resultMap>

    <resultMap id="VOResultMap" type="com.andiantong.ims.service.order.vo.OrderVO" extends="BaseResultMap">
        <result column="user_nickname" property="userNickname" jdbcType="VARCHAR"/>
        <result column="user_phone" property="userPhone" jdbcType="VARCHAR"/>
        <result column="user_avatar" property="userAvatar" jdbcType="VARCHAR"/>
        <result column="service_name" property="serviceName" jdbcType="VARCHAR"/>
        <result column="service_image" property="serviceImage" jdbcType="VARCHAR"/>
        <result column="category_name" property="categoryName" jdbcType="VARCHAR"/>
        <result column="electrician_name" property="electricianName" jdbcType="VARCHAR"/>
        <result column="electrician_phone" property="electricianPhone" jdbcType="VARCHAR"/>
        <result column="electrician_avatar" property="electricianAvatar" jdbcType="VARCHAR"/>
        <result column="province" property="province" jdbcType="VARCHAR"/>
        <result column="city" property="city" jdbcType="VARCHAR"/>
        <result column="district" property="district" jdbcType="VARCHAR"/>
        <result column="address_detail" property="addressDetail" jdbcType="VARCHAR"/>
        <result column="latitude" property="latitude" jdbcType="DECIMAL"/>
        <result column="longitude" property="longitude" jdbcType="DECIMAL"/>
    </resultMap>

    <resultMap id="DetailResultMap" type="com.andiantong.ims.service.order.vo.OrderDetailVO" extends="VOResultMap">
        <collection property="materials" ofType="com.andiantong.ims.service.order.entity.OrderMaterial">
            <id column="material_id" property="id" jdbcType="BIGINT"/>
            <result column="material_name" property="name" jdbcType="VARCHAR"/>
            <result column="material_quantity" property="quantity" jdbcType="INTEGER"/>
            <result column="material_price" property="price" jdbcType="DECIMAL"/>
        </collection>
        <collection property="logs" ofType="com.andiantong.ims.service.order.entity.OrderLog">
            <id column="log_id" property="id" jdbcType="BIGINT"/>
            <result column="log_action" property="action" jdbcType="VARCHAR"/>
            <result column="log_time" property="time" jdbcType="TIMESTAMP"/>
            <result column="log_operator" property="operator" jdbcType="VARCHAR"/>
        </collection>
    </resultMap>

    <sql id="Base_Column_List">
        o.id, o.order_no, o.user_id, o.service_id, o.electrician_id, o.service_amount, 
        o.material_amount, o.discount_amount, o.total_amount, o.pay_amount, o.pay_type, 
        o.pay_time, o.status, o.book_date, o.book_time, o.service_start_time, 
        o.service_end_time, o.service_duration, o.remark, o.create_time, o.update_time
    </sql>

    <select id="selectByCondition" resultMap="VOResultMap">
        SELECT 
            <include refid="Base_Column_List"/>,
            u.nickname as user_nickname, 
            u.phone as user_phone, 
            u.avatar as user_avatar,
            s.name as service_name, 
            s.image_url as service_image, 
            sc.name as category_name,
            e.name as electrician_name, 
            e.phone as electrician_phone, 
            e.avatar as electrician_avatar,
            a.province, a.city, a.district, a.detail as address_detail, 
            a.latitude, a.longitude
        FROM ims_order o
        LEFT JOIN ims_user u ON o.user_id = u.id
        LEFT JOIN ims_service s ON o.service_id = s.id
        LEFT JOIN ims_service_category sc ON s.category_id = sc.id
        LEFT JOIN ims_electrician e ON o.electrician_id = e.id
        LEFT JOIN ims_order_address a ON o.id = a.order_id
        <where>
            <if test="query.orderNo != null and query.orderNo != ''">
                AND o.order_no LIKE CONCAT('%', #{query.orderNo}, '%')
            </if>
            <if test="query.userId != null">
                AND o.user_id = #{query.userId}
            </if>
            <if test="query.electricianId != null">
                AND o.electrician_id = #{query.electricianId}
            </if>
            <if test="query.status != null">
                AND o.status = #{query.status}
            </if>
            <if test="query.serviceId != null">
                AND o.service_id = #{query.serviceId}
            </if>
            <if test="query.serviceCategoryId != null">
                AND s.category_id = #{query.serviceCategoryId}
            </if>
            <if test="query.startDate != null and query.startDate != ''">
                AND o.create_time &gt;= #{query.startDate}
            </if>
            <if test="query.endDate != null and query.endDate != ''">
                AND o.create_time &lt;= #{query.endDate}
            </if>
        </where>
        ORDER BY o.create_time DESC
    </select>

    <select id="selectDetailById" resultMap="DetailResultMap">
        SELECT 
            <include refid="Base_Column_List"/>,
            u.nickname as user_nickname, 
            u.phone as user_phone, 
            u.avatar as user_avatar,
            s.name as service_name, 
            s.image_url as service_image, 
            sc.name as category_name,
            e.name as electrician_name, 
            e.phone as electrician_phone, 
            e.avatar as electrician_avatar,
            a.province, a.city, a.district, a.detail as address_detail, 
            a.latitude, a.longitude,
            om.id as material_id, om.name as material_name, om.quantity as material_quantity, om.price as material_price,
            ol.id as log_id, ol.action as log_action, ol.create_time as log_time, ol.operator as log_operator
        FROM ims_order o
        LEFT JOIN ims_user u ON o.user_id = u.id
        LEFT JOIN ims_service s ON o.service_id = s.id
        LEFT JOIN ims_service_category sc ON s.category_id = sc.id
        LEFT JOIN ims_electrician e ON o.electrician_id = e.id
        LEFT JOIN ims_order_address a ON o.id = a.order_id
        LEFT JOIN ims_order_material om ON o.id = om.order_id
        LEFT JOIN ims_order_log ol ON o.id = ol.order_id
        WHERE o.id = #{id}
    </select>

    <insert id="insert" parameterType="com.andiantong.ims.service.order.entity.Order" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO ims_order(
            order_no, user_id, service_id, service_amount, material_amount, discount_amount, 
            total_amount, pay_amount, book_date, book_time, status, remark, create_time, update_time
        ) VALUES (
            #{orderNo}, #{userId}, #{serviceId}, #{serviceAmount}, #{materialAmount}, #{discountAmount}, 
            #{totalAmount}, #{payAmount}, #{bookDate}, #{bookTime}, #{status}, #{remark}, #{createTime}, #{updateTime}
        )
    </insert>

    <update id="update" parameterType="com.andiantong.ims.service.order.entity.Order">
        UPDATE ims_order SET
            status = #{status},
            <if test="payTime != null">pay_time = #{payTime},</if>
            <if test="electricianId != null">electrician_id = #{electricianId},</if>
            <if test="serviceStartTime != null">service_start_time = #{serviceStartTime},</if>
            <if test="serviceEndTime != null">service_end_time = #{serviceEndTime},</if>
            <if test="serviceDuration != null">service_duration = #{serviceDuration},</if>
            update_time = #{updateTime}
        WHERE id = #{id}
    </update>

    <update id="updateStatus">
        UPDATE ims_order SET
            status = #{status},
            update_time = #{updateTime}
        WHERE id = #{id}
    </update>

    <update id="cancelById">
        UPDATE ims_order SET
            status = 7,
            update_time = #{updateTime}
        WHERE id = #{id}
    </update>

    <select id="countToday" resultType="int">
        SELECT COUNT(*) FROM ims_order WHERE status = 1 AND DATE(create_time) = CURDATE()
    </select>

    <select id="countAll" resultType="int">
        SELECT COUNT(*) FROM ims_order WHERE status = 1
    </select>

    <select id="countByDate" resultType="int">
        SELECT COUNT(*) FROM ims_order WHERE status = 1 AND DATE(create_time) &gt;= #{startDate} AND DATE(create_time) &lt;= #{endDate}
    </select>

    <select id="sumAmountByDate" resultType="java.math.BigDecimal">
        SELECT IFNULL(SUM(total_amount), 0) FROM ims_order 
        WHERE status IN (6, 5) AND DATE(create_time) &gt;= #{startDate} AND DATE(create_time) &lt;= #{endDate}
    </select>

    <select id="avgAmountByDate" resultType="java.math.BigDecimal">
        SELECT IFNULL(AVG(total_amount), 0) FROM ims_order 
        WHERE status IN (6, 5) AND DATE(create_time) &gt;= #{startDate} AND DATE(create_time) &lt;= #{endDate}
    </select>

    <select id="countByStatus" resultType="com.andiantong.ims.service.order.vo.StatusCountVO">
        SELECT status as status, COUNT(*) as count FROM ims_order
        <where>
            <if test="startDate != null and startDate != ''">
                AND create_time &gt;= #{startDate}
            </if>
            <if test="endDate != null and endDate != ''">
                AND create_time &lt;= #{endDate}
            </if>
        </where>
        GROUP BY status
    </select>

    <select id="countByService" resultType="com.andiantong.ims.service.order.vo.ServiceCountVO">
        SELECT sc.name as service_name, COUNT(*) as count 
        FROM ims_order o
        LEFT JOIN ims_service s ON o.service_id = s.id
        LEFT JOIN ims_service_category sc ON s.category_id = sc.id
        <where>
            <if test="startDate != null and startDate != ''">
                AND o.create_time &gt;= #{startDate}
            </if>
            <if test="endDate != null and endDate != ''">
                AND o.create_time &lt;= #{endDate}
            </if>
        </where>
        GROUP BY sc.id, sc.name ORDER BY count DESC
    </select>

    <select id="countByRegion" resultType="com.andiantong.ims.service.order.vo.RegionCountVO">
        SELECT a.city as region_name, COUNT(*) as count 
        FROM ims_order o
        LEFT JOIN ims_order_address a ON o.id = a.order_id
        <where>
            a.city IS NOT NULL
            <if test="startDate != null and startDate != ''">
                AND o.create_time &gt;= #{startDate}
            </if>
            <if test="endDate != null and endDate != ''">
                AND o.create_time &lt;= #{endDate}
            </if>
        </where>
        GROUP BY a.city ORDER BY count DESC
    </select>

    <select id="getTrend" resultType="com.andiantong.ims.service.order.vo.TrendVO">
        SELECT date_format(create_time, '%Y-%m-%d') as date, COUNT(*) as count 
        FROM ims_order
        <where>
            <if test="startDate != null and startDate != ''">
                AND create_time &gt;= #{startDate}
            </if>
            <if test="endDate != null and endDate != ''">
                AND create_time &lt;= #{endDate}
            </if>
        </where>
        GROUP BY date_format(create_time, '%Y-%m-%d') 
        ORDER BY date
    </select>

</mapper>
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(content)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
