package com.andiantong.user.controller;

import com.andiantong.common.Result;
import com.andiantong.user.dto.AddressDTO;
import com.andiantong.user.service.AddressService;
import com.andiantong.user.vo.AddressVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /**
     * 获取用户地址列表
     */
    @GetMapping("/list")
    public Result<List<AddressVO>> getAddressList(@RequestAttribute("userId") Long userId) {
        return Result.success(addressService.getAddressList(userId));
    }

    /**
     * 添加地址
     */
    @PostMapping("/add")
    public Result<AddressVO> addAddress(
            @RequestAttribute("userId") Long userId,
            @RequestBody AddressDTO dto) {
        return Result.success(addressService.addAddress(userId, dto));
    }

    /**
     * 更新地址
     */
    @PostMapping("/update")
    public Result<AddressVO> updateAddress(
            @RequestAttribute("userId") Long userId,
            @RequestBody AddressDTO dto) {
        return Result.success(addressService.updateAddress(userId, dto.getId(), dto));
    }

    /**
     * 删除地址
     */
    @PostMapping("/delete/{id}")
    public Result<Void> deleteAddress(
            @RequestAttribute("userId") Long userId,
            @PathVariable Long id) {
        addressService.deleteAddress(userId, id);
        return Result.success();
    }

    /**
     * 设置默认地址
     */
    @PostMapping("/default/{id}")
    public Result<Void> setDefaultAddress(
            @RequestAttribute("userId") Long userId,
            @PathVariable Long id) {
        addressService.setDefaultAddress(userId, id);
        return Result.success();
    }
}
