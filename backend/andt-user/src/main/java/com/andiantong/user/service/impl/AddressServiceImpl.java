package com.andiantong.user.service.impl;

import com.andiantong.common.exception.BusinessException;
import com.andiantong.user.dto.AddressDTO;
import com.andiantong.user.entity.Address;
import com.andiantong.user.mapper.AddressMapper;
import com.andiantong.user.service.AddressService;
import com.andiantong.user.vo.AddressVO;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public AddressVO addAddress(Long userId, AddressDTO dto) {
        Address address = new Address();
        BeanUtils.copyProperties(dto, address);
        address.setUserId(userId);

        // 如果设置为默认地址，先取消其他默认
        if (dto.getIsDefault() != null && dto.getIsDefault() == 1) {
            clearDefaultAddress(userId);
        }

        addressMapper.insert(address);
        return toVO(address);
    }

    @Override
    @Transactional
    public AddressVO updateAddress(Long userId, Long id, AddressDTO dto) {
        Address address = addressMapper.selectById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("地址不存在");
        }

        if (dto.getProvince() != null) {
            address.setProvince(dto.getProvince());
        }
        if (dto.getCity() != null) {
            address.setCity(dto.getCity());
        }
        if (dto.getDistrict() != null) {
            address.setDistrict(dto.getDistrict());
        }
        if (dto.getDetail() != null) {
            address.setDetail(dto.getDetail());
        }
        if (dto.getContactName() != null) {
            address.setContactName(dto.getContactName());
        }
        if (dto.getContactPhone() != null) {
            address.setContactPhone(dto.getContactPhone());
        }
        if (dto.getIsDefault() != null) {
            if (dto.getIsDefault() == 1) {
                clearDefaultAddress(userId);
            }
            address.setIsDefault(dto.getIsDefault());
        }

        addressMapper.updateById(address);
        return toVO(address);
    }

    @Override
    public void deleteAddress(Long userId, Long id) {
        Address address = addressMapper.selectById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("地址不存在");
        }
        addressMapper.deleteById(id);
    }

    @Override
    public List<AddressVO> getAddressList(Long userId) {
        List<Address> addresses = addressMapper.selectByUserId(userId);
        return addresses.stream().map(this::toVO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void setDefaultAddress(Long userId, Long id) {
        Address address = addressMapper.selectById(id);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException("地址不存在");
        }

        // 先取消当前默认
        clearDefaultAddress(userId);

        // 设置新默认
        address.setIsDefault(1);
        addressMapper.updateById(address);
    }

    /**
     * 取消用户所有默认地址
     */
    private void clearDefaultAddress(Long userId) {
        LambdaUpdateWrapper<Address> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Address::getUserId, userId)
               .eq(Address::getIsDefault, 1)
               .set(Address::getIsDefault, 0);
        addressMapper.update(null, wrapper);
    }

    private AddressVO toVO(Address address) {
        AddressVO vo = new AddressVO();
        vo.setId(address.getId());
        vo.setProvince(address.getProvince());
        vo.setCity(address.getCity());
        vo.setDistrict(address.getDistrict());
        vo.setDetail(address.getDetail());
        vo.setContactName(address.getContactName());
        vo.setContactPhone(address.getContactPhone());
        vo.setIsDefault(address.getIsDefault());
        vo.setCreateTime(address.getCreateTime());
        return vo;
    }
}
