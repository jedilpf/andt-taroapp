import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

inventory_service = '''
## 5.18 库存管理服务 (Inventory Service)

### 5.18.1 库存管理控制器

```java
package com.andiantong.ims.service.inventory.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.inventory.dto.*;
import com.andiantong.ims.service.inventory.entity.*;
import com.andiantong.ims.service.inventory.service.*;
import com.andiantong.ims.service.inventory.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private WarehouseService warehouseService;

    @Autowired
    private InventoryRecordService inventoryRecordService;

    @Autowired
    private InventoryAlertService inventoryAlertService;

    @Autowired
    private InventoryCheckService inventoryCheckService;

    @GetMapping("/list")
    public Result<PageVO<InventoryVO>> list(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String productCode,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        InventoryQueryDTO query = new InventoryQueryDTO();
        query.setWarehouseId(warehouseId);
        query.setProductName(productName);
        query.setProductCode(productCode);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(inventoryService.queryPage(query));
    }

    @GetMapping("/{id}")
    public Result<InventoryDetailVO> getById(@PathVariable Long id) {
        return Result.success(inventoryService.getDetailById(id));
    }

    @PostMapping
    public Result<Void> add(@Valid @RequestBody InventoryAddDTO dto) {
        inventoryService.add(dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody InventoryUpdateDTO dto) {
        dto.setId(id);
        inventoryService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return Result.success();
    }

    @PostMapping("/adjust")
    public Result<Void> adjust(@Valid @RequestBody InventoryAdjustDTO dto) {
        inventoryService.adjust(dto);
        return Result.success();
    }

    @PostMapping("/transfer")
    public Result<Void> transfer(@Valid @RequestBody InventoryTransferDTO dto) {
        inventoryService.transfer(dto);
        return Result.success();
    }

    @GetMapping("/warehouse/list")
    public Result<List<WarehouseVO>> listWarehouse(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer status) {
        WarehouseQueryDTO query = new WarehouseQueryDTO();
        query.setProvince(province);
        query.setCity(city);
        query.setStatus(status);
        return Result.success(warehouseService.list(query));
    }

    @PostMapping("/warehouse")
    public Result<Long> addWarehouse(@Valid @RequestBody WarehouseAddDTO dto) {
        return Result.success(warehouseService.add(dto));
    }

    @PutMapping("/warehouse/{id}")
    public Result<Void> updateWarehouse(@PathVariable Long id, @Valid @RequestBody WarehouseUpdateDTO dto) {
        dto.setId(id);
        warehouseService.update(dto);
        return Result.success();
    }

    @GetMapping("/record/list")
    public Result<PageVO<InventoryRecordVO>> listRecord(
            @RequestParam(required = false) String inventoryId,
            @RequestParam(required = false) Integer recordType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        InventoryRecordQueryDTO query = new InventoryRecordQueryDTO();
        query.setInventoryId(inventoryId);
        query.setRecordType(recordType);
        query.setStartDate(startDate);
        query.setEndDate(endDate);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(inventoryRecordService.queryPage(query));
    }

    @GetMapping("/alert/list")
    public Result<PageVO<InventoryAlertVO>> listAlert(
            @RequestParam(required = false) Integer alertType,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        InventoryAlertQueryDTO query = new InventoryAlertQueryDTO();
        query.setAlertType(alertType);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(inventoryAlertService.queryPage(query));
    }

    @PostMapping("/alert/{id}/handle")
    public Result<Void> handleAlert(@PathVariable Long id, @RequestBody Map<String, String> params) {
        inventoryAlertService.handle(id, params.get("remark"));
        return Result.success();
    }

    @PostMapping("/check")
    public Result<Long> createCheck(@Valid @RequestBody InventoryCheckCreateDTO dto) {
        return Result.success(inventoryCheckService.create(dto));
    }

    @GetMapping("/check/{id}")
    public Result<InventoryCheckDetailVO> getCheckDetail(@PathVariable Long id) {
        return Result.success(inventoryCheckService.getDetailById(id));
    }

    @PostMapping("/check/{id}/execute")
    public Result<Void> executeCheck(@PathVariable Long id) {
        inventoryCheckService.execute(id);
        return Result.success();
    }

    @PostMapping("/check/{id}/confirm")
    public Result<Void> confirmCheck(@PathVariable Long id, @Valid @RequestBody InventoryCheckConfirmDTO dto) {
        dto.setCheckId(id);
        inventoryCheckService.confirm(dto);
        return Result.success();
    }

    @GetMapping("/statistics/stock")
    public Result<InventoryStatisticsVO> getStockStatistics() {
        return Result.success(inventoryService.getStatistics());
    }

    @GetMapping("/statistics/low-stock")
    public Result<List<InventoryAlertVO>> getLowStockList() {
        return Result.success(inventoryAlertService.getLowStockList());
    }

    @GetMapping("/statistics/expiring")
    public Result<List<InventoryVO>> getExpiringList(@RequestParam(defaultValue = "30") Integer days) {
        return Result.success(inventoryService.getExpiringList(days));
    }
}
```

### 5.18.2 库存服务实现

```java
@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryMapper inventoryMapper;

    @Autowired
    private InventoryRecordService inventoryRecordService;

    @Autowired
    private InventoryAlertService inventoryAlertService;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public PageVO<InventoryVO> queryPage(InventoryQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<Inventory> list = inventoryMapper.selectByCondition(query);
        PageInfo<Inventory> pageInfo = new PageInfo<>(list);
        List<InventoryVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public InventoryDetailVO getDetailById(Long id) {
        Inventory entity = inventoryMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("库存记录不存在");
        }
        InventoryDetailVO vo = toDetailVO(entity);
        List<InventoryRecord> records = inventoryRecordService.getByInventoryId(id);
        vo.setRecords(records.stream().map(this::toRecordVO).collect(Collectors.toList()));
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(InventoryAddDTO dto) {
        Inventory entity = new Inventory();
        entity.setWarehouseId(dto.getWarehouseId());
        entity.setProductId(dto.getProductId());
        entity.setQuantity(dto.getQuantity());
        entity.setAvailableQuantity(dto.getQuantity());
        entity.setLockedQuantity(0);
        entity.setWarningQuantity(dto.getWarningQuantity());
        entity.setStatus(1);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        inventoryMapper.insert(entity);
        inventoryRecordService.add(entity, 1, dto.getQuantity(), "初始入库", null);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(InventoryUpdateDTO dto) {
        Inventory entity = inventoryMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("库存记录不存在");
        }
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdateTime(new Date());
        inventoryMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Inventory entity = inventoryMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("库存记录不存在");
        }
        if (entity.getAvailableQuantity() < entity.getQuantity()) {
            throw new BusinessException("该库存有锁定数量，无法删除");
        }
        entity.setStatus(0);
        entity.setUpdateTime(new Date());
        inventoryMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void adjust(InventoryAdjustDTO dto) {
        Inventory entity = inventoryMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("库存记录不存在");
        }
        Integer diff = dto.getNewQuantity() - entity.getQuantity();
        entity.setQuantity(dto.getNewQuantity());
        entity.setAvailableQuantity(entity.getAvailableQuantity() + diff);
        entity.setUpdateTime(new Date());
        inventoryMapper.update(entity);
        inventoryRecordService.add(entity, 3, diff, dto.getReason(), null);
        if (entity.getAvailableQuantity() <= entity.getWarningQuantity()) {
            inventoryAlertService.createLowStockAlert(entity);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void transfer(InventoryTransferDTO dto) {
        Inventory source = inventoryMapper.selectById(dto.getSourceInventoryId());
        if (source == null) {
            throw new BusinessException("源库存不存在");
        }
        if (source.getAvailableQuantity() < dto.getQuantity()) {
            throw new BusinessException("可用库存不足");
        }
        Inventory target = inventoryMapper.selectByWarehouseAndProduct(
                dto.getTargetWarehouseId(), source.getProductId());
        if (target == null) {
            target = new Inventory();
            target.setWarehouseId(dto.getTargetWarehouseId());
            target.setProductId(source.getProductId());
            target.setQuantity(dto.getQuantity());
            target.setAvailableQuantity(dto.getQuantity());
            target.setLockedQuantity(0);
            target.setWarningQuantity(source.getWarningQuantity());
            target.setStatus(1);
            target.setCreateTime(new Date());
            target.setUpdateTime(new Date());
            inventoryMapper.insert(target);
        } else {
            target.setQuantity(target.getQuantity() + dto.getQuantity());
            target.setAvailableQuantity(target.getAvailableQuantity() + dto.getQuantity());
            target.setUpdateTime(new Date());
            inventoryMapper.update(target);
        }
        source.setQuantity(source.getQuantity() - dto.getQuantity());
        source.setAvailableQuantity(source.getAvailableQuantity() - dto.getQuantity());
        source.setUpdateTime(new Date());
        inventoryMapper.update(source);
        inventoryRecordService.add(source, 4, -dto.getQuantity(), "调拨出库", dto.getTargetWarehouseId());
        inventoryRecordService.add(target, 4, dto.getQuantity(), "调拨入库", dto.getSourceInventoryId());
    }

    @Override
    public InventoryStatisticsVO getStatistics() {
        InventoryStatisticsVO vo = new InventoryStatisticsVO();
        vo.setTotalProducts(inventoryMapper.countProducts());
        vo.setTotalQuantity(inventoryMapper.sumQuantity());
        vo.setLowStockCount(inventoryAlertService.countLowStock());
        vo.setExpiringCount(inventoryMapper.countExpiring(30));
        return vo;
    }

    @Override
    public List<InventoryVO> getExpiringList(Integer days) {
        List<Inventory> list = inventoryMapper.selectExpiring(days);
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    private InventoryVO toVO(Inventory entity) {
        InventoryVO vo = new InventoryVO();
        BeanUtils.copyProperties(entity, vo);
        Product product = productMapper.selectById(entity.getProductId());
        if (product != null) {
            vo.setProductName(product.getName());
            vo.setProductCode(product.getCode());
            vo.setProductSpec(product.getSpec());
            vo.setProductUnit(product.getUnit());
        }
        return vo;
    }

    private InventoryDetailVO toDetailVO(Inventory entity) {
        InventoryDetailVO vo = new InventoryDetailVO();
        BeanUtils.copyProperties(entity, vo);
        Product product = productMapper.selectById(entity.getProductId());
        if (product != null) {
            vo.setProductName(product.getName());
            vo.setProductCode(product.getCode());
            vo.setProductSpec(product.getSpec());
            vo.setProductUnit(product.getUnit());
            vo.setProductCategory(product.getCategory());
        }
        return vo;
    }

    private InventoryRecordVO toRecordVO(InventoryRecord entity) {
        InventoryRecordVO vo = new InventoryRecordVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 5.18.3 库存记录服务

```java
@Service
public class InventoryRecordServiceImpl implements InventoryRecordService {

    @Autowired
    private InventoryRecordMapper recordMapper;

    @Override
    public void add(Inventory inventory, Integer recordType, Integer quantity, String remark, Long relatedId) {
        InventoryRecord record = new InventoryRecord();
        record.setInventoryId(inventory.getId());
        record.setWarehouseId(inventory.getWarehouseId());
        record.setProductId(inventory.getProductId());
        record.setRecordType(recordType);
        record.setQuantity(quantity);
        record.setAfterQuantity(inventory.getQuantity());
        record.setRemark(remark);
        record.setRelatedId(relatedId);
        record.setOperateTime(new Date());
        record.setCreateTime(new Date());
        recordMapper.insert(record);
    }

    @Override
    public List<InventoryRecord> getByInventoryId(Long inventoryId) {
        return recordMapper.selectByInventoryId(inventoryId);
    }

    @Override
    public PageVO<InventoryRecordVO> queryPage(InventoryRecordQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<InventoryRecord> list = recordMapper.selectByCondition(query);
        PageInfo<InventoryRecord> pageInfo = new PageInfo<>(list);
        List<InventoryRecordVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    private InventoryRecordVO toVO(InventoryRecord entity) {
        InventoryRecordVO vo = new InventoryRecordVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 5.18.4 库存预警服务

```java
@Service
public class InventoryAlertServiceImpl implements InventoryAlertService {

    @Autowired
    private InventoryAlertMapper alertMapper;

    @Autowired
    private InventoryMapper inventoryMapper;

    @Override
    public void createLowStockAlert(Inventory inventory) {
        InventoryAlert alert = new InventoryAlert();
        alert.setInventoryId(inventory.getId());
        alert.setWarehouseId(inventory.getWarehouseId());
        alert.setProductId(inventory.getProductId());
        alert.setAlertType(1);
        alert.setCurrentQuantity(inventory.getAvailableQuantity());
        alert.setWarningQuantity(inventory.getWarningQuantity());
        alert.setStatus(1);
        alert.setCreateTime(new Date());
        alertMapper.insert(alert);
    }

    @Override
    public void handle(Long id, String remark) {
        InventoryAlert alert = alertMapper.selectById(id);
        if (alert == null) {
            throw new BusinessException("预警记录不存在");
        }
        alert.setStatus(2);
        alert.setHandleTime(new Date());
        alert.setHandleRemark(remark);
        alert.setUpdateTime(new Date());
        alertMapper.update(alert);
    }

    @Override
    public Integer countLowStock() {
        return alertMapper.countByTypeAndStatus(1, 1);
    }

    @Override
    public List<InventoryAlertVO> getLowStockList() {
        List<InventoryAlert> list = alertMapper.selectByTypeAndStatus(1, 1);
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    @Override
    public PageVO<InventoryAlertVO> queryPage(InventoryAlertQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<InventoryAlert> list = alertMapper.selectByCondition(query);
        PageInfo<InventoryAlert> pageInfo = new PageInfo<>(list);
        List<InventoryAlertVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    private InventoryAlertVO toVO(InventoryAlert entity) {
        InventoryAlertVO vo = new InventoryAlertVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 5.18.5 库存盘点服务

```java
@Service
public class InventoryCheckServiceImpl implements InventoryCheckService {

    @Autowired
    private InventoryCheckMapper checkMapper;

    @Autowired
    private InventoryCheckDetailMapper detailMapper;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private InventoryRecordService inventoryRecordService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(InventoryCheckCreateDTO dto) {
        InventoryCheck check = new InventoryCheck();
        check.setCheckNo(generateCheckNo());
        check.setWarehouseId(dto.getWarehouseId());
        check.setCheckType(dto.getCheckType());
        check.setPlanDate(dto.getPlanDate());
        check.setStatus(1);
        check.setCreateTime(new Date());
        check.setUpdateTime(new Date());
        checkMapper.insert(check);
        if (dto.getInventoryIds() != null && !dto.getInventoryIds().isEmpty()) {
            for (Long inventoryId : dto.getInventoryIds()) {
                InventoryCheckDetail detail = new InventoryCheckDetail();
                detail.setCheckId(check.getId());
                detail.setInventoryId(inventoryId);
                detail.setStatus(1);
                detail.setCreateTime(new Date());
                detailMapper.insert(detail);
            }
        }
        return check.getId();
    }

    @Override
    public InventoryCheckDetailVO getDetailById(Long id) {
        InventoryCheck check = checkMapper.selectById(id);
        if (check == null) {
            throw new BusinessException("盘点单不存在");
        }
        InventoryCheckDetailVO vo = new InventoryCheckDetailVO();
        BeanUtils.copyProperties(check, vo);
        List<InventoryCheckDetail> details = detailMapper.selectByCheckId(id);
        vo.setDetails(details.stream().map(this::toDetailVO).collect(Collectors.toList()));
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void execute(Long id) {
        InventoryCheck check = checkMapper.selectById(id);
        if (check == null) {
            throw new BusinessException("盘点单不存在");
        }
        if (check.getStatus() != 1) {
            throw new BusinessException("盘点单状态不正确");
        }
        check.setStatus(2);
        check.setExecuteTime(new Date());
        check.setUpdateTime(new Date());
        checkMapper.update(check);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void confirm(InventoryCheckConfirmDTO dto) {
        InventoryCheck check = checkMapper.selectById(dto.getCheckId());
        if (check == null) {
            throw new BusinessException("盘点单不存在");
        }
        if (check.getStatus() != 2) {
            throw new BusinessException("盘点单状态不正确");
        }
        for (InventoryCheckDetailDTO detailDTO : dto.getDetails()) {
            InventoryCheckDetail detail = detailMapper.selectById(detailDTO.getId());
            if (detail != null) {
                Inventory inventory = inventoryMapper.selectById(detail.getInventoryId());
                if (inventory != null) {
                    Integer diff = detailDTO.getActualQuantity() - inventory.getQuantity();
                    inventory.setQuantity(detailDTO.getActualQuantity());
                    inventory.setAvailableQuantity(inventory.getAvailableQuantity() + diff);
                    inventory.setUpdateTime(new Date());
                    inventoryMapper.update(inventory);
                    inventoryRecordService.add(inventory, 5, diff, "盘点差异", dto.getCheckId());
                }
                detail.setActualQuantity(detailDTO.getActualQuantity());
                detail.setProfitLossQuantity(diff);
                detail.setStatus(3);
                detail.setUpdateTime(new Date());
                detailMapper.update(detail);
            }
        }
        check.setStatus(4);
        check.setConfirmTime(new Date());
        check.setConfirmRemark(dto.getRemark());
        check.setUpdateTime(new Date());
        checkMapper.update(check);
    }

    private String generateCheckNo() {
        return "CK" + DateUtil.format(new Date(), "yyyyMMddHHmmss") + (int)(Math.random() * 1000);
    }

    private InventoryCheckDetailVO toDetailVO(InventoryCheckDetail entity) {
        InventoryCheckDetailVO vo = new InventoryCheckDetailVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 5.18.6 库存实体类

```java
@Data
@TableName("ims_inventory")
public class Inventory {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long warehouseId;

    private Long productId;

    private Integer quantity;

    private Integer availableQuantity;

    private Integer lockedQuantity;

    private Integer warningQuantity;

    private Integer status;

    private Date createTime;

    private Date updateTime;
}

@Data
@TableName("ims_inventory_record")
public class InventoryRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long inventoryId;

    private Long warehouseId;

    private Long productId;

    private Integer recordType;

    private Integer quantity;

    private Integer afterQuantity;

    private String remark;

    private Long relatedId;

    private Date operateTime;

    private Date createTime;
}

@Data
@TableName("ims_inventory_alert")
public class InventoryAlert {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long inventoryId;

    private Long warehouseId;

    private Long productId;

    private Integer alertType;

    private Integer currentQuantity;

    private Integer warningQuantity;

    private Integer status;

    private String handleRemark;

    private Date handleTime;

    private Date createTime;

    private Date updateTime;
}

@Data
@TableName("ims_inventory_check")
public class InventoryCheck {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String checkNo;

    private Long warehouseId;

    private Integer checkType;

    private Date planDate;

    private Date executeTime;

    private Date confirmTime;

    private String confirmRemark;

    private Integer status;

    private Date createTime;

    private Date updateTime;
}

@Data
@TableName("ims_inventory_check_detail")
public class InventoryCheckDetail {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long checkId;

    private Long inventoryId;

    private Integer actualQuantity;

    private Integer profitLossQuantity;

    private Integer status;

    private Date createTime;

    private Date updateTime;
}
```

## 5.19 营销活动管理 (Marketing Activity)

### 5.19.1 营销活动控制器

```java
package com.andiantong.ims.service.marketing.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.marketing.dto.*;
import com.andiantong.ims.service.marketing.entity.*;
import com.andiantong.ims.service.marketing.service.*;
import com.andiantong.ims.service.marketing.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/marketing")
public class MarketingController {

    @Autowired
    private MarketingActivityService activityService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private CouponRecordService couponRecordService;

    @Autowired
    private GroupBuyService groupBuyService;

    @GetMapping("/activity/list")
    public Result<PageVO<MarketingActivityVO>> listActivity(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        MarketingActivityQueryDTO query = new MarketingActivityQueryDTO();
        query.setName(name);
        query.setType(type);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(activityService.queryPage(query));
    }

    @GetMapping("/activity/{id}")
    public Result<MarketingActivityDetailVO> getActivityById(@PathVariable Long id) {
        return Result.success(activityService.getDetailById(id));
    }

    @PostMapping("/activity")
    public Result<Long> addActivity(@Valid @RequestBody MarketingActivityAddDTO dto) {
        return Result.success(activityService.add(dto));
    }

    @PutMapping("/activity/{id}")
    public Result<Void> updateActivity(@PathVariable Long id, @Valid @RequestBody MarketingActivityUpdateDTO dto) {
        dto.setId(id);
        activityService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/activity/{id}")
    public Result<Void> deleteActivity(@PathVariable Long id) {
        activityService.delete(id);
        return Result.success();
    }

    @PostMapping("/activity/{id}/publish")
    public Result<Void> publishActivity(@PathVariable Long id) {
        activityService.publish(id);
        return Result.success();
    }

    @PostMapping("/activity/{id}/close")
    public Result<Void> closeActivity(@PathVariable Long id) {
        activityService.close(id);
        return Result.success();
    }

    @GetMapping("/coupon/list")
    public Result<PageVO<CouponVO>> listCoupon(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        CouponQueryDTO query = new CouponQueryDTO();
        query.setName(name);
        query.setType(type);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(couponService.queryPage(query));
    }

    @GetMapping("/coupon/{id}")
    public Result<CouponDetailVO> getCouponById(@PathVariable Long id) {
        return Result.success(couponService.getDetailById(id));
    }

    @PostMapping("/coupon")
    public Result<Long> addCoupon(@Valid @RequestBody CouponAddDTO dto) {
        return Result.success(couponService.add(dto));
    }

    @PutMapping("/coupon/{id}")
    public Result<Void> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponUpdateDTO dto) {
        dto.setId(id);
        couponService.update(dto);
        return Result.success();
    }

    @PostMapping("/coupon/{id}/publish")
    public Result<Void> publishCoupon(@PathVariable Long id) {
        couponService.publish(id);
        return Result.success();
    }

    @GetMapping("/coupon/user/list")
    public Result<PageVO<CouponRecordVO>> listUserCoupon(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        CouponRecordQueryDTO query = new CouponRecordQueryDTO();
        query.setUserId(userId);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(couponRecordService.queryPage(query));
    }

    @PostMapping("/coupon/{id}/grant")
    public Result<Void> grantCoupon(
            @PathVariable Long id,
            @RequestBody List<Long> userIds) {
        couponRecordService.grantToUsers(id, userIds);
        return Result.success();
    }

    @PostMapping("/coupon/receive")
    public Result<Void> receiveCoupon(
            @RequestParam Long couponId,
            @RequestParam Long userId) {
        couponRecordService.receive(couponId, userId);
        return Result.success();
    }

    @PostMapping("/coupon/use")
    public Result<Void> useCoupon(
            @RequestParam Long couponRecordId,
            @RequestParam String orderNo) {
        couponRecordService.use(couponRecordId, orderNo);
        return Result.success();
    }

    @GetMapping("/group-buy/list")
    public Result<PageVO<GroupBuyVO>> listGroupBuy(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        GroupBuyQueryDTO query = new GroupBuyQueryDTO();
        query.setTitle(title);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(groupBuyService.queryPage(query));
    }

    @PostMapping("/group-buy")
    public Result<Long> addGroupBuy(@Valid @RequestBody GroupBuyAddDTO dto) {
        return Result.success(groupBuyService.add(dto));
    }

    @PostMapping("/group-buy/{id}/join")
    public Result<Void> joinGroupBuy(
            @PathVariable Long id,
            @RequestParam Long userId) {
        groupBuyService.join(id, userId);
        return Result.success();
    }
}
```

### 5.19.2 营销活动服务实现

```java
@Service
public class MarketingActivityServiceImpl implements MarketingActivityService {

    @Autowired
    private MarketingActivityMapper activityMapper;

    @Autowired
    private MarketingProductMapper productMapper;

    @Override
    public PageVO<MarketingActivityVO> queryPage(MarketingActivityQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<MarketingActivity> list = activityMapper.selectByCondition(query);
        PageInfo<MarketingActivity> pageInfo = new PageInfo<>(list);
        List<MarketingActivityVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public MarketingActivityDetailVO getDetailById(Long id) {
        MarketingActivity entity = activityMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("营销活动不存在");
        }
        MarketingActivityDetailVO vo = toDetailVO(entity);
        List<MarketingProduct> products = productMapper.selectByActivityId(id);
        vo.setProducts(products.stream().map(this::toProductVO).collect(Collectors.toList()));
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(MarketingActivityAddDTO dto) {
        MarketingActivity entity = new MarketingActivity();
        BeanUtils.copyProperties(dto, entity);
        entity.setStatus(1);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        activityMapper.insert(entity);
        if (dto.getProductIds() != null && !dto.getProductIds().isEmpty()) {
            for (Long productId : dto.getProductIds()) {
                MarketingProduct mp = new MarketingProduct();
                mp.setActivityId(entity.getId());
                mp.setProductId(productId);
                mp.setDiscountPrice(dto.getDiscountPrice());
                mp.setCreateTime(new Date());
                productMapper.insert(mp);
            }
        }
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(MarketingActivityUpdateDTO dto) {
        MarketingActivity entity = activityMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("营销活动不存在");
        }
        if (entity.getStatus() == 3) {
            throw new BusinessException("已发布的活动不能修改");
        }
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdateTime(new Date());
        activityMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        MarketingActivity entity = activityMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("营销活动不存在");
        }
        if (entity.getStatus() == 3) {
            throw new BusinessException("已发布的活动不能删除");
        }
        entity.setStatus(0);
        entity.setUpdateTime(new Date());
        activityMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void publish(Long id) {
        MarketingActivity entity = activityMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("营销活动不存在");
        }
        if (entity.getStatus() != 1) {
            throw new BusinessException("活动状态不正确");
        }
        entity.setStatus(3);
        entity.setPublishTime(new Date());
        entity.setUpdateTime(new Date());
        activityMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void close(Long id) {
        MarketingActivity entity = activityMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("营销活动不存在");
        }
        if (entity.getStatus() != 3) {
            throw new BusinessException("活动状态不正确");
        }
        entity.setStatus(4);
        entity.setCloseTime(new Date());
        entity.setUpdateTime(new Date());
        activityMapper.update(entity);
    }

    private MarketingActivityVO toVO(MarketingActivity entity) {
        MarketingActivityVO vo = new MarketingActivityVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private MarketingActivityDetailVO toDetailVO(MarketingActivity entity) {
        MarketingActivityDetailVO vo = new MarketingActivityDetailVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private MarketingProductVO toProductVO(MarketingProduct entity) {
        MarketingProductVO vo = new MarketingProductVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 5.19.3 优惠券服务实现

```java
@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponMapper couponMapper;

    @Autowired
    private CouponRecordService couponRecordService;

    @Override
    public PageVO<CouponVO> queryPage(CouponQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<Coupon> list = couponMapper.selectByCondition(query);
        PageInfo<Coupon> pageInfo = new PageInfo<>(list);
        List<CouponVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public CouponDetailVO getDetailById(Long id) {
        Coupon entity = couponMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("优惠券不存在");
        }
        CouponDetailVO vo = toDetailVO(entity);
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(CouponAddDTO dto) {
        Coupon entity = new Coupon();
        BeanUtils.copyProperties(dto, entity);
        entity.setReceiveCount(0);
        entity.setUseCount(0);
        entity.setStatus(1);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        couponMapper.insert(entity);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(CouponUpdateDTO dto) {
        Coupon entity = couponMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("优惠券不存在");
        }
        if (entity.getStatus() == 3) {
            throw new BusinessException("已发布的优惠券不能修改");
        }
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdateTime(new Date());
        couponMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void publish(Long id) {
        Coupon entity = couponMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("优惠券不存在");
        }
        if (entity.getStatus() != 1) {
            throw new BusinessException("优惠券状态不正确");
        }
        if (entity.getTotalCount() != null && entity.getTotalCount() > 0) {
            if (entity.getReceiveCount() >= entity.getTotalCount()) {
                throw new BusinessException("优惠券已发放完毕");
            }
        }
        entity.setStatus(3);
        entity.setPublishTime(new Date());
        entity.setUpdateTime(new Date());
        couponMapper.update(entity);
    }

    private CouponVO toVO(Coupon entity) {
        CouponVO vo = new CouponVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private CouponDetailVO toDetailVO(Coupon entity) {
        CouponDetailVO vo = new CouponDetailVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class CouponRecordServiceImpl implements CouponRecordService {

    @Autowired
    private CouponRecordMapper recordMapper;

    @Autowired
    private CouponMapper couponMapper;

    @Override
    public PageVO<CouponRecordVO> queryPage(CouponRecordQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<CouponRecord> list = recordMapper.selectByCondition(query);
        PageInfo<CouponRecord> pageInfo = new PageInfo<>(list);
        List<CouponRecordVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void grantToUsers(Long couponId, List<Long> userIds) {
        Coupon coupon = couponMapper.selectById(couponId);
        if (coupon == null) {
            throw new BusinessException("优惠券不存在");
        }
        for (Long userId : userIds) {
            CouponRecord record = new CouponRecord();
            record.setCouponId(couponId);
            record.setUserId(userId);
            record.setStatus(1);
            record.setCreateTime(new Date());
            recordMapper.insert(record);
        }
        coupon.setReceiveCount(coupon.getReceiveCount() + userIds.size());
        coupon.setUpdateTime(new Date());
        couponMapper.update(coupon);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void receive(Long couponId, Long userId) {
        Coupon coupon = couponMapper.selectById(couponId);
        if (coupon == null) {
            throw new BusinessException("优惠券不存在");
        }
        if (coupon.getStatus() != 3) {
            throw new BusinessException("优惠券未发布");
        }
        if (coupon.getTotalCount() != null && coupon.getReceiveCount() >= coupon.getTotalCount()) {
            throw new BusinessException("优惠券已领完");
        }
        if (coupon.getLimitCount() != null) {
            Integer userReceived = recordMapper.countByCouponAndUser(couponId, userId);
            if (userReceived >= coupon.getLimitCount()) {
                throw new BusinessException("已达到领取上限");
            }
        }
        CouponRecord record = new CouponRecord();
        record.setCouponId(couponId);
        record.setUserId(userId);
        record.setStatus(1);
        record.setReceiveTime(new Date());
        record.setExpireTime(coupon.getExpireDays() != null ?
                DateUtil.addDays(new Date(), coupon.getExpireDays()) : coupon.getExpireEndTime());
        record.setCreateTime(new Date());
        recordMapper.insert(record);
        coupon.setReceiveCount(coupon.getReceiveCount() + 1);
        coupon.setUpdateTime(new Date());
        couponMapper.update(coupon);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void use(Long couponRecordId, String orderNo) {
        CouponRecord record = recordMapper.selectById(couponRecordId);
        if (record == null) {
            throw new BusinessException("优惠券记录不存在");
        }
        if (record.getStatus() != 1) {
            throw new BusinessException("优惠券状态不正确");
        }
        if (record.getExpireTime() != null && record.getExpireTime().before(new Date())) {
            throw new BusinessException("优惠券已过期");
        }
        record.setStatus(2);
        record.setUseTime(new Date());
        record.setOrderNo(orderNo);
        record.setUpdateTime(new Date());
        recordMapper.update(record);
        Coupon coupon = couponMapper.selectById(record.getCouponId());
        coupon.setUseCount(coupon.getUseCount() + 1);
        coupon.setUpdateTime(new Date());
        couponMapper.update(coupon);
    }

    private CouponRecordVO toVO(CouponRecord entity) {
        CouponRecordVO vo = new CouponRecordVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
```

### 5.19.4 营销活动实体类

```java
@Data
@TableName("ims_marketing_activity")
public class MarketingActivity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private Integer type;

    private String description;

    private BigDecimal discountPrice;

    private Date startTime;

    private Date endTime;

    private Date publishTime;

    private Date closeTime;

    private Integer status;

    private Date createTime;

    private Date updateTime;
}

@Data
@TableName("ims_coupon")
public class Coupon {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private Integer type;

    private BigDecimal faceAmount;

    private BigDecimal minAmount;

    private Integer totalCount;

    private Integer limitCount;

    private Integer receiveCount;

    private Integer useCount;

    private Integer expireDays;

    private Date expireStartTime;

    private Date expireEndTime;

    private Integer status;

    private Date publishTime;

    private Date createTime;

    private Date updateTime;
}

@Data
@TableName("ims_coupon_record")
public class CouponRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long couponId;

    private Long userId;

    private Integer status;

    private Date receiveTime;

    private Date expireTime;

    private Date useTime;

    private String orderNo;

    private Date createTime;

    private Date updateTime;
}

@Data
@TableName("ims_marketing_product")
public class MarketingProduct {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long activityId;

    private Long productId;

    private BigDecimal discountPrice;

    private Date createTime;
}
```

## 5.20 数据统计分析 (Data Statistics)

### 5.20.1 数据统计控制器

```java
package com.andiantong.ims.service.statistics.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.statistics.dto.*;
import com.andiantong.ims.service.statistics.service.*;
import com.andiantong.ims.service.statistics.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private OverviewService overviewService;

    @Autowired
    private OrderStatisticsService orderStatisticsService;

    @Autowired
    private UserStatisticsService userStatisticsService;

    @Autowired
    private FinanceStatisticsService financeStatisticsService;

    @Autowired
    private ElectricianStatisticsService electricianStatisticsService;

    @GetMapping("/overview")
    public Result<OverviewVO> getOverview(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(overviewService.getOverview(startDate, endDate));
    }

    @GetMapping("/trend")
    public Result<Map<String, List<TrendVO>>> getTrend(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "day") String type) {
        return Result.success(overviewService.getTrend(startDate, endDate, type));
    }

    @GetMapping("/order/summary")
    public Result<OrderSummaryVO> getOrderSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(orderStatisticsService.getSummary(startDate, endDate));
    }

    @GetMapping("/order/by-status")
    public Result<List<StatusCountVO>> getOrderByStatus(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(orderStatisticsService.getByStatus(startDate, endDate));
    }

    @GetMapping("/order/by-service")
    public Result<List<ServiceCountVO>> getOrderByService(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(orderStatisticsService.getByService(startDate, endDate));
    }

    @GetMapping("/order/by-region")
    public Result<List<RegionCountVO>> getOrderByRegion(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(orderStatisticsService.getByRegion(startDate, endDate));
    }

    @GetMapping("/user/summary")
    public Result<UserSummaryVO> getUserSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(userStatisticsService.getSummary(startDate, endDate));
    }

    @GetMapping("/user/growth")
    public Result<List<GrowthVO>> getUserGrowth(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(userStatisticsService.getGrowth(startDate, endDate));
    }

    @GetMapping("/user/by-source")
    public Result<List<SourceCountVO>> getUserBySource() {
        return Result.success(userStatisticsService.getBySource());
    }

    @GetMapping("/finance/summary")
    public Result<FinanceSummaryVO> getFinanceSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(financeStatisticsService.getSummary(startDate, endDate));
    }

    @GetMapping("/finance/trend")
    public Result<List<FinanceTrendVO>> getFinanceTrend(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(financeStatisticsService.getTrend(startDate, endDate));
    }

    @GetMapping("/finance/by-payment")
    public Result<List<PaymentCountVO>> getFinanceByPayment(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return Result.success(financeStatisticsService.getByPayment(startDate, endDate));
    }

    @GetMapping("/electrician/ranking")
    public Result<List<ElectricianRankingVO>> getElectricianRanking(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") Integer limit) {
        return Result.success(electricianStatisticsService.getRanking(startDate, endDate, limit));
    }

    @GetMapping("/electrician/score")
    public Result<List<ScoreVO>> getElectricianScore() {
        return Result.success(electricianStatisticsService.getScoreDistribution());
    }
}
```

### 5.20.2 统计服务实现

```java
@Service
public class OverviewServiceImpl implements OverviewService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ElectricianMapper electricianMapper;

    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public OverviewVO getOverview(String startDate, String endDate) {
        OverviewVO vo = new OverviewVO();
        vo.setTodayOrderCount(orderMapper.countToday());
        vo.setTodayUserCount(userMapper.countToday());
        vo.setTodayElectricianCount(electricianMapper.countToday());
        vo.setTodayAmount(paymentMapper.sumToday());
        vo.setTotalOrderCount(orderMapper.countByDate(startDate, endDate));
        vo.setTotalUserCount(userMapper.countByDate(startDate, endDate));
        vo.setTotalElectricianCount(electricianMapper.countByDate(startDate, endDate));
        vo.setTotalAmount(paymentMapper.sumByDate(startDate, endDate));
        return vo;
    }

    @Override
    public Map<String, List<TrendVO>> getTrend(String startDate, String endDate, String type) {
        Map<String, List<TrendVO>> result = new HashMap<>();
        result.put("order", orderMapper.getTrend(startDate, endDate, type));
        result.put("user", userMapper.getTrend(startDate, endDate, type));
        result.put("amount", paymentMapper.getTrend(startDate, endDate, type));
        return result;
    }
}

@Service
public class OrderStatisticsServiceImpl implements OrderStatisticsService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public OrderSummaryVO getSummary(String startDate, String endDate) {
        OrderSummaryVO vo = new OrderSummaryVO();
        vo.setTotalCount(orderMapper.countByDate(startDate, endDate));
        vo.setTotalAmount(orderMapper.sumAmountByDate(startDate, endDate));
        vo.setAvgAmount(orderMapper.avgAmountByDate(startDate, endDate));
        vo.setCompletedCount(orderMapper.countByStatusAndDate(6, startDate, endDate));
        vo.setCancelledCount(orderMapper.countByStatusAndDate(7, startDate, endDate));
        return vo;
    }

    @Override
    public List<StatusCountVO> getByStatus(String startDate, String endDate) {
        return orderMapper.countByStatus(startDate, endDate);
    }

    @Override
    public List<ServiceCountVO> getByService(String startDate, String endDate) {
        return orderMapper.countByService(startDate, endDate);
    }

    @Override
    public List<RegionCountVO> getByRegion(String startDate, String endDate) {
        return orderMapper.countByRegion(startDate, endDate);
    }
}

@Service
public class UserStatisticsServiceImpl implements UserStatisticsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserSummaryVO getSummary(String startDate, String endDate) {
        UserSummaryVO vo = new UserSummaryVO();
        vo.setTotalCount(userMapper.countByDate(startDate, endDate));
        vo.setActiveCount(userMapper.countActiveByDate(startDate, endDate));
        vo.setNewCount(userMapper.countNewByDate(startDate, endDate));
        return vo;
    }

    @Override
    public List<GrowthVO> getGrowth(String startDate, String endDate) {
        return userMapper.getGrowth(startDate, endDate);
    }

    @Override
    public List<SourceCountVO> getBySource() {
        return userMapper.countBySource();
    }
}

@Service
public class FinanceStatisticsServiceImpl implements FinanceStatisticsService {

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private RefundMapper refundMapper;

    @Override
    public FinanceSummaryVO getSummary(String startDate, String endDate) {
        FinanceSummaryVO vo = new FinanceSummaryVO();
        vo.setTotalIncome(paymentMapper.sumByDate(startDate, endDate));
        vo.setTotalRefund(refundMapper.sumByDate(startDate, endDate));
        vo.setNetIncome(vo.getTotalIncome().subtract(vo.getTotalRefund()));
        vo.setOrderCount(paymentMapper.countByDate(startDate, endDate));
        return vo;
    }

    @Override
    public List<FinanceTrendVO> getTrend(String startDate, String endDate) {
        return paymentMapper.getTrend(startDate, endDate);
    }

    @Override
    public List<PaymentCountVO> getByPayment(String startDate, String endDate) {
        return paymentMapper.countByPayment(startDate, endDate);
    }
}

@Service
public class ElectricianStatisticsServiceImpl implements ElectricianStatisticsService {

    @Autowired
    private ElectricianMapper electricianMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public List<ElectricianRankingVO> getRanking(String startDate, String endDate, Integer limit) {
        return electricianMapper.getRanking(startDate, endDate, limit);
    }

    @Override
    public List<ScoreVO> getScoreDistribution() {
        return electricianMapper.countByScore();
    }
}
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(inventory_service)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
