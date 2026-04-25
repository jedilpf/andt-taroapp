#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

section6 = '''

### 5.2 后端核心代码 - 库存管理Controller

```java
package com.andiantong.inventory.controller;

import com.andiantong.common.core.Result;
import com.andiantong.inventory.dto.*;
import com.andiantong.inventory.service.InventoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Api(tags = "库存管理")
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    @ApiOperation("获取库存列表")
    @GetMapping("/list")
    public Result<List<InventoryVO>> getInventoryList(
            @RequestParam(required = false) String warehouseCode,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取库存列表: warehouseCode={}, keyword={}", warehouseCode, keyword);
        List<InventoryVO> list = inventoryService.getInventoryList(warehouseCode, keyword, pageNum, pageSize);
        return Result.success(list);
    }

    @ApiOperation("获取库存详情")
    @GetMapping("/{inventoryId}")
    public Result<InventoryDetailVO> getInventoryDetail(@PathVariable Long inventoryId) {
        log.info("获取库存详情: inventoryId={}", inventoryId);
        InventoryDetailVO detail = inventoryService.getInventoryDetail(inventoryId);
        return Result.success(detail);
    }

    @ApiOperation("获取库存预警列表")
    @GetMapping("/warning")
    public Result<List<InventoryWarningVO>> getInventoryWarningList() {
        log.info("获取库存预警列表");
        List<InventoryWarningVO> list = inventoryService.getInventoryWarningList();
        return Result.success(list);
    }

    @ApiOperation("获取库存统计")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getInventoryStatistics() {
        log.info("获取库存统计");
        Map<String, Object> statistics = inventoryService.getInventoryStatistics();
        return Result.success(statistics);
    }

    @ApiOperation("获取库存流水")
    @GetMapping("/flow")
    public Result<List<InventoryFlowVO>> getInventoryFlow(
            @RequestParam(required = false) Long inventoryId,
            @RequestParam(required = false) String flowType,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取库存流水: inventoryId={}, flowType={}", inventoryId, flowType);
        List<InventoryFlowVO> list = inventoryService.getInventoryFlow(inventoryId, flowType, pageNum, pageSize);
        return Result.success(list);
    }

    @ApiOperation("入库")
    @PostMapping("/in")
    public Result<String> inventoryIn(@RequestBody InventoryInDTO inventoryInDTO) {
        log.info("入库: quantity={}", inventoryInDTO.getQuantity());
        inventoryService.inventoryIn(inventoryInDTO);
        return Result.success("入库成功");
    }

    @ApiOperation("出库")
    @PostMapping("/out")
    public Result<String> inventoryOut(@RequestBody InventoryOutDTO inventoryOutDTO) {
        log.info("出库: quantity={}", inventoryOutDTO.getQuantity());
        inventoryService.inventoryOut(inventoryOutDTO);
        return Result.success("出库成功");
    }

    @ApiOperation("库存调拨")
    @PostMapping("/transfer")
    public Result<String> inventoryTransfer(@RequestBody InventoryTransferDTO transferDTO) {
        log.info("库存调拨");
        inventoryService.inventoryTransfer(transferDTO);
        return Result.success("调拨成功");
    }

    @ApiOperation("库存盘点")
    @PostMapping("/check")
    public Result<String> inventoryCheck(@RequestBody InventoryCheckDTO checkDTO) {
        log.info("库存盘点");
        inventoryService.inventoryCheck(checkDTO);
        return Result.success("盘点成功");
    }

    @ApiOperation("获取盘点任务列表")
    @GetMapping("/check/task/list")
    public Result<List<InventoryCheckTaskVO>> getCheckTaskList() {
        log.info("获取盘点任务列表");
        List<InventoryCheckTaskVO> list = inventoryService.getCheckTaskList();
        return Result.success(list);
    }

    @ApiOperation("创建盘点任务")
    @PostMapping("/check/task")
    public Result<String> createCheckTask(@RequestBody CreateCheckTaskDTO taskDTO) {
        log.info("创建盘点任务");
        inventoryService.createCheckTask(taskDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("获取仓库列表")
    @GetMapping("/warehouse/list")
    public Result<List<WarehouseVO>> getWarehouseList() {
        log.info("获取仓库列表");
        List<WarehouseVO> list = inventoryService.getWarehouseList();
        return Result.success(list);
    }

    @ApiOperation("获取仓库详情")
    @GetMapping("/warehouse/{warehouseId}")
    public Result<WarehouseVO> getWarehouseDetail(@PathVariable Long warehouseId) {
        log.info("获取仓库详情: warehouseId={}", warehouseId);
        WarehouseVO detail = inventoryService.getWarehouseDetail(warehouseId);
        return Result.success(detail);
    }

    @ApiOperation("创建仓库")
    @PostMapping("/warehouse")
    public Result<String> createWarehouse(@RequestBody CreateWarehouseDTO warehouseDTO) {
        log.info("创建仓库: name={}", warehouseDTO.getName());
        inventoryService.createWarehouse(warehouseDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新仓库")
    @PutMapping("/warehouse/{warehouseId}")
    public Result<String> updateWarehouse(@PathVariable Long warehouseId, @RequestBody UpdateWarehouseDTO warehouseDTO) {
        log.info("更新仓库: warehouseId={}", warehouseId);
        inventoryService.updateWarehouse(warehouseId, warehouseDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除仓库")
    @DeleteMapping("/warehouse/{warehouseId}")
    public Result<String> deleteWarehouse(@PathVariable Long warehouseId) {
        log.info("删除仓库: warehouseId={}", warehouseId);
        inventoryService.deleteWarehouse(warehouseId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取货架列表")
    @GetMapping("/shelf/list")
    public Result<List<ShelfVO>> getShelfList(@RequestParam Long warehouseId) {
        log.info("获取货架列表: warehouseId={}", warehouseId);
        List<ShelfVO> list = inventoryService.getShelfList(warehouseId);
        return Result.success(list);
    }

    @ApiOperation("创建货架")
    @PostMapping("/shelf")
    public Result<String> createShelf(@RequestBody CreateShelfDTO shelfDTO) {
        log.info("创建货架");
        inventoryService.createShelf(shelfDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新货架")
    @PutMapping("/shelf/{shelfId}")
    public Result<String> updateShelf(@PathVariable Long shelfId, @RequestBody UpdateShelfDTO shelfDTO) {
        log.info("更新货架: shelfId={}", shelfId);
        inventoryService.updateShelf(shelfId, shelfDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除货架")
    @DeleteMapping("/shelf/{shelfId}")
    public Result<String> deleteShelf(@PathVariable Long shelfId) {
        log.info("删除货架: shelfId={}", shelfId);
        inventoryService.deleteShelf(shelfId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取物料列表")
    @GetMapping("/material/list")
    public Result<List<MaterialVO>> getMaterialList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取物料列表: keyword={}", keyword);
        List<MaterialVO> list = inventoryService.getMaterialList(keyword, pageNum, pageSize);
        return Result.success(list);
    }

    @ApiOperation("获取物料详情")
    @GetMapping("/material/{materialId}")
    public Result<MaterialVO> getMaterialDetail(@PathVariable Long materialId) {
        log.info("获取物料详情: materialId={}", materialId);
        MaterialVO detail = inventoryService.getMaterialDetail(materialId);
        return Result.success(detail);
    }

    @ApiOperation("创建物料")
    @PostMapping("/material")
    public Result<String> createMaterial(@RequestBody CreateMaterialDTO materialDTO) {
        log.info("创建物料: name={}", materialDTO.getName());
        inventoryService.createMaterial(materialDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新物料")
    @PutMapping("/material/{materialId}")
    public Result<String> updateMaterial(@PathVariable Long materialId, @RequestBody UpdateMaterialDTO materialDTO) {
        log.info("更新物料: materialId={}", materialId);
        inventoryService.updateMaterial(materialId, materialDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除物料")
    @DeleteMapping("/material/{materialId}")
    public Result<String> deleteMaterial(@PathVariable Long materialId) {
        log.info("删除物料: materialId={}", materialId);
        inventoryService.deleteMaterial(materialId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取物料分类列表")
    @GetMapping("/material/category/list")
    public Result<List<MaterialCategoryVO>> getMaterialCategoryList() {
        log.info("获取物料分类列表");
        List<MaterialCategoryVO> list = inventoryService.getMaterialCategoryList();
        return Result.success(list);
    }

    @ApiOperation("创建物料分类")
    @PostMapping("/material/category")
    public Result<String> createMaterialCategory(@RequestBody CreateMaterialCategoryDTO categoryDTO) {
        log.info("创建物料分类: name={}", categoryDTO.getName());
        inventoryService.createMaterialCategory(categoryDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新物料分类")
    @PutMapping("/material/category/{categoryId}")
    public Result<String> updateMaterialCategory(@PathVariable Long categoryId, @RequestBody UpdateMaterialCategoryDTO categoryDTO) {
        log.info("更新物料分类: categoryId={}", categoryId);
        inventoryService.updateMaterialCategory(categoryId, categoryDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除物料分类")
    @DeleteMapping("/material/category/{categoryId}")
    public Result<String> deleteMaterialCategory(@PathVariable Long categoryId) {
        log.info("删除物料分类: categoryId={}", categoryId);
        inventoryService.deleteMaterialCategory(categoryId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取库存报表")
    @GetMapping("/report")
    public Result<Map<String, Object>> getInventoryReport(
            @RequestParam(required = false) String warehouseCode,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取库存报表");
        Map<String, Object> report = inventoryService.getInventoryReport(warehouseCode, startDate, endDate);
        return Result.success(report);
    }

    @ApiOperation("导出库存报表")
    @GetMapping("/export")
    public void exportInventory(
            @RequestParam(required = false) String warehouseCode,
            HttpServletResponse response) {
        log.info("导出库存报表: warehouseCode={}", warehouseCode);
        inventoryService.exportInventory(warehouseCode, response);
    }

    @ApiOperation("获取库存预警配置")
    @GetMapping("/warning/config")
    public Result<InventoryWarningConfigVO> getWarningConfig() {
        log.info("获取库存预警配置");
        InventoryWarningConfigVO config = inventoryService.getWarningConfig();
        return Result.success(config);
    }

    @ApiOperation("设置库存预警配置")
    @PostMapping("/warning/config")
    public Result<String> setWarningConfig(@RequestBody InventoryWarningConfigVO configVO) {
        log.info("设置库存预警配置");
        inventoryService.setWarningConfig(configVO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取库存周转率")
    @GetMapping("/turnover")
    public Result<Map<String, Object>> getInventoryTurnover(
            @RequestParam(required = false) String warehouseCode,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取库存周转率");
        Map<String, Object> turnover = inventoryService.getInventoryTurnover(warehouseCode, startDate, endDate);
        return Result.success(turnover);
    }

    @ApiOperation("获取库存ABC分类")
    @GetMapping("/abc/classification")
    public Result<List<Map<String, Object>>> getABCClassification(
            @RequestParam(required = false) String warehouseCode) {
        log.info("获取库存ABC分类");
        List<Map<String, Object>> classification = inventoryService.getABCClassification(warehouseCode);
        return Result.success(classification);
    }

    @ApiOperation("获取库存有效期预警")
    @GetMapping("/expiry/warning")
    public Result<List<InventoryExpiryWarningVO>> getExpiryWarning(
            @RequestParam(defaultValue = "30") Integer days) {
        log.info("获取库存有效期预警: days={}", days);
        List<InventoryExpiryWarningVO> warnings = inventoryService.getExpiryWarning(days);
        return Result.success(warnings);
    }

    @ApiOperation("设置安全库存")
    @PostMapping("/safe/stock")
    public Result<String> setSafeStock(@RequestBody SetSafeStockDTO safeStockDTO) {
        log.info("设置安全库存");
        inventoryService.setSafeStock(safeStockDTO);
        return Result.success("设置成功");
    }

    @ApiOperation("获取安全库存")
    @GetMapping("/safe/stock/{materialId}")
    public Result<Map<String, Object>> getSafeStock(@PathVariable Long materialId) {
        log.info("获取安全库存: materialId={}", materialId);
        Map<String, Object> safeStock = inventoryService.getSafeStock(materialId);
        return Result.success(safeStock);
    }

    @ApiOperation("生成采购建议")
    @GetMapping("/purchase/suggestion")
    public Result<List<PurchaseSuggestionVO>> getPurchaseSuggestion() {
        log.info("生成采购建议");
        List<PurchaseSuggestionVO> suggestions = inventoryService.getPurchaseSuggestion();
        return Result.success(suggestions);
    }

    @ApiOperation("批量入库")
    @PostMapping("/batch/in")
    public Result<String> batchInventoryIn(@RequestBody BatchInventoryInDTO batchInDTO) {
        log.info("批量入库: count={}", batchInDTO.getItems().size());
        inventoryService.batchInventoryIn(batchInDTO);
        return Result.success("入库成功");
    }

    @ApiOperation("批量出库")
    @PostMapping("/batch/out")
    public Result<String> batchInventoryOut(@RequestBody BatchInventoryOutDTO batchOutDTO) {
        log.info("批量出库: count={}", batchOutDTO.getItems().size());
        inventoryService.batchInventoryOut(batchOutDTO);
        return Result.success("出库成功");
    }

    @ApiOperation("锁定库存")
    @PostMapping("/lock")
    public Result<String> lockInventory(@RequestBody LockInventoryDTO lockDTO) {
        log.info("锁定库存: materialId={}, quantity={}", lockDTO.getMaterialId(), lockDTO.getQuantity());
        inventoryService.lockInventory(lockDTO);
        return Result.success("锁定成功");
    }

    @ApiOperation("解锁库存")
    @PostMapping("/unlock")
    public Result<String> unlockInventory(@RequestBody UnlockInventoryDTO unlockDTO) {
        log.info("解锁库存: lockId={}", unlockDTO.getLockId());
        inventoryService.unlockInventory(unlockDTO);
        return Result.success("解锁成功");
    }

    @ApiOperation("获取锁定的库存")
    @GetMapping("/locked")
    public Result<List<LockedInventoryVO>> getLockedInventory(
            @RequestParam(required = false) Long materialId) {
        log.info("获取锁定的库存: materialId={}", materialId);
        List<LockedInventoryVO> list = inventoryService.getLockedInventory(materialId);
        return Result.success(list);
    }

    @ApiOperation("获取库存快照")
    @GetMapping("/snapshot")
    public Result<List<InventorySnapshotVO>> getInventorySnapshot(
            @RequestParam String snapshotDate,
            @RequestParam(required = false) String warehouseCode) {
        log.info("获取库存快照: snapshotDate={}", snapshotDate);
        List<InventorySnapshotVO> snapshots = inventoryService.getInventorySnapshot(snapshotDate, warehouseCode);
        return Result.success(snapshots);
    }

    @ApiOperation("创建库存快照")
    @PostMapping("/snapshot/create")
    public Result<String> createInventorySnapshot(@RequestBody CreateSnapshotDTO snapshotDTO) {
        log.info("创建库存快照");
        inventoryService.createInventorySnapshot(snapshotDTO);
        return Result.success("创建成功");
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(section6)

print(f"已追加代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
