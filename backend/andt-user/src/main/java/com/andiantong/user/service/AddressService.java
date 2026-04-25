package com.andiantong.user.service;

import com.andiantong.user.dto.AddressDTO;
import com.andiantong.user.vo.AddressVO;

import java.util.List;

public interface AddressService {

    /**
     * 添加地址
     */
    AddressVO addAddress(Long userId, AddressDTO dto);

    /**
     * 更新地址
     */
    AddressVO updateAddress(Long userId, Long id, AddressDTO dto);

    /**
     * 删除地址
     */
    void deleteAddress(Long userId, Long id);

    /**
     * 获取用户地址列表
     */
    List<AddressVO> getAddressList(Long userId);

    /**
     * 设置默认地址
     */
    void setDefaultAddress(Long userId, Long id);
}
