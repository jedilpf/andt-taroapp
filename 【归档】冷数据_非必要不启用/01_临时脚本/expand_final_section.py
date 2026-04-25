#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

output_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

final_section = '''

### 4.10 后端核心代码 - 会员等级管理

```java
package com.andiantong.member.controller;

import com.andiantong.common.core.Result;
import com.andiantong.member.dto.*;
import com.andiantong.member.service.MemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Api(tags = "会员管理")
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;

    @ApiOperation("获取会员等级列表")
    @GetMapping("/level/list")
    public Result<List<MemberLevelVO>> getMemberLevelList() {
        log.info("获取会员等级列表");
        List<MemberLevelVO> levels = memberService.getMemberLevelList();
        return Result.success(levels);
    }

    @ApiOperation("获取会员等级详情")
    @GetMapping("/level/{levelId}")
    public Result<MemberLevelVO> getMemberLevelDetail(@PathVariable Long levelId) {
        log.info("获取会员等级详情: levelId={}", levelId);
        MemberLevelVO detail = memberService.getMemberLevelDetail(levelId);
        return Result.success(detail);
    }

    @ApiOperation("创建会员等级")
    @PostMapping("/level")
    public Result<String> createMemberLevel(@RequestBody CreateMemberLevelDTO levelDTO) {
        log.info("创建会员等级: name={}", levelDTO.getName());
        memberService.createMemberLevel(levelDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新会员等级")
    @PutMapping("/level/{levelId}")
    public Result<String> updateMemberLevel(@PathVariable Long levelId, @RequestBody UpdateMemberLevelDTO levelDTO) {
        log.info("更新会员等级: levelId={}", levelId);
        memberService.updateMemberLevel(levelId, levelDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除会员等级")
    @DeleteMapping("/level/{levelId}")
    public Result<String> deleteMemberLevel(@PathVariable Long levelId) {
        log.info("删除会员等级: levelId={}", levelId);
        memberService.deleteMemberLevel(levelId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取会员权益列表")
    @GetMapping("/benefit/list")
    public Result<List<MemberBenefitVO>> getMemberBenefitList() {
        log.info("获取会员权益列表");
        List<MemberBenefitVO> benefits = memberService.getMemberBenefitList();
        return Result.success(benefits);
    }

    @ApiOperation("获取会员权益详情")
    @GetMapping("/benefit/{benefitId}")
    public Result<MemberBenefitVO> getMemberBenefitDetail(@PathVariable Long benefitId) {
        log.info("获取会员权益详情: benefitId={}", benefitId);
        MemberBenefitVO detail = memberService.getMemberBenefitDetail(benefitId);
        return Result.success(detail);
    }

    @ApiOperation("创建会员权益")
    @PostMapping("/benefit")
    public Result<String> createMemberBenefit(@RequestBody CreateMemberBenefitDTO benefitDTO) {
        log.info("创建会员权益: name={}", benefitDTO.getName());
        memberService.createMemberBenefit(benefitDTO);
        return Result.success("创建成功");
    }

    @ApiOperation("更新会员权益")
    @PutMapping("/benefit/{benefitId}")
    public Result<String> updateMemberBenefit(@PathVariable Long benefitId, @RequestBody UpdateMemberBenefitDTO benefitDTO) {
        log.info("更新会员权益: benefitId={}", benefitId);
        memberService.updateMemberBenefit(benefitId, benefitDTO);
        return Result.success("更新成功");
    }

    @ApiOperation("删除会员权益")
    @DeleteMapping("/benefit/{benefitId}")
    public Result<String> deleteMemberBenefit(@PathVariable Long benefitId) {
        log.info("删除会员权益: benefitId={}", benefitId);
        memberService.deleteMemberBenefit(benefitId);
        return Result.success("删除成功");
    }

    @ApiOperation("获取我的会员信息")
    @GetMapping("/info")
    public Result<MemberInfoVO> getMyMemberInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的会员信息: userId={}", userId);
        MemberInfoVO info = memberService.getMyMemberInfo(userId);
        return Result.success(info);
    }

    @ApiOperation("获取会员等级")
    @GetMapping("/level")
    public Result<MemberLevelVO> getMyMemberLevel(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取会员等级: userId={}", userId);
        MemberLevelVO level = memberService.getMyMemberLevel(userId);
        return Result.success(level);
    }

    @ApiOperation("升级会员等级")
    @PostMapping("/upgrade")
    public Result<String> upgradeMemberLevel(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("升级会员等级: userId={}", userId);
        memberService.upgradeMemberLevel(userId);
        return Result.success("升级成功");
    }

    @ApiOperation("获取我的权益")
    @GetMapping("/benefits")
    public Result<List<MemberBenefitVO>> getMyBenefits(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的权益: userId={}", userId);
        List<MemberBenefitVO> benefits = memberService.getMyBenefits(userId);
        return Result.success(benefits);
    }

    @ApiOperation("使用会员权益")
    @PostMapping("/benefit/use")
    public Result<String> useMemberBenefit(@RequestBody UseBenefitDTO useBenefitDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("使用会员权益: userId={}, benefitId={}", userId, useBenefitDTO.getBenefitId());
        memberService.useMemberBenefit(userId, useBenefitDTO);
        return Result.success("使用成功");
    }

    @ApiOperation("获取积分明细")
    @GetMapping("/points/detail")
    public Result<List<PointsDetailVO>> getPointsDetail(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取积分明细: userId={}", userId);
        List<PointsDetailVO> details = memberService.getPointsDetail(userId, pageNum, pageSize);
        return Result.success(details);
    }

    @ApiOperation("获取积分余额")
    @GetMapping("/points/balance")
    public Result<Map<String, Object>> getPointsBalance(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取积分余额: userId={}", userId);
        Map<String, Object> balance = memberService.getPointsBalance(userId);
        return Result.success(balance);
    }

    @ApiOperation("积分签到")
    @PostMapping("/points/signin")
    public Result<Map<String, Object>> pointsSignIn(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("积分签到: userId={}", userId);
        Map<String, Object> result = memberService.pointsSignIn(userId);
        return Result.success(result);
    }

    @ApiOperation("获取签到记录")
    @GetMapping("/points/signin/records")
    public Result<List<SignInRecordVO>> getSignInRecords(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取签到记录: userId={}", userId);
        List<SignInRecordVO> records = memberService.getSignInRecords(userId);
        return Result.success(records);
    }

    @ApiOperation("获取连续签到奖励")
    @GetMapping("/points/signin/rewards")
    public Result<List<SignInRewardVO>> getSignInRewards() {
        log.info("获取连续签到奖励");
        List<SignInRewardVO> rewards = memberService.getSignInRewards();
        return Result.success(rewards);
    }

    @ApiOperation("领取连续签到奖励")
    @PostMapping("/points/signin/reward/{days}")
    public Result<String> receiveSignInReward(@PathVariable Integer days, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取连续签到奖励: userId={}, days={}", userId, days);
        memberService.receiveSignInReward(userId, days);
        return Result.success("领取成功");
    }

    @ApiOperation("获取任务列表")
    @GetMapping("/task/list")
    public Result<List<MemberTaskVO>> getMemberTaskList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取任务列表: userId={}", userId);
        List<MemberTaskVO> tasks = memberService.getMemberTaskList(userId);
        return Result.success(tasks);
    }

    @ApiOperation("完成任务")
    @PostMapping("/task/{taskId}/complete")
    public Result<String> completeTask(@PathVariable Long taskId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("完成任务: userId={}, taskId={}", userId, taskId);
        memberService.completeTask(userId, taskId);
        return Result.success("完成成功");
    }

    @ApiOperation("领取任务奖励")
    @PostMapping("/task/{taskId}/reward")
    public Result<String> receiveTaskReward(@PathVariable Long taskId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取任务奖励: userId={}, taskId={}", userId, taskId);
        memberService.receiveTaskReward(userId, taskId);
        return Result.success("领取成功");
    }

    @ApiOperation("获取会员日活动")
    @GetMapping("/memberday/activity")
    public Result<MemberDayActivityVO> getMemberDayActivity() {
        log.info("获取会员日活动");
        MemberDayActivityVO activity = memberService.getMemberDayActivity();
        return Result.success(activity);
    }

    @ApiOperation("参与会员日活动")
    @PostMapping("/memberday/join")
    public Result<String> joinMemberDayActivity(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("参与会员日活动: userId={}", userId);
        memberService.joinMemberDayActivity(userId);
        return Result.success("参与成功");
    }

    @ApiOperation("获取会员生日礼")
    @GetMapping("/birthday/gift")
    public Result<Map<String, Object>> getBirthdayGift(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取会员生日礼: userId={}", userId);
        Map<String, Object> gift = memberService.getBirthdayGift(userId);
        return Result.success(gift);
    }

    @ApiOperation("领取会员生日礼")
    @PostMapping("/birthday/gift/receive")
    public Result<String> receiveBirthdayGift(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("领取会员生日礼: userId={}", userId);
        memberService.receiveBirthdayGift(userId);
        return Result.success("领取成功");
    }

    @ApiOperation("获取会员排行榜")
    @GetMapping("/ranking")
    public Result<List<MemberRankingVO>> getMemberRanking(@RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取会员排行榜: limit={}", limit);
        List<MemberRankingVO> ranking = memberService.getMemberRanking(limit);
        return Result.success(ranking);
    }

    @ApiOperation("获取会员统计")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getMemberStatistics(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取会员统计: userId={}", userId);
        Map<String, Object> statistics = memberService.getMemberStatistics(userId);
        return Result.success(statistics);
    }

    @ApiOperation("获取成长值记录")
    @GetMapping("/growth/records")
    public Result<List<GrowthRecordVO>> getGrowthRecords(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取成长值记录: userId={}", userId);
        List<GrowthRecordVO> records = memberService.getGrowthRecords(userId, pageNum, pageSize);
        return Result.success(records);
    }

    @ApiOperation("获取成长值余额")
    @GetMapping("/growth/balance")
    public Result<Map<String, Object>> getGrowthBalance(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取成长值余额: userId={}", userId);
        Map<String, Object> balance = memberService.getGrowthBalance(userId);
        return Result.success(balance);
    }

    @ApiOperation("获取等级徽章列表")
    @GetMapping("/badge/list")
    public Result<List<MemberBadgeVO>> getMemberBadgeList() {
        log.info("获取等级徽章列表");
        List<MemberBadgeVO> badges = memberService.getMemberBadgeList();
        return Result.success(badges);
    }

    @ApiOperation("获取我的徽章")
    @GetMapping("/badge/my")
    public Result<List<MemberBadgeVO>> getMyBadges(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取我的徽章: userId={}", userId);
        List<MemberBadgeVO> badges = memberService.getMyBadges(userId);
        return Result.success(badges);
    }

    @ApiOperation("绑定徽章")
    @PostMapping("/badge/{badgeId}/bind")
    public Result<String> bindBadge(@PathVariable Long badgeId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("绑定徽章: userId={}, badgeId={}", userId, badgeId);
        memberService.bindBadge(userId, badgeId);
        return Result.success("绑定成功");
    }

    @ApiOperation("获取会员卡")
    @GetMapping("/card")
    public Result<MemberCardVO> getMemberCard(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取会员卡: userId={}", userId);
        MemberCardVO card = memberService.getMemberCard(userId);
        return Result.success(card);
    }

    @ApiOperation("激活会员卡")
    @PostMapping("/card/activate")
    public Result<String> activateMemberCard(@RequestBody ActivateCardDTO activateCardDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("激活会员卡: userId={}", userId);
        memberService.activateMemberCard(userId, activateCardDTO);
        return Result.success("激活成功");
    }

    @ApiOperation("充值会员卡")
    @PostMapping("/card/recharge")
    public Result<String> rechargeMemberCard(@RequestBody RechargeCardDTO rechargeCardDTO, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("充值会员卡: userId={}", userId);
        memberService.rechargeMemberCard(userId, rechargeCardDTO);
        return Result.success("充值成功");
    }

    @ApiOperation("获取充值记录")
    @GetMapping("/card/recharge/records")
    public Result<List<RechargeRecordVO>> getRechargeRecords(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取充值记录: userId={}", userId);
        List<RechargeRecordVO> records = memberService.getRechargeRecords(userId, pageNum, pageSize);
        return Result.success(records);
    }

    @ApiOperation("获取消费记录")
    @GetMapping("/consumption/records")
    public Result<List<ConsumptionRecordVO>> getConsumptionRecords(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取消费记录: userId={}", userId);
        List<ConsumptionRecordVO> records = memberService.getConsumptionRecords(userId, pageNum, pageSize);
        return Result.success(records);
    }

    @ApiOperation("获取会员权益领取记录")
    @GetMapping("/benefit/records")
    public Result<List<BenefitRecordVO>> getBenefitRecords(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("获取会员权益领取记录: userId={}", userId);
        List<BenefitRecordVO> records = memberService.getBenefitRecords(userId, pageNum, pageSize);
        return Result.success(records);
    }
}
```

'''

with open(output_file, 'a', encoding='utf-8') as f:
    f.write(final_section)

print(f"已追加代码，当前文件行数:")
os.system(f'powershell -Command "(Get-Content \'{output_file}\').Count"')
