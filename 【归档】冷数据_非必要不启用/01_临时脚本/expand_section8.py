import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

content = '''
---

## 5.21 系统配置管理 (System Config)

### 5.21.1 系统配置控制器

```java
package com.andiantong.ims.service.config.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.config.dto.*;
import com.andiantong.ims.service.config.entity.*;
import com.andiantong.ims.service.config.service.*;
import com.andiantong.ims.service.config.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/config")
public class SystemConfigController {

    @Autowired
    private SystemConfigService configService;

    @Autowired
    private ConfigGroupService configGroupService;

    @Autowired
    private ParameterConfigService parameterConfigService;

    @GetMapping("/list")
    public Result<PageVO<SystemConfigVO>> list(
            @RequestParam(required = false) String configName,
            @RequestParam(required = false) String configGroup,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        SystemConfigQueryDTO query = new SystemConfigQueryDTO();
        query.setConfigName(configName);
        query.setConfigGroup(configGroup);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(configService.queryPage(query));
    }

    @GetMapping("/{id}")
    public Result<SystemConfigVO> getById(@PathVariable Long id) {
        return Result.success(configService.getById(id));
    }

    @PostMapping
    public Result<Long> add(@Valid @RequestBody SystemConfigAddDTO dto) {
        return Result.success(configService.add(dto));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody SystemConfigUpdateDTO dto) {
        dto.setId(id);
        configService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        configService.delete(id);
        return Result.success();
    }

    @GetMapping("/group/list")
    public Result<List<ConfigGroupVO>> listGroup() {
        return Result.success(configGroupService.listAll());
    }

    @PostMapping("/group")
    public Result<Long> addGroup(@Valid @RequestBody ConfigGroupAddDTO dto) {
        return Result.success(configGroupService.add(dto));
    }

    @GetMapping("/parameter/list")
    public Result<PageVO<ParameterConfigVO>> listParameter(
            @RequestParam(required = false) String paramName,
            @RequestParam(required = false) String paramKey,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        ParameterConfigQueryDTO query = new ParameterConfigQueryDTO();
        query.setParamName(paramName);
        query.setParamKey(paramKey);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(parameterConfigService.queryPage(query));
    }

    @GetMapping("/parameter/{paramKey}")
    public Result<String> getParameter(@PathVariable String paramKey) {
        return Result.success(parameterConfigService.getValue(paramKey));
    }

    @PostMapping("/parameter")
    public Result<Long> addParameter(@Valid @RequestBody ParameterConfigAddDTO dto) {
        return Result.success(parameterConfigService.add(dto));
    }

    @PutMapping("/parameter/{id}")
    public Result<Void> updateParameter(@PathVariable Long id, @Valid @RequestBody ParameterConfigUpdateDTO dto) {
        dto.setId(id);
        parameterConfigService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/parameter/{id}")
    public Result<Void> deleteParameter(@PathVariable Long id) {
        parameterConfigService.delete(id);
        return Result.success();
    }

    @PostMapping("/parameter/{id}/refresh")
    public Result<Void> refreshParameter(@PathVariable Long id) {
        parameterConfigService.refresh(id);
        return Result.success();
    }
}

@Service
public class SystemConfigServiceImpl implements SystemConfigService {

    @Autowired
    private SystemConfigMapper configMapper;

    @Override
    public PageVO<SystemConfigVO> queryPage(SystemConfigQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<SystemConfig> list = configMapper.selectByCondition(query);
        PageInfo<SystemConfig> pageInfo = new PageInfo<>(list);
        List<SystemConfigVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public SystemConfigVO getById(Long id) {
        SystemConfig entity = configMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("配置不存在");
        }
        return toVO(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(SystemConfigAddDTO dto) {
        SystemConfig entity = new SystemConfig();
        BeanUtils.copyProperties(dto, entity);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        configMapper.insert(entity);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(SystemConfigUpdateDTO dto) {
        SystemConfig entity = configMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("配置不存在");
        }
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdateTime(new Date());
        configMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        SystemConfig entity = configMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("配置不存在");
        }
        entity.setStatus(0);
        entity.setUpdateTime(new Date());
        configMapper.update(entity);
    }

    private SystemConfigVO toVO(SystemConfig entity) {
        SystemConfigVO vo = new SystemConfigVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class ConfigGroupServiceImpl implements ConfigGroupService {

    @Autowired
    private ConfigGroupMapper groupMapper;

    @Override
    public List<ConfigGroupVO> listAll() {
        List<ConfigGroup> list = groupMapper.selectAll();
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(ConfigGroupAddDTO dto) {
        ConfigGroup entity = new ConfigGroup();
        BeanUtils.copyProperties(dto, entity);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        groupMapper.insert(entity);
        return entity.getId();
    }

    private ConfigGroupVO toVO(ConfigGroup entity) {
        ConfigGroupVO vo = new ConfigGroupVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class ParameterConfigServiceImpl implements ParameterConfigService {

    @Autowired
    private ParameterConfigMapper paramMapper;

    private static final Map<String, String> CACHE = new ConcurrentHashMap<>();

    @Override
    public PageVO<ParameterConfigVO> queryPage(ParameterConfigQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<ParameterConfig> list = paramMapper.selectByCondition(query);
        PageInfo<ParameterConfig> pageInfo = new PageInfo<>(list);
        List<ParameterConfigVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public String getValue(String paramKey) {
        String value = CACHE.get(paramKey);
        if (value == null) {
            ParameterConfig param = paramMapper.selectByParamKey(paramKey);
            if (param == null) {
                throw new BusinessException("参数不存在");
            }
            value = param.getParamValue();
            CACHE.put(paramKey, value);
        }
        return value;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(ParameterConfigAddDTO dto) {
        ParameterConfig entity = new ParameterConfig();
        BeanUtils.copyProperties(dto, entity);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        paramMapper.insert(entity);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(ParameterConfigUpdateDTO dto) {
        ParameterConfig entity = paramMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("参数不存在");
        }
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdateTime(new Date());
        paramMapper.update(entity);
        CACHE.remove(entity.getParamKey());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        ParameterConfig entity = paramMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("参数不存在");
        }
        entity.setStatus(0);
        entity.setUpdateTime(new Date());
        paramMapper.update(entity);
        CACHE.remove(entity.getParamKey());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void refresh(Long id) {
        ParameterConfig entity = paramMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("参数不存在");
        }
        CACHE.remove(entity.getParamKey());
    }

    private ParameterConfigVO toVO(ParameterConfig entity) {
        ParameterConfigVO vo = new ParameterConfigVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Data
@TableName("ims_system_config")
public class SystemConfig {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String configName;
    private String configKey;
    private String configValue;
    private String configGroup;
    private String description;
    private Integer status;
    private Date createTime;
    private Date updateTime;
}

@Data
@TableName("ims_config_group")
public class ConfigGroup {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String groupName;
    private String groupCode;
    private Integer sort;
    private String description;
    private Date createTime;
    private Date updateTime;
}

@Data
@TableName("ims_parameter_config")
public class ParameterConfig {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String paramName;
    private String paramKey;
    private String paramValue;
    private String paramType;
    private String description;
    private Integer status;
    private Date createTime;
    private Date updateTime;
}
```

## 5.22 消息通知管理 (Notification)

### 5.22.1 消息通知控制器

```java
package com.andiantong.ims.service.notification.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.notification.dto.*;
import com.andiantong.ims.service.notification.entity.*;
import com.andiantong.ims.service.notification.service.*;
import com.andiantong.ims.service.notification.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationTemplateService templateService;

    @Autowired
    private NotificationSendService sendService;

    @GetMapping("/list")
    public Result<PageVO<NotificationVO>> list(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer readStatus,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        NotificationQueryDTO query = new NotificationQueryDTO();
        query.setUserId(userId);
        query.setType(type);
        query.setReadStatus(readStatus);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(notificationService.queryPage(query));
    }

    @GetMapping("/{id}")
    public Result<NotificationDetailVO> getById(@PathVariable Long id) {
        return Result.success(notificationService.getDetailById(id));
    }

    @PostMapping("/send")
    public Result<Void> send(@Valid @RequestBody NotificationSendDTO dto) {
        sendService.send(dto);
        return Result.success();
    }

    @PostMapping("/{id}/read")
    public Result<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return Result.success();
    }

    @PostMapping("/read/all")
    public Result<Void> markAllRead(@RequestParam Long userId) {
        notificationService.markAllRead(userId);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return Result.success();
    }

    @GetMapping("/template/list")
    public Result<PageVO<NotificationTemplateVO>> listTemplate(
            @RequestParam(required = false) String templateName,
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        NotificationTemplateQueryDTO query = new NotificationTemplateQueryDTO();
        query.setTemplateName(templateName);
        query.setType(type);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(templateService.queryPage(query));
    }

    @GetMapping("/template/{id}")
    public Result<NotificationTemplateVO> getTemplateById(@PathVariable Long id) {
        return Result.success(templateService.getById(id));
    }

    @PostMapping("/template")
    public Result<Long> addTemplate(@Valid @RequestBody NotificationTemplateAddDTO dto) {
        return Result.success(templateService.add(dto));
    }

    @PutMapping("/template/{id}")
    public Result<Void> updateTemplate(@PathVariable Long id, @Valid @RequestBody NotificationTemplateUpdateDTO dto) {
        dto.setId(id);
        templateService.update(dto);
        return Result.success();
    }

    @DeleteMapping("/template/{id}")
    public Result<Void> deleteTemplate(@PathVariable Long id) {
        templateService.delete(id);
        return Result.success();
    }

    @PostMapping("/template/{id}/send-test")
    public Result<Void> sendTestTemplate(@PathVariable Long id, @RequestParam Long userId) {
        templateService.sendTest(id, userId);
        return Result.success();
    }
}

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationMapper notificationMapper;

    @Override
    public PageVO<NotificationVO> queryPage(NotificationQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<Notification> list = notificationMapper.selectByCondition(query);
        PageInfo<Notification> pageInfo = new PageInfo<>(list);
        List<NotificationVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public NotificationDetailVO getDetailById(Long id) {
        Notification entity = notificationMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("通知不存在");
        }
        if (entity.getReadStatus() == 1) {
            entity.setReadTime(new Date());
            entity.setReadStatus(2);
            entity.setUpdateTime(new Date());
            notificationMapper.update(entity);
        }
        return toDetailVO(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markRead(Long id) {
        Notification entity = notificationMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("通知不存在");
        }
        entity.setReadStatus(2);
        entity.setReadTime(new Date());
        entity.setUpdateTime(new Date());
        notificationMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAllRead(Long userId) {
        notificationMapper.updateAllRead(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Notification entity = notificationMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("通知不存在");
        }
        entity.setStatus(0);
        entity.setUpdateTime(new Date());
        notificationMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(Notification notification) {
        notification.setStatus(1);
        notification.setReadStatus(1);
        notification.setCreateTime(new Date());
        notification.setUpdateTime(new Date());
        notificationMapper.insert(notification);
    }

    private NotificationVO toVO(Notification entity) {
        NotificationVO vo = new NotificationVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private NotificationDetailVO toDetailVO(Notification entity) {
        NotificationDetailVO vo = new NotificationDetailVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class NotificationTemplateServiceImpl implements NotificationTemplateService {

    @Autowired
    private NotificationTemplateMapper templateMapper;

    @Autowired
    private NotificationService notificationService;

    @Override
    public PageVO<NotificationTemplateVO> queryPage(NotificationTemplateQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<NotificationTemplate> list = templateMapper.selectByCondition(query);
        PageInfo<NotificationTemplate> pageInfo = new PageInfo<>(list);
        List<NotificationTemplateVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public NotificationTemplateVO getById(Long id) {
        NotificationTemplate entity = templateMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("模板不存在");
        }
        return toVO(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long add(NotificationTemplateAddDTO dto) {
        NotificationTemplate entity = new NotificationTemplate();
        BeanUtils.copyProperties(dto, entity);
        entity.setStatus(1);
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        templateMapper.insert(entity);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(NotificationTemplateUpdateDTO dto) {
        NotificationTemplate entity = templateMapper.selectById(dto.getId());
        if (entity == null) {
            throw new BusinessException("模板不存在");
        }
        BeanUtils.copyProperties(dto, entity);
        entity.setUpdateTime(new Date());
        templateMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        NotificationTemplate entity = templateMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("模板不存在");
        }
        entity.setStatus(0);
        entity.setUpdateTime(new Date());
        templateMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void sendTest(Long templateId, Long userId) {
        NotificationTemplate template = templateMapper.selectById(templateId);
        if (template == null) {
            throw new BusinessException("模板不存在");
        }
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(template.getType());
        notification.setTitle("【测试】" + template.getTemplateName());
        notification.setContent(template.getContent());
        notificationService.save(notification);
    }

    private NotificationTemplateVO toVO(NotificationTemplate entity) {
        NotificationTemplateVO vo = new NotificationTemplateVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class NotificationSendServiceImpl implements NotificationSendService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationTemplateMapper templateMapper;

    @Autowired
    private SmsService smsService;

    @Autowired
    private PushService pushService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void send(NotificationSendDTO dto) {
        if (dto.getTemplateId() != null) {
            NotificationTemplate template = templateMapper.selectById(dto.getTemplateId());
            if (template == null) {
                throw new BusinessException("模板不存在");
            }
            dto.setTitle(template.getTemplateName());
            dto.setContent(replaceTemplateContent(template.getContent(), dto.getParams()));
        }
        if (dto.getUserIds() != null && !dto.getUserIds().isEmpty()) {
            for (Long userId : dto.getUserIds()) {
                sendToUser(userId, dto);
            }
        }
        if (dto.getSendSms() != null && dto.getSendSms() == 1) {
            smsService.send(dto.getPhone(), dto.getContent());
        }
        if (dto.getSendPush() != null && dto.getSendPush() == 1) {
            pushService.push(dto.getUserIds(), dto.getTitle(), dto.getContent());
        }
    }

    private void sendToUser(Long userId, NotificationSendDTO dto) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(dto.getType());
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notificationService.save(notification);
    }

    private String replaceTemplateContent(String content, Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            return content;
        }
        String result = content;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
}

@Data
@TableName("ims_notification")
public class Notification {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Integer type;
    private String title;
    private String content;
    private Integer readStatus;
    private Date readTime;
    private Integer status;
    private Date createTime;
    private Date updateTime;
}

@Data
@TableName("ims_notification_template")
public class NotificationTemplate {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String templateName;
    private Integer type;
    private String title;
    private String content;
    private String remark;
    private Integer status;
    private Date createTime;
    private Date updateTime;
}
```

## 5.23 操作日志管理 (Operation Log)

### 5.23.1 操作日志控制器

```java
package com.andiantong.ims.service.log.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.log.dto.*;
import com.andiantong.ims.service.log.entity.*;
import com.andiantong.ims.service.log.service.*;
import com.andiantong.ims.service.log.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/log")
public class OperationLogController {

    @Autowired
    private OperationLogService logService;

    @GetMapping("/operation/list")
    public Result<PageVO<OperationLogVO>> listOperationLog(
            @RequestParam(required = false) String operationModule,
            @RequestParam(required = false) String operationType,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        OperationLogQueryDTO query = new OperationLogQueryDTO();
        query.setOperationModule(operationModule);
        query.setOperationType(operationType);
        query.setUserId(userId);
        query.setStartDate(startDate);
        query.setEndDate(endDate);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(logService.queryOperationPage(query));
    }

    @GetMapping("/operation/{id}")
    public Result<OperationLogVO> getOperationLogById(@PathVariable Long id) {
        return Result.success(logService.getOperationById(id));
    }

    @GetMapping("/login/list")
    public Result<PageVO<LoginLogVO>> listLoginLog(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        LoginLogQueryDTO query = new LoginLogQueryDTO();
        query.setUsername(username);
        query.setStatus(status);
        query.setStartDate(startDate);
        query.setEndDate(endDate);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(logService.queryLoginPage(query));
    }

    @GetMapping("/error/list")
    public Result<PageVO<ErrorLogVO>> listErrorLog(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        ErrorLogQueryDTO query = new ErrorLogQueryDTO();
        query.setModule(module);
        query.setStartDate(startDate);
        query.setEndDate(endDate);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(logService.queryErrorPage(query));
    }

    @DeleteMapping("/operation/{id}")
    public Result<Void> deleteOperationLog(@PathVariable Long id) {
        logService.deleteOperation(id);
        return Result.success();
    }

    @DeleteMapping("/login/{id}")
    public Result<Void> deleteLoginLog(@PathVariable Long id) {
        logService.deleteLogin(id);
        return Result.success();
    }

    @DeleteMapping("/error/{id}")
    public Result<Void> deleteErrorLog(@PathVariable Long id) {
        logService.deleteError(id);
        return Result.success();
    }
}

@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    private OperationLogMapper operationLogMapper;

    @Autowired
    private LoginLogMapper loginLogMapper;

    @Autowired
    private ErrorLogMapper errorLogMapper;

    @Override
    public PageVO<OperationLogVO> queryOperationPage(OperationLogQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<OperationLog> list = operationLogMapper.selectByCondition(query);
        PageInfo<OperationLog> pageInfo = new PageInfo<>(list);
        List<OperationLogVO> voList = list.stream().map(this::toOperationVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public PageVO<LoginLogVO> queryLoginPage(LoginLogQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<LoginLog> list = loginLogMapper.selectByCondition(query);
        PageInfo<LoginLog> pageInfo = new PageInfo<>(list);
        List<LoginLogVO> voList = list.stream().map(this::toLoginVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public PageVO<ErrorLogVO> queryErrorPage(ErrorLogQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<ErrorLog> list = errorLogMapper.selectByCondition(query);
        PageInfo<ErrorLog> pageInfo = new PageInfo<>(list);
        List<ErrorLogVO> voList = list.stream().map(this::toErrorVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    public OperationLogVO getOperationById(Long id) {
        OperationLog entity = operationLogMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("日志不存在");
        }
        return toOperationVO(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOperation(Long id) {
        operationLogMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteLogin(Long id) {
        loginLogMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteError(Long id) {
        errorLogMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOperation(OperationLog log) {
        log.setCreateTime(new Date());
        operationLogMapper.insert(log);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveLogin(LoginLog log) {
        log.setCreateTime(new Date());
        loginLogMapper.insert(log);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveError(ErrorLog log) {
        log.setCreateTime(new Date());
        errorLogMapper.insert(log);
    }

    private OperationLogVO toOperationVO(OperationLog entity) {
        OperationLogVO vo = new OperationLogVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private LoginLogVO toLoginVO(LoginLog entity) {
        LoginLogVO vo = new LoginLogVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private ErrorLogVO toErrorVO(ErrorLog entity) {
        ErrorLogVO vo = new ErrorLogVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Data
@TableName("ims_operation_log")
public class OperationLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String username;
    private String operationModule;
    private String operationType;
    private String operationDesc;
    private String requestMethod;
    private String requestUrl;
    private String requestParam;
    private String responseResult;
    private String ipAddress;
    private String ipLocation;
    private Long costTime;
    private Integer status;
    private String errorMsg;
    private Date createTime;
}

@Data
@TableName("ims_login_log")
public class LoginLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String username;
    private Integer loginType;
    private String ipAddress;
    private String ipLocation;
    private String deviceType;
    private String deviceId;
    private String userAgent;
    private Integer status;
    private String failReason;
    private Date createTime;
}

@Data
@TableName("ims_error_log")
public class ErrorLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String module;
    private String method;
    private String requestUrl;
    private String requestParam;
    private String errorType;
    private String errorMsg;
    private String stackTrace;
    private String ipAddress;
    private Integer status;
    private Date createTime;
}
```

## 5.24 数据导入导出 (Data Import/Export)

### 5.24.1 数据导入导出控制器

```java
package com.andiantong.ims.service.file.controller;

import com.andiantong.ims.common.core.result.Result;
import com.andiantong.ims.service.file.dto.*;
import com.andiantong.ims.service.file.entity.*;
import com.andiantong.ims.service.file.service.*;
import com.andiantong.ims.service.file.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DataImportService importService;

    @Autowired
    private DataExportService exportService;

    @Autowired
    private DataTemplateService templateService;

    @PostMapping("/import")
    public Result<DataImportResultVO> importData(
            @RequestParam MultipartFile file,
            @RequestParam Integer templateId,
            @RequestParam(required = false) Long createBy) {
        return Result.success(importService.importData(file, templateId, createBy));
    }

    @GetMapping("/import/{id}")
    public Result<DataImportVO> getImportById(@PathVariable Long id) {
        return Result.success(importService.getById(id));
    }

    @GetMapping("/import/{id}/detail")
    public Result<List<DataImportDetailVO>> getImportDetail(@PathVariable Long id) {
        return Result.success(importService.getDetailById(id));
    }

    @PostMapping("/import/{id}/confirm")
    public Result<Void> confirmImport(@PathVariable Long id) {
        importService.confirm(id);
        return Result.success();
    }

    @PostMapping("/import/{id}/cancel")
    public Result<Void> cancelImport(@PathVariable Long id) {
        importService.cancel(id);
        return Result.success();
    }

    @GetMapping("/export/list")
    public Result<PageVO<DataExportVO>> listExport(
            @RequestParam(required = false) String exportType,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        DataExportQueryDTO query = new DataExportQueryDTO();
        query.setExportType(exportType);
        query.setStatus(status);
        query.setPageNum(pageNum);
        query.setPageSize(pageSize);
        return Result.success(exportService.queryPage(query));
    }

    @PostMapping("/export")
    public Result<Long> exportData(
            @Valid @RequestBody DataExportDTO dto,
            @RequestParam Long createBy) {
        return Result.success(exportService.exportData(dto, createBy));
    }

    @GetMapping("/export/{id}")
    public Result<DataExportVO> getExportById(@PathVariable Long id) {
        return Result.success(exportService.getById(id));
    }

    @GetMapping("/export/{id}/download")
    public void downloadExport(
            @PathVariable Long id,
            HttpServletResponse response) throws IOException {
        exportService.download(id, response);
    }

    @GetMapping("/template/list")
    public Result<List<DataTemplateVO>> listTemplate(
            @RequestParam(required = false) String templateType) {
        return Result.success(templateService.listByType(templateType));
    }

    @GetMapping("/template/{id}")
    public Result<DataTemplateVO> getTemplateById(@PathVariable Long id) {
        return Result.success(templateService.getById(id));
    }

    @GetMapping("/template/{id}/download")
    public void downloadTemplate(
            @PathVariable Long id,
            HttpServletResponse response) throws IOException {
        templateService.download(id, response);
    }
}

@Service
public class DataImportServiceImpl implements DataImportService {

    @Autowired
    private DataImportMapper importMapper;

    @Autowired
    private DataImportDetailMapper detailMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ElectricianMapper electricianMapper;

    @Autowired
    private ProductMapper productMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DataImportResultVO importData(MultipartFile file, Long templateId, Long createBy) {
        DataImportResultVO result = new DataImportResultVO();
        try {
            List<List<String>> dataList = ExcelUtil.readExcel(file);
            DataImport dataImport = new DataImport();
            dataImport.setTemplateId(templateId);
            dataImport.setTotalCount(dataList.size() - 1);
            dataImport.setSuccessCount(0);
            dataImport.setFailCount(0);
            dataImport.setStatus(1);
            dataImport.setCreateBy(createBy);
            dataImport.setCreateTime(new Date());
            dataImportMapper.insert(dataImport);
            int successCount = 0;
            int failCount = 0;
            for (int i = 1; i < dataList.size(); i++) {
                try {
                    List<String> row = dataList.get(i);
                    importRow(dataImport, row, templateId);
                    successCount++;
                    DataImportDetail detail = new DataImportDetail();
                    detail.setImportId(dataImport.getId());
                    detail.setRowNum(i + 1);
                    detail.setStatus(1);
                    detail.setCreateTime(new Date());
                    detailMapper.insert(detail);
                } catch (Exception e) {
                    failCount++;
                    DataImportDetail detail = new DataImportDetail();
                    detail.setImportId(dataImport.getId());
                    detail.setRowNum(i + 1);
                    detail.setStatus(2);
                    detail.setErrorMsg(e.getMessage());
                    detail.setCreateTime(new Date());
                    detailMapper.insert(detail);
                }
            }
            dataImport.setSuccessCount(successCount);
            dataImport.setFailCount(failCount);
            dataImport.setUpdateTime(new Date());
            importMapper.update(dataImport);
            result.setImportId(dataImport.getId());
            result.setTotalCount(dataImport.getTotalCount());
            result.setSuccessCount(successCount);
            result.setFailCount(failCount);
            return result;
        } catch (Exception e) {
            throw new BusinessException("导入失败: " + e.getMessage());
        }
    }

    private void importRow(DataImport dataImport, List<String> row, Long templateId) {
        if (templateId == 1) {
            importUser(row);
        } else if (templateId == 2) {
            importElectrician(row);
        } else if (templateId == 3) {
            importProduct(row);
        }
    }

    private void importUser(List<String> row) {
        User user = new User();
        user.setUsername(row.get(0));
        user.setNickname(row.get(1));
        user.setPhone(row.get(2));
        user.setStatus(1);
        user.setCreateTime(new Date());
        userMapper.insert(user);
    }

    private void importElectrician(List<String> row) {
        Electrician electrician = new Electrician();
        electrician.setName(row.get(0));
        electrician.setPhone(row.get(1));
        electrician.setCertificateNo(row.get(2));
        electrician.setStatus(1);
        electrician.setCreateTime(new Date());
        electricianMapper.insert(electrician);
    }

    private void importProduct(List<String> row) {
        Product product = new Product();
        product.setName(row.get(0));
        product.setCode(row.get(1));
        product.setCategory(row.get(2));
        product.setStatus(1);
        product.setCreateTime(new Date());
        productMapper.insert(product);
    }

    @Override
    public DataImportVO getById(Long id) {
        DataImport entity = importMapper.selectById(id);
        return toVO(entity);
    }

    @Override
    public List<DataImportDetailVO> getDetailById(Long id) {
        List<DataImportDetail> list = detailMapper.selectByImportId(id);
        return list.stream().map(this::toDetailVO).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void confirm(Long id) {
        DataImport entity = importMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("导入记录不存在");
        }
        if (entity.getStatus() != 1) {
            throw new BusinessException("导入状态不正确");
        }
        entity.setStatus(3);
        entity.setConfirmTime(new Date());
        entity.setUpdateTime(new Date());
        importMapper.update(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(Long id) {
        DataImport entity = importMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("导入记录不存在");
        }
        entity.setStatus(4);
        entity.setUpdateTime(new Date());
        importMapper.update(entity);
    }

    private DataImportVO toVO(DataImport entity) {
        DataImportVO vo = new DataImportVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private DataImportDetailVO toDetailVO(DataImportDetail entity) {
        DataImportDetailVO vo = new DataImportDetailVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class DataExportServiceImpl implements DataExportService {

    @Autowired
    private DataExportMapper exportMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private ElectricianMapper electricianMapper;

    @Override
    public PageVO<DataExportVO> queryPage(DataExportQueryDTO query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<DataExport> list = exportMapper.selectByCondition(query);
        PageInfo<DataExport> pageInfo = new PageInfo<>(list);
        List<DataExportVO> voList = list.stream().map(this::toVO).collect(Collectors.toList());
        return new PageVO<>(voList, pageInfo.getTotal(), pageInfo.getPageNum(), pageInfo.getPageSize());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long exportData(DataExportDTO dto, Long createBy) {
        DataExport dataExport = new DataExport();
        dataExport.setExportType(dto.getExportType());
        dataExport.setFileName(dto.getFileName());
        dataExport.setStatus(1);
        dataExport.setCreateBy(createBy);
        dataExport.setCreateTime(new Date());
        exportMapper.insert(dataExport);
        try {
            List<?> dataList = queryData(dto);
            String filePath = writeExcel(dataExport.getId(), dataList, dto.getExportType());
            dataExport.setFilePath(filePath);
            dataExport.setStatus(2);
            dataExport.setCompleteTime(new Date());
        } catch (Exception e) {
            dataExport.setStatus(3);
            dataExport.setErrorMsg(e.getMessage());
        }
        dataExport.setUpdateTime(new Date());
        exportMapper.update(dataExport);
        return dataExport.getId();
    }

    private List<?> queryData(DataExportDTO dto) {
        if ("user".equals(dto.getExportType())) {
            return userMapper.selectAll();
        } else if ("order".equals(dto.getExportType())) {
            return orderMapper.selectByDate(dto.getStartDate(), dto.getEndDate());
        } else if ("electrician".equals(dto.getExportType())) {
            return electricianMapper.selectAll();
        }
        return null;
    }

    private String writeExcel(Long exportId, List<?> dataList, String exportType) {
        return null;
    }

    @Override
    public DataExportVO getById(Long id) {
        DataExport entity = exportMapper.selectById(id);
        return toVO(entity);
    }

    @Override
    public void download(Long id, HttpServletResponse response) throws IOException {
        DataExport entity = exportMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("导出记录不存在");
        }
        if (entity.getStatus() != 2) {
            throw new BusinessException("导出未完成");
        }
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment;filename=" + entity.getFileName());
        response.getOutputStream().write(FileUtil.readFile(entity.getFilePath()));
    }

    private DataExportVO toVO(DataExport entity) {
        DataExportVO vo = new DataExportVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Service
public class DataTemplateServiceImpl implements DataTemplateService {

    @Autowired
    private DataTemplateMapper templateMapper;

    @Override
    public List<DataTemplateVO> listByType(String templateType) {
        List<DataTemplate> list = templateMapper.selectByType(templateType);
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    @Override
    public DataTemplateVO getById(Long id) {
        DataTemplate entity = templateMapper.selectById(id);
        return toVO(entity);
    }

    @Override
    public void download(Long id, HttpServletResponse response) throws IOException {
        DataTemplate entity = templateMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("模板不存在");
        }
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment;filename=" + entity.getTemplateName() + ".xlsx");
        response.getOutputStream().write(entity.getTemplateFile());
    }

    private DataTemplateVO toVO(DataTemplate entity) {
        DataTemplateVO vo = new DataTemplateVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}

@Data
@TableName("ims_data_import")
public class DataImport {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long templateId;
    private Integer totalCount;
    private Integer successCount;
    private Integer failCount;
    private Integer status;
    private Long createBy;
    private Date createTime;
    private Date confirmTime;
    private Date updateTime;
}

@Data
@TableName("ims_data_import_detail")
public class DataImportDetail {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long importId;
    private Integer rowNum;
    private Integer status;
    private String errorMsg;
    private Date createTime;
}

@Data
@TableName("ims_data_export")
public class DataExport {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String exportType;
    private String fileName;
    private String filePath;
    private Integer status;
    private String errorMsg;
    private Long createBy;
    private Date createTime;
    private Date completeTime;
    private Date updateTime;
}

@Data
@TableName("ims_data_template")
public class DataTemplate {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String templateName;
    private String templateType;
    private String description;
    private byte[] templateFile;
    private Integer status;
    private Date createTime;
    private Date updateTime;
}
```

---

## 第六部分 前端核心代码

## 6.1 用户端小程序核心组件

### 6.1.1 用户首页组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import { AtButton, AtIcon, AtBadge } from 'taro-ui';
import './index.less';

interface HomePageProps {
  userInfo: UserInfo;
  bannerList: Banner[];
  serviceList: ServiceCategory[];
  orderCount: OrderCount;
  noticeList: Notice[];
  onNavigateToOrder: (type: number) => void;
  onNavigateToService: (id: number) => void;
  onNavigateToNotice: (id: number) => void;
}

export default class HomePage extends Taro.Component<HomePageProps> {
  public componentDidMount() {
    this.loadHomeData();
  }

  private async loadHomeData() {
    try {
      const [bannerRes, serviceRes, orderRes, noticeRes] = await Promise.all([
        Api.getBannerList(),
        Api.getServiceCategoryList(),
        Api.getOrderCount(),
        Api.getNoticeList({ limit: 5 })
      ]);
      this.setState({
        bannerList: bannerRes.data,
        serviceList: serviceRes.data,
        orderCount: orderRes.data,
        noticeList: noticeRes.data
      });
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  }

  private handleOrderTap = (type: number) => {
    const { userInfo } = this.props;
    if (!userInfo.id) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    this.props.onNavigateToOrder(type);
  };

  private handleServiceTap = (id: number) => {
    const { userInfo } = this.props;
    if (!userInfo.id) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    this.props.onNavigateToService(id);
  };

  private handleNoticeTap = (id: number) => {
    this.props.onNavigateToNotice(id);
  };

  public render() {
    const { bannerList, serviceList, orderCount, noticeList, userInfo } = this.props;
    return (
      <ScrollView className="home-page" scrollY>
        <View className="header">
          <View className="user-info">
            <Image
              className="avatar"
              src={userInfo.avatar || '/assets/images/default-avatar.png'}
            />
            <View className="info">
              <Text className="nickname">
                {userInfo.nickname || '请登录'}
              </Text>
              {userInfo.id && (
                <Text className="phone">{userInfo.phone}</Text>
              )}
            </View>
          </View>
          <View className="notice-bell">
            <AtIcon value="bell" size="24" color="#fff" />
            {noticeList.length > 0 && (
              <View className="badge">!</View>
            )}
          </View>
        </View>

        {bannerList.length > 0 && (
          <Swiper className="banner" autoplay circular indicatorDots>
            {bannerList.map((banner) => (
              <SwiperItem key={banner.id}>
                <Image
                  className="banner-img"
                  src={banner.imageUrl}
                  mode="aspectFill"
                />
              </SwiperItem>
            ))}
          </Swiper>
        )}

        <View className="notice-section">
          <View className="notice-title">公告</View>
          <ScrollView className="notice-list" scrollX>
            {noticeList.map((notice) => (
              <View
                key={notice.id}
                className="notice-item"
                onClick={() => this.handleNoticeTap(notice.id)}
              >
                <Text className="notice-text">{notice.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="order-section">
          <View className="section-title">我的订单</View>
          <View className="order-tabs">
            {orderTabs.map((tab) => (
              <View
                key={tab.type}
                className="order-tab"
                onClick={() => this.handleOrderTap(tab.type)}
              >
                <AtBadge value={orderCount[tab.key] || 0} maxValue={99}>
                  <AtIcon value={tab.icon} size="28" color="#333" />
                </AtBadge>
                <Text className="tab-label">{tab.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="service-section">
          <View className="section-title">服务分类</View>
          <View className="service-grid">
            {serviceList.map((service) => (
              <View
                key={service.id}
                className="service-item"
                onClick={() => this.handleServiceTap(service.id)}
              >
                <Image
                  className="service-icon"
                  src={service.icon}
                  mode="aspectFit"
                />
                <Text className="service-name">{service.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="recommend-section">
          <View className="section-title">推荐服务</View>
          <View className="recommend-list">
            {recommendServices.map((item) => (
              <View key={item.id} className="recommend-item">
                <Image
                  className="recommend-img"
                  src={item.imageUrl}
                  mode="aspectFill"
                />
                <View className="recommend-info">
                  <Text className="recommend-title">{item.name}</Text>
                  <Text className="recommend-desc">{item.description}</Text>
                  <View className="recommend-bottom">
                    <Text className="recommend-price">¥{item.price}</Text>
                    <AtButton
                      size="small"
                      type="primary"
                      onClick={() => this.handleServiceTap(item.id)}
                    >
                      立即预约
                    </AtButton>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}
```

### 6.1.2 服务详情组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtButton, AtIcon, AtRate, AtTag } from 'taro-ui';
import ElectricianList from './components/ElectricianList';
import './detail.less';

interface ServiceDetailProps {
  serviceId: number;
  serviceInfo: ServiceDetail;
  electricianList: Electrician[];
  commentList: Comment[];
  onBookService: (data: BookServiceParams) => void;
}

export default class ServiceDetailPage extends Taro.Component<ServiceDetailProps> {
  public state = {
    selectedDate: '',
    selectedTime: '',
    selectedElectricianId: 0,
    remark: ''
  };

  public componentDidMount() {
    this.loadServiceDetail();
  }

  private async loadServiceDetail() {
    try {
      const [detailRes, electricianRes, commentRes] = await Promise.all([
        Api.getServiceDetail(this.props.serviceId),
        Api.getElectricianList({ serviceId: this.props.serviceId }),
        Api.getCommentList({ serviceId: this.props.serviceId, limit: 10 })
      ]);
      this.setState({
        serviceInfo: detailRes.data,
        electricianList: electricianRes.data,
        commentList: commentRes.data
      });
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  }

  private handleDateSelect = (date: string) => {
    this.setState({ selectedDate: date });
  };

  private handleTimeSelect = (time: string) => {
    this.setState({ selectedTime: time });
  };

  private handleElectricianSelect = (id: number) => {
    this.setState({ selectedElectricianId: id });
  };

  private handleRemarkChange = (value: string) => {
    this.setState({ remark: value });
  };

  private handleBookService = () => {
    const { selectedDate, selectedTime, selectedElectricianId, remark } = this.state;
    if (!selectedDate) {
      Taro.showToast({ title: '请选择预约日期', icon: 'none' });
      return;
    }
    if (!selectedTime) {
      Taro.showToast({ title: '请选择预约时间', icon: 'none' });
      return;
    }
    this.props.onBookService({
      serviceId: this.props.serviceId,
      bookDate: selectedDate,
      bookTime: selectedTime,
      electricianId: selectedElectricianId || undefined,
      remark
    });
  };

  public render() {
    const { serviceInfo, electricianList, commentList } = this.state;
    const { selectedDate, selectedTime, selectedElectricianId, remark } = this.state;
    return (
      <ScrollView className="service-detail-page" scrollY>
        <View className="service-header">
          <Image
            className="service-image"
            src={serviceInfo.imageUrl}
            mode="aspectFill"
          />
          <View className="service-info">
            <Text className="service-name">{serviceInfo.name}</Text>
            <View className="service-tags">
              {serviceInfo.tags?.map((tag) => (
                <AtTag key={tag} size="small">{tag}</AtTag>
              ))}
            </View>
            <View className="service-price">
              <Text className="price">¥{serviceInfo.price}</Text>
              <Text className="unit">/次</Text>
            </View>
            <View className="service-stats">
              <View className="stat-item">
                <Text className="stat-value">{serviceInfo.salesCount}</Text>
                <Text className="stat-label">已售</Text>
              </View>
              <View className="stat-item">
                <AtRate value={serviceInfo.rating} size={12} />
                <Text className="stat-label">{serviceInfo.rating}分</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="service-desc">
          <View className="section-title">服务描述</View>
          <View className="desc-content">
            <Text>{serviceInfo.description}</Text>
          </View>
        </View>

        <View className="service-flow">
          <View className="section-title">服务流程</View>
          <View className="flow-steps">
            {serviceFlowSteps.map((step, index) => (
              <View key={index} className="flow-step">
                <View className="step-icon">{index + 1}</View>
                <Text className="step-title">{step.title}</Text>
                <Text className="step-desc">{step.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="book-section">
          <View className="section-title">预约信息</View>
          <View className="book-form">
            <View className="form-item">
              <Text className="label">预约日期</Text>
              <View className="date-selector">
                {availableDates.map((date) => (
                  <View
                    key={date}
                    className={`date-item ${selectedDate === date ? 'active' : ''}`}
                    onClick={() => this.handleDateSelect(date)}
                  >
                    {date}
                  </View>
                ))}
              </View>
            </View>
            <View className="form-item">
              <Text className="label">预约时间</Text>
              <View className="time-selector">
                {availableTimes.map((time) => (
                  <View
                    key={time}
                    className={`time-item ${selectedTime === time ? 'active' : ''}`}
                    onClick={() => this.handleTimeSelect(time)}
                  >
                    {time}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <ElectricianList
          electricianList={electricianList}
          selectedId={selectedElectricianId}
          onSelect={this.handleElectricianSelect}
        />

        <View className="remark-section">
          <View className="section-title">备注</View>
          <textarea
            className="remark-input"
            placeholder="请输入备注信息"
            value={remark}
            onInput={(e) => this.handleRemarkChange(e.detail.value)}
          />
        </View>

        <View className="bottom-bar">
          <View className="price-info">
            <Text className="label">合计：</Text>
            <Text className="price">¥{serviceInfo.price}</Text>
          </View>
          <AtButton
            type="primary"
            className="book-btn"
            onClick={this.handleBookService}
          >
            立即预约
          </AtButton>
        </View>
      </ScrollView>
    );
  }
}
```

### 6.1.3 订单列表组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtButton, AtTabs, AtTabsPane, AtIcon } from 'taro-ui';
import OrderCard from './components/OrderCard';
import './list.less';

interface OrderListPageProps {
  orderList: Order[];
  loading: boolean;
  hasMore: boolean;
  currentTab: number;
  onTabChange: (index: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onCancelOrder: (orderId: number) => void;
  onPayOrder: (orderId: number) => void;
  onConfirmReceive: (orderId: number) => void;
  onViewDetail: (orderId: number) => void;
  onContactService: (orderId: number) => void;
}

export default class OrderListPage extends Taro.Component<OrderListPageProps> {
  private tabList = [
    { title: '全部' },
    { title: '待支付' },
    { title: '待服务' },
    { title: '服务中' },
    { title: '已完成' },
    { title: '已取消' }
  ];

  private handleTabClick = (index: number) => {
    this.props.onTabChange(index);
  };

  private handleScrollToLower = () => {
    if (this.props.hasMore && !this.props.loading) {
      this.props.onLoadMore();
    }
  };

  private handleRefresh = () => {
    this.props.onRefresh();
  };

  private handleCancelOrder = (orderId: number) => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.props.onCancelOrder(orderId);
        }
      }
    });
  };

  private handlePayOrder = (orderId: number) => {
    this.props.onPayOrder(orderId);
  };

  private handleConfirmReceive = (orderId: number) => {
    Taro.showModal({
      title: '确认完成',
      content: '是否确认服务已完成？',
      success: (res) => {
        if (res.confirm) {
          this.props.onConfirmReceive(orderId);
        }
      }
    });
  };

  private handleViewDetail = (orderId: number) => {
    this.props.onViewDetail(orderId);
  };

  private handleContactService = (orderId: number) => {
    this.props.onContactService(orderId);
  };

  public render() {
    const { orderList, loading, hasMore, currentTab } = this.props;
    return (
      <View className="order-list-page">
        <AtTabs
          current={currentTab}
          tabList={this.tabList}
          onClick={this.handleTabClick}
          scroll
        >
          {this.tabList.map((tab, index) => (
            <AtTabsPane key={index} current={currentTab} tabIndex={index}>
              <ScrollView
                className="order-list"
                scrollY
                onScrollToLower={this.handleScrollToLower}
              >
                {orderList.length === 0 ? (
                  <View className="empty-state">
                    <AtIcon value="shopping-cart" size="60" color="#ccc" />
                    <Text className="empty-text">暂无订单</Text>
                  </View>
                ) : (
                  orderList.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={() => this.handleCancelOrder(order.id)}
                      onPay={() => this.handlePayOrder(order.id)}
                      onConfirm={() => this.handleConfirmReceive(order.id)}
                      onDetail={() => this.handleViewDetail(order.id)}
                      onContact={() => this.handleContactService(order.id)}
                    />
                  ))
                )}
                {loading && (
                  <View className="loading-state">
                    <Text>加载中...</Text>
                  </View>
                )}
                {!hasMore && orderList.length > 0 && (
                  <View className="no-more">
                    <Text>没有更多了</Text>
                  </View>
                )}
              </ScrollView>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    );
  }
}
```

### 6.1.4 订单卡片组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtButton, AtIcon } from 'taro-ui';
import './card.less';

interface OrderCardProps {
  order: Order;
  onCancel: () => void;
  onPay: () => void;
  onConfirm: () => void;
  onDetail: () => void;
  onContact: () => void;
}

export default class OrderCard extends Taro.Component<OrderCardProps> {
  private getStatusText = (status: number): string => {
    const statusMap = {
      1: '待支付',
      2: '待接单',
      3: '已接单',
      4: '服务中',
      5: '待确认',
      6: '已完成',
      7: '已取消',
      8: '退款中',
      9: '已退款'
    };
    return statusMap[status] || '未知';
  };

  private getStatusColor = (status: number): string => {
    const colorMap = {
      1: '#ff6b6b',
      2: '#ffa502',
      3: '#ffa502',
      4: '#26de81',
      5: '#26de81',
      6: '#26de81',
      7: '#a4b0be',
      8: '#ffa502',
      9: '#a4b0be'
    };
    return colorMap[status] || '#333';
  };

  public render() {
    const { order } = this.props;
    return (
      <View className="order-card">
        <View className="card-header">
          <Text className="order-no">订单号：{order.orderNo}</Text>
          <Text
            className="order-status"
            style={{ color: this.getStatusColor(order.status) }}
          >
            {this.getStatusText(order.status)}
          </Text>
        </View>

        <View className="card-body" onClick={this.props.onDetail}>
          <Image
            className="service-image"
            src={order.serviceImage}
            mode="aspectFill"
          />
          <View className="service-info">
            <Text className="service-name">{order.serviceName}</Text>
            <Text className="service-desc">{order.serviceDescription}</Text>
            <View className="book-info">
              <Text className="book-date">{order.bookDate}</Text>
              <Text className="book-time">{order.bookTime}</Text>
            </View>
            {order.electricianInfo && (
              <View className="electrician-info">
                <Image
                  className="electrician-avatar"
                  src={order.electricianInfo.avatar}
                />
                <Text className="electrician-name">
                  {order.electricianInfo.name}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="card-footer">
          <View className="price-info">
            <Text className="label">合计：</Text>
            <Text className="price">¥{order.totalAmount}</Text>
          </View>
          <View className="action-buttons">
            {order.status === 1 && (
              <AtButton
                size="small"
                type="primary"
                onClick={this.props.onPay}
              >
                去支付
              </AtButton>
            )}
            {order.status === 2 && (
              <AtButton
                size="small"
                onClick={this.props.onCancel}
              >
                取消订单
              </AtButton>
            )}
            {order.status === 5 && (
              <AtButton
                size="small"
                type="primary"
                onClick={this.props.onConfirm}
              >
                确认完成
              </AtButton>
            )}
            <AtButton
              size="small"
              onClick={this.props.onDetail}
            >
              查看详情
            </AtButton>
            <AtButton
              size="small"
              onClick={this.props.onContact}
            >
              联系客服
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(content)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
