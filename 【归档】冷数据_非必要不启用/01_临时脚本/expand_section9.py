import os

md_file = r"c:\Users\21389\Downloads\andt1\12259\安电通-软著申请材料-2026.4\安电通-源代码文档.md"

content = '''
## 6.5 电工端小程序核心组件

### 6.5.1 电工首页组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView, OpenData } from '@tarojs/components';
import { AtButton, AtIcon, AtBadge, AtNoticebar } from 'taro-ui';
import './index.less';

interface ElectricianHomeProps {
  electricianInfo: Electrician;
  todayOrderCount: number;
  todayIncome: number;
  pendingOrderCount: number;
  walletInfo: WalletInfo;
  noticeList: Notice[];
  onNavigateToOrderList: (status: number) => void;
  onNavigateToWallet: () => void;
  onNavigateToProfile: () => void;
  onGrabOrder: (orderId: number) => void;
}

export default class ElectricianHomePage extends Taro.Component<ElectricianHomeProps> {
  public componentDidShow() {
    this.loadHomeData();
  }

  private async loadHomeData() {
    try {
      const [infoRes, countRes, walletRes, noticeRes] = await Promise.all([
        Api.getElectricianInfo(),
        Api.getTodayOrderCount(),
        Api.getWalletInfo(),
        Api.getNoticeList({ limit: 5 })
      ]);
      this.setState({
        electricianInfo: infoRes.data,
        todayOrderCount: countRes.data.orderCount,
        todayIncome: countRes.data.income,
        pendingOrderCount: countRes.data.pendingCount,
        walletInfo: walletRes.data,
        noticeList: noticeRes.data
      });
    } catch (error) {
      console.error('加载数据失败', error);
    }
  }

  private handleOrderTap = (status: number) => {
    Taro.navigateTo({
      url: `/pages/electrician/order-list/index?status=${status}`
    });
  };

  private handleWalletTap = () => {
    this.props.onNavigateToWallet();
  };

  private handleProfileTap = () => {
    this.props.onNavigateToProfile();
  };

  private handleGrabOrder = (orderId: number) => {
    Taro.showModal({
      title: '确认抢单',
      content: '确定要接此订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.props.onGrabOrder(orderId);
        }
      }
    });
  };

  public render() {
    const {
      electricianInfo,
      todayOrderCount,
      todayIncome,
      pendingOrderCount,
      walletInfo,
      noticeList
    } = this.props;

    return (
      <ScrollView className="electrician-home-page" scrollY>
        <View className="header">
          <View className="user-section" onClick={this.handleProfileTap}>
            {electricianInfo.avatar ? (
              <Image
                className="avatar"
                src={electricianInfo.avatar}
              />
            ) : (
              <OpenData className="avatar" type="userAvatar" />
            )}
            <View className="info">
              <Text className="name">{electricianInfo.name}</Text>
              <View className="level">
                <AtIcon value="star" size="14" color="#ffd700" />
                <Text className="level-text">Lv.{electricianInfo.level}</Text>
              </View>
              <View className="certify-status">
                {electricianInfo.certified ? (
                  <Text className="certified">已认证</Text>
                ) : (
                  <Text className="uncertified">未认证</Text>
                )}
              </View>
            </View>
          </View>
          <View className="wallet-section" onClick={this.handleWalletTap}>
            <View className="wallet-info">
              <Text className="label">今日收入</Text>
              <Text className="amount">¥{todayIncome}</Text>
            </View>
            <View className="wallet-icon">
              <AtIcon value="credit-card" size="24" color="#fff" />
            </View>
          </View>
        </View>

        {noticeList.length > 0 && (
          <View className="notice-section">
            <AtNoticebar icon="volume-up" marquee>
              {noticeList.map(n => n.title).join('    ')}
            </AtNoticebar>
          </View>
        )}

        <View className="stats-section">
          <View
            className="stat-item"
            onClick={() => this.handleOrderTap(1)}
          >
            <AtBadge value={pendingOrderCount} maxValue={99}>
              <AtIcon value="shopping-cart" size="28" color="#333" />
            </AtBadge>
            <Text className="stat-label">待抢订单</Text>
          </View>
          <View
            className="stat-item"
            onClick={() => this.handleOrderTap(2)}
          >
            <AtIcon value="clock" size="28" color="#333" />
            <Text className="stat-label">待服务</Text>
          </View>
          <View
            className="stat-item"
            onClick={() => this.handleOrderTap(3)}
          >
            <AtIcon value="loading" size="28" color="#333" />
            <Text className="stat-label">服务中</Text>
          </View>
          <View
            className="stat-item"
            onClick={() => this.handleOrderTap(4)}
          >
            <AtIcon value="check" size="28" color="#333" />
            <Text className="stat-label">已完成</Text>
          </View>
        </View>

        <View className="today-section">
          <View className="section-title">今日数据</View>
          <View className="today-stats">
            <View className="today-item">
              <Text className="today-value">{todayOrderCount}</Text>
              <Text className="today-label">今日订单</Text>
            </View>
            <View className="today-item">
              <Text className="today-value">¥{todayIncome}</Text>
              <Text className="today-label">今日收入</Text>
            </View>
            <View className="today-item">
              <Text className="today-value">{walletInfo.totalIncome}</Text>
              <Text className="today-label">累计收入</Text>
            </View>
            <View className="today-item">
              <Text className="today-value">{walletInfo.availableBalance}</Text>
              <Text className="today-label">可提现</Text>
            </View>
          </View>
        </View>

        <View className="quick-actions">
          <View className="action-item" onClick={this.handleWalletTap}>
            <AtIcon value="credit-card" size="24" color="#26de81" />
            <Text className="action-label">钱包</Text>
          </View>
          <View className="action-item" onClick={() => this.handleOrderTap(0)}>
            <AtIcon value="list" size="24" color="#4b7bec" />
            <Text className="action-label">订单</Text>
          </View>
          <View className="action-item" onClick={() => Taro.navigateTo({ url: '/pages/electrician/service-list/index' })}>
            <AtIcon value="tag" size="24" color="#fc5c65" />
            <Text className="action-label">服务</Text>
          </View>
          <View className="action-item" onClick={() => Taro.navigateTo({ url: '/pages/electrician/customer-list/index' })}>
            <AtIcon value="users" size="24" color="#fd9644" />
            <Text className="action-label">客户</Text>
          </View>
        </View>

        <View className="income-chart">
          <View className="section-title">收入趋势</View>
          <View className="chart-container">
            <View className="chart-placeholder">
              <Text>近7天收入趋势图表</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
```

### 6.5.2 订单抢单大厅组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView, PullDownRefresh } from '@tarojs/components';
import { AtButton, AtIcon, AtSwipeAction, AtTabs, AtTabsPane } from 'taro-ui';
import OrderCard from './components/OrderCard';
import FilterPanel from './components/FilterPanel';
import './grab.less';

interface OrderGrabPageProps {
  orderList: Order[];
  loading: boolean;
  hasMore: boolean;
  currentTab: number;
  filterParams: FilterParams;
  onTabChange: (index: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onGrabOrder: (orderId: number) => void;
  onViewDetail: (orderId: number) => void;
  onFilterChange: (params: FilterParams) => void;
}

export default class OrderGrabPage extends Taro.Component<OrderGrabPageProps> {
  private state = {
    showFilter: false
  };

  private tabList = [
    { title: '附近优先' },
    { title: '价格优先' },
    { title: '好评优先' },
    { title: '-distance' }
  ];

  public componentDidShow() {
    this.loadOrderList();
  }

  private async loadOrderList() {
    try {
      const { filterParams } = this.props;
      const res = await Api.getGrabOrderList(filterParams);
      this.setState({ orderList: res.data });
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  }

  private handleTabClick = (index: number) => {
    const sortTypes = ['distance', 'price', 'rating'];
    const newFilter = {
      ...this.props.filterParams,
      sortType: sortTypes[index]
    };
    this.props.onFilterChange(newFilter);
  };

  private handleScrollToLower = () => {
    if (this.props.hasMore && !this.props.loading) {
      this.props.onLoadMore();
    }
  };

  private handleRefresh = async () => {
    await this.loadOrderList();
    Taro.stopPullDownRefresh();
  };

  private handleGrabOrder = (orderId: number) => {
    Taro.showModal({
      title: '确认抢单',
      content: '确定要接此订单吗？抢单后请尽快联系用户并上门服务。',
      confirmText: '确认抢单',
      success: (res) => {
        if (res.confirm) {
          this.props.onGrabOrder(orderId);
        }
      }
    });
  };

  private handleViewDetail = (orderId: number) => {
    this.props.onViewDetail(orderId);
  };

  private handleFilterShow = () => {
    this.setState({ showFilter: true });
  };

  private handleFilterConfirm = (params: FilterParams) => {
    this.props.onFilterChange(params);
    this.setState({ showFilter: false });
  };

  private handleFilterClose = () => {
    this.setState({ showFilter: false });
  };

  public render() {
    const { orderList, loading, hasMore, currentTab } = this.props;
    const { showFilter } = this.state;

    return (
      <View className="order-grab-page">
        <View className="filter-bar">
          <AtTabs
            current={currentTab}
            tabList={this.tabList}
            onClick={this.handleTabClick}
            scroll
          />
          <View className="filter-btn" onClick={this.handleFilterShow}>
            <AtIcon value="filter" size="20" />
            <Text>筛选</Text>
          </View>
        </View>

        <ScrollView
          className="order-list"
          scrollY
          onScrollToLower={this.handleScrollToLower}
          lowerThreshold={100}
        >
          {orderList.length === 0 ? (
            <View className="empty-state">
              <AtIcon value="shopping-cart" size="60" color="#ccc" />
              <Text className="empty-text">暂无可抢订单</Text>
              <Text className="empty-hint">换个筛选条件试试</Text>
            </View>
          ) : (
            orderList.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                showDistance
                showGrabButton
                onGrab={() => this.handleGrabOrder(order.id)}
                onDetail={() => this.handleViewDetail(order.id)}
              />
            ))
          )}
          {loading && (
            <View className="loading-state">
              <AtIcon value="loading" size={20} />
              <Text>加载中...</Text>
            </View>
          )}
          {!hasMore && orderList.length > 0 && (
            <View className="no-more">
              <Text>没有更多订单了</Text>
            </View>
          )}
        </ScrollView>

        {showFilter && (
          <FilterPanel
            params={this.props.filterParams}
            onConfirm={this.handleFilterConfirm}
            onClose={this.handleFilterClose}
          />
        )}
      </View>
    );
  }
}
```

### 6.5.3 订单卡片组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Image, Block } from '@tarojs/components';
import { AtButton, AtIcon, AtTag } from 'taro-ui';
import './card.less';

interface OrderCardProps {
  order: OrderDetail;
  showDistance?: boolean;
  showGrabButton?: boolean;
  onGrab?: () => void;
  onDetail?: () => void;
  onStartService?: () => void;
  onCompleteService?: () => void;
  onContactUser?: () => void;
  onNavigate?: () => void;
}

export default class OrderCard extends Taro.Component<OrderCardProps> {
  private getStatusText = (status: number): string => {
    const statusMap = {
      1: '待抢单',
      2: '待服务',
      3: '服务中',
      4: '待确认',
      5: '已完成'
    };
    return statusMap[status] || '未知';
  };

  private getUrgencyLevel = (bookTime: string): string => {
    const now = new Date();
    const book = new Date(bookTime);
    const diff = book.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 2) return 'urgent';
    if (hours < 6) return 'normal';
    return 'relaxed';
  };

  public render() {
    const { order, showDistance, showGrabButton } = this.props;
    const urgencyLevel = this.getUrgencyLevel(order.bookTime);

    return (
      <View className={`grab-order-card ${urgencyLevel}`}>
        <View className="card-header">
          <View className="header-left">
            <Text className="order-no">{order.orderNo}</Text>
            {showDistance && (
              <View className="distance">
                <AtIcon value="map-pin" size={12} color="#666" />
                <Text>{order.distance}m</Text>
              </View>
            )}
          </View>
          <View className="header-right">
            <AtTag size="small" type={urgencyLevel === 'urgent' ? 'error' : 'primary'}>
              {this.getStatusText(order.status)}
            </AtTag>
          </View>
        </View>

        <View className="card-body" onClick={this.props.onDetail}>
          <View className="service-info">
            <View className="service-header">
              <Text className="service-name">{order.serviceName}</Text>
              <Text className="service-price">¥{order.totalAmount}</Text>
            </View>
            <View className="service-desc">{order.serviceDescription}</View>
          </View>

          <View className="user-info">
            <Image
              className="user-avatar"
              src={order.userInfo.avatar || '/assets/images/default-avatar.png'}
            />
            <View className="user-detail">
              <Text className="user-name">{order.userInfo.nickname}</Text>
              <View className="user-address">
                <AtIcon value="map-pin" size={12} color="#666" />
                <Text>{order.address.detail}</Text>
              </View>
            </View>
            <View className="contact-btns">
              <View className="contact-btn" onClick={(e) => { e.stopPropagation(); this.props.onContactUser?.(); }}>
                <AtIcon value="phone" size={20} color="#26de81" />
              </View>
              <View className="contact-btn" onClick={(e) => { e.stopPropagation(); this.props.onNavigate?.(); }}>
                <AtIcon value="navigation" size={20} color="#4b7bec" />
              </View>
            </View>
          </View>

          <View className="book-time">
            <AtIcon value="clock" size={14} color="#666" />
            <Text className="time-text">
              {order.bookDate} {order.bookTime}
            </Text>
            {urgencyLevel === 'urgent' && (
              <Text className="urgent-tag">即将超时</Text>
            )}
          </View>

          {order.remark && (
            <View className="remark">
              <Text className="remark-label">备注：</Text>
              <Text className="remark-text">{order.remark}</Text>
            </View>
          )}
        </View>

        <View className="card-footer">
          {showGrabButton && order.status === 1 && (
            <AtButton
              type="primary"
              size="small"
              className="grab-btn"
              onClick={(e) => { e.stopPropagation(); this.props.onGrab?.(); }}
            >
              立即抢单
            </AtButton>
          )}
          {order.status === 2 && (
            <AtButton
              type="primary"
              size="small"
              onClick={(e) => { e.stopPropagation(); this.props.onStartService?.(); }}
            >
              开始服务
            </AtButton>
          )}
          {order.status === 3 && (
            <AtButton
              type="primary"
              size="small"
              onClick={(e) => { e.stopPropagation(); this.props.onCompleteService?.(); }}
            >
              完成服务
            </AtButton>
          )}
          <AtButton
            size="small"
            onClick={(e) => { e.stopPropagation(); this.props.onDetail?.(); }}
          >
            查看详情
          </AtButton>
        </View>
      </View>
    );
  }
}
```

### 6.5.4 钱包提现组件

```typescript
import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { AtButton, AtIcon, AtNoticebar, AtList, AtListItem } from 'taro-ui';
import './wallet.less';

interface WalletPageProps {
  walletInfo: WalletInfo;
  bankCardList: BankCard[];
  withdrawRecordList: WithdrawRecord[];
  onWithdraw: (amount: number, bankCardId: number) => void;
  onAddBankCard: () => void;
  onViewRecord: () => void;
}

export default class WalletPage extends Taro.Component<WalletPageProps> {
  private state = {
    withdrawAmount: '',
    selectedCardId: 0,
    showWithdrawModal: false
  };

  private handleAmountInput = (value: string) => {
    const amount = value.replace(/[^0-9.]/g, '');
    this.setState({ withdrawAmount: amount });
  };

  private handleSelectCard = (cardId: number) => {
    this.setState({ selectedCardId: cardId });
  };

  private handleAllWithdraw = () => {
    const { availableBalance } = this.props.walletInfo;
    this.setState({ withdrawAmount: availableBalance.toString() });
  };

  private handleWithdraw = () => {
    const { withdrawAmount, selectedCardId } = this.state;
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    if (amount < 10) {
      Taro.showToast({ title: '最低提现金额为10元', icon: 'none' });
      return;
    }

    if (amount > this.props.walletInfo.availableBalance) {
      Taro.showToast({ title: '余额不足', icon: 'none' });
      return;
    }

    if (!selectedCardId) {
      Taro.showToast({ title: '请选择提现银行卡', icon: 'none' });
      return;
    }

    this.props.onWithdraw(amount, selectedCardId);
  };

  private handleAddCard = () => {
    this.props.onAddBankCard();
  };

  public render() {
    const { walletInfo, bankCardList, withdrawRecordList } = this.props;
    const { withdrawAmount, selectedCardId } = this.state;

    return (
      <View className="wallet-page">
        <View className="balance-card">
          <View className="balance-header">
            <Text className="label">可提现余额（元）</Text>
            <Text className="balance-value">{walletInfo.availableBalance}</Text>
          </View>
          <View className="balance-footer">
            <View className="balance-item">
              <Text className="item-label">今日收入</Text>
              <Text className="item-value">¥{walletInfo.todayIncome}</Text>
            </View>
            <View className="balance-item">
              <Text className="item-label">本周收入</Text>
              <Text className="item-value">¥{walletInfo.weekIncome}</Text>
            </View>
            <View className="balance-item">
              <Text className="item-label">本月收入</Text>
              <Text className="item-value">¥{walletInfo.monthIncome}</Text>
            </View>
          </View>
        </View>

        <View className="withdraw-section">
          <View className="section-title">提现</View>
          <View className="withdraw-form">
            <View className="amount-input-wrapper">
              <Text className="currency">¥</Text>
              <Input
                className="amount-input"
                type="digit"
                placeholder="请输入提现金额"
                value={withdrawAmount}
                onInput={(e) => this.handleAmountInput(e.detail.value)}
              />
              <View className="all-btn" onClick={this.handleAllWithdraw}>
                全部提现
              </View>
            </View>

            <View className="bank-card-section">
              <View className="card-header">
                <Text className="card-label">提现至</Text>
                <View className="add-card-btn" onClick={this.handleAddCard}>
                  <AtIcon value="add" size={16} color="#4b7bec" />
                  <Text>添加银行卡</Text>
                </View>
              </View>
              <View className="card-list">
                {bankCardList.map((card) => (
                  <View
                    key={card.id}
                    className={`bank-card ${selectedCardId === card.id ? 'selected' : ''}`}
                    onClick={() => this.handleSelectCard(card.id)}
                  >
                    <Image
                      className="bank-logo"
                      src={card.bankLogo}
                    />
                    <View className="card-info">
                      <Text className="bank-name">{card.bankName}</Text>
                      <Text className="card-no">**** **** **** {card.cardNoLast4}</Text>
                    </View>
                    {selectedCardId === card.id && (
                      <AtIcon value="check" size={20} color="#26de81" />
                    )}
                  </View>
                ))}
              </View>
            </View>

            <AtButton
              type="primary"
              className="withdraw-btn"
              onClick={this.handleWithdraw}
            >
              提现
            </AtButton>
          </View>
        </View>

        <View className="record-section">
          <View className="section-header">
            <Text className="section-title">提现记录</Text>
            <View className="view-more" onClick={this.props.onViewRecord}>
              <Text>查看全部</Text>
              <AtIcon value="chevron-right" size={16} color="#999" />
            </View>
          </View>
          <View className="record-list">
            {withdrawRecordList.slice(0, 5).map((record) => (
              <View key={record.id} className="record-item">
                <View className="record-info">
                  <Text className="record-amount">-¥{record.amount}</Text>
                  <Text className="record-time">{record.createTime}</Text>
                </View>
                <View className="record-status">
                  <Text className={`status-text ${record.status}`}>
                    {record.status === 1 ? '处理中' : record.status === 2 ? '已到账' : '已拒绝'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}
```

## 6.6 管理员后台核心组件

### 6.6.1 仪表盘组件

```typescript
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, OrderOutlined, DollarOutlined, ShopOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import './dashboard.less';

interface DashboardProps {
  overviewData: OverviewData;
  orderTrend: TrendData[];
  userGrowth: GrowthData[];
  topElectricians: Electrician[];
  recentOrders: Order[];
  onViewOrder: (orderId: string) => void;
  onViewElectrician: (electricianId: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { overviewData, orderTrend, userGrowth, topElectricians, recentOrders } = props;

  const getOrderChartOption = () => ({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: orderTrend.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: orderTrend.map(item => item.count),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: 'rgba(24, 144, 255, 0.2)'
      }
    }]
  });

  const getUserChartOption = () => ({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: userGrowth.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: userGrowth.map(item => item.count),
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: '#52c41a'
      }
    }]
  });

  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    },
    {
      title: '用户',
      dataIndex: ['userInfo', 'nickname'],
      key: 'userName'
    },
    {
      title: '服务',
      dataIndex: 'serviceName',
      key: 'serviceName'
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap = {
          1: { text: '待支付', color: 'orange' },
          2: { text: '待接单', color: 'orange' },
          3: { text: '已接单', color: 'blue' },
          4: { text: '服务中', color: 'cyan' },
          5: { text: '待确认', color: 'cyan' },
          6: { text: '已完成', color: 'green' },
          7: { text: '已取消', color: 'default' }
        };
        const info = statusMap[status];
        return <Tag color={info?.color}>{info?.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button type="link" onClick={() => props.onViewOrder(record.id)}>
          查看
        </Button>
      )
    }
  ];

  return (
    <div className="dashboard-page">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={overviewData.todayOrderCount}
              prefix={<OrderOutlined />}
              suffix={
                <span className="trend">
                  {overviewData.todayOrderGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(overviewData.todayOrderGrowth)}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日用户"
              value={overviewData.todayUserCount}
              prefix={<UserOutlined />}
              suffix={
                <span className="trend">
                  {overviewData.todayUserGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(overviewData.todayUserGrowth)}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日收入"
              value={overviewData.todayIncome}
              prefix={<DollarOutlined />}
              precision={2}
              suffix={
                <span className="trend">
                  {overviewData.todayIncomeGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(overviewData.todayIncomeGrowth)}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃电工"
              value={overviewData.activeElectricianCount}
              prefix={<ShopOutlined />}
              suffix={
                <span className="trend">
                  {overviewData.activeElectricianGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(overviewData.activeElectricianGrowth)}%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="订单趋势">
            <ReactECharts option={getOrderChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="用户增长">
            <ReactECharts option={getUserChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="电工排行榜">
            <Table
              dataSource={topElectricians}
              columns={[
                {
                  title: '排名',
                  key: 'rank',
                  render: (_: any, __: any, index: number) => index + 1
                },
                {
                  title: '电工',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: '订单数',
                  dataIndex: 'orderCount',
                  key: 'orderCount'
                },
                {
                  title: '收入',
                  dataIndex: 'totalIncome',
                  key: 'totalIncome',
                  render: (income: number) => `¥${income}`
                },
                {
                  title: '评分',
                  dataIndex: 'rating',
                  key: 'rating'
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_: any, record: Electrician) => (
                    <Button type="link" onClick={() => props.onViewElectrician(record.id)}>
                      查看
                    </Button>
                  )
                }
              ]}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最新订单">
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

### 6.6.2 订单管理组件

```typescript
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, DatePicker, Modal, Descriptions, Timeline } from 'antd';
import { SearchOutlined, EyeOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './order-manage.less';

const { RangePicker } = DatePicker;

interface OrderManageProps {
  orderList: Order[];
  total: number;
  loading: boolean;
  onSearch: (params: OrderQueryParams) => void;
  onViewDetail: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onConfirm: (orderId: string) => void;
  onExport: () => void;
}

export const OrderManage: React.FC<OrderManageProps> = (props) => {
  const [searchParams, setSearchParams] = useState<OrderQueryParams>({
    orderNo: '',
    status: undefined,
    startDate: '',
    endDate: '',
    pageNum: 1,
    pageSize: 10
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetail | null>(null);

  const handleSearch = () => {
    props.onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      orderNo: '',
      status: undefined,
      startDate: '',
      endDate: '',
      pageNum: 1,
      pageSize: 10
    });
  };

  const handleViewDetail = async (orderId: string) => {
    const res = await Api.getOrderDetail(orderId);
    setCurrentOrder(res.data);
    setDetailVisible(true);
  };

  const handleCancel = (orderId: string) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      onOk: () => {
        props.onCancel(orderId);
      }
    });
  };

  const handleConfirm = (orderId: string) => {
    Modal.confirm({
      title: '确认完成',
      content: '确定该订单已完成服务吗？',
      onOk: () => {
        props.onConfirm(orderId);
      }
    });
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      fixed: 'left',
      width: 180
    },
    {
      title: '用户',
      dataIndex: ['userInfo', 'nickname'],
      key: 'userName',
      width: 120
    },
    {
      title: '联系电话',
      dataIndex: ['userInfo', 'phone'],
      key: 'phone',
      width: 120
    },
    {
      title: '服务项目',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 150
    },
    {
      title: '服务地址',
      dataIndex: ['address', 'detail'],
      key: 'address',
      width: 200,
      ellipsis: true
    },
    {
      title: '预约时间',
      dataIndex: 'bookTime',
      key: 'bookTime',
      width: 160
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 100,
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const statusMap = {
          1: { text: '待支付', color: 'orange' },
          2: { text: '待接单', color: 'orange' },
          3: { text: '已接单', color: 'blue' },
          4: { text: '服务中', color: 'cyan' },
          5: { text: '待确认', color: 'cyan' },
          6: { text: '已完成', color: 'green' },
          7: { text: '已取消', color: 'default' },
          8: { text: '退款中', color: 'red' },
          9: { text: '已退款', color: 'default' }
        };
        const info = statusMap[status];
        return <Tag color={info?.color}>{info?.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            详情
          </Button>
          {record.status === 7 && (
            <Button
              type="link"
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              取消
            </Button>
          )}
          {record.status === 5 && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirm(record.id)}
            >
              确认
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="order-manage-page">
      <Card>
        <div className="search-form">
          <Space>
            <Input
              placeholder="订单号"
              value={searchParams.orderNo}
              onChange={e => setSearchParams({ ...searchParams, orderNo: e.target.value })}
              style={{ width: 200 }}
            />
            <Select
              placeholder="订单状态"
              value={searchParams.status}
              onChange={value => setSearchParams({ ...searchParams, status: value })}
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value={1}>待支付</Select.Option>
              <Select.Option value={2}>待接单</Select.Option>
              <Select.Option value={3}>已接单</Select.Option>
              <Select.Option value={4}>服务中</Select.Option>
              <Select.Option value={5}>待确认</Select.Option>
              <Select.Option value={6}>已完成</Select.Option>
              <Select.Option value={7}>已取消</Select.Option>
            </Select>
            <RangePicker
              onChange={(dates, dateStrings) => {
                setSearchParams({
                  ...searchParams,
                  startDate: dateStrings[0],
                  endDate: dateStrings[1]
                });
              }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button onClick={props.onExport}>导出</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={props.orderList}
          loading={props.loading}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={{
            total: props.total,
            current: searchParams.pageNum,
            pageSize: searchParams.pageSize,
            onChange: (page, pageSize) => {
              setSearchParams({ ...searchParams, pageNum: page, pageSize });
              props.onSearch({ ...searchParams, pageNum: page, pageSize });
            }
          }}
        />
      </Card>

      <Modal
        title="订单详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentOrder && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="订单号">{currentOrder.orderNo}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
              <Tag color="blue">{currentOrder.statusText}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="用户">{currentOrder.userInfo?.nickname}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{currentOrder.userInfo?.phone}</Descriptions.Item>
            <Descriptions.Item label="服务项目">{currentOrder.serviceName}</Descriptions.Item>
            <Descriptions.Item label="服务分类">{currentOrder.serviceCategory}</Descriptions.Item>
            <Descriptions.Item label="预约时间">{currentOrder.bookTime}</Descriptions.Item>
            <Descriptions.Item label="服务时长">{currentOrder.serviceDuration}分钟</Descriptions.Item>
            <Descriptions.Item label="订单金额">¥{currentOrder.totalAmount}</Descriptions.Item>
            <Descriptions.Item label="优惠金额">¥{currentOrder.discountAmount}</Descriptions.Item>
            <Descriptions.Item label="实付金额">¥{currentOrder.payAmount}</Descriptions.Item>
            <Descriptions.Item label="支付方式">{currentOrder.payTypeText}</Descriptions.Item>
            <Descriptions.Item label="服务地址" span={2}>
              {currentOrder.address?.province}{currentOrder.address?.city}
              {currentOrder.address?.district}{currentOrder.address?.detail}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {currentOrder.remark || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}

        <div className="order-timeline" style={{ marginTop: 24 }}>
          <h4>订单日志</h4>
          <Timeline>
            {currentOrder?.logs?.map((log, index) => (
              <Timeline.Item key={index} color={log.status === 6 ? 'green' : 'blue'}>
                <p>{log.action}</p>
                <p>{log.time}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Modal>
    </div>
  );
};
```
'''

with open(md_file, 'a', encoding='utf-8') as f:
    f.write(content)

with open(md_file, 'r', encoding='utf-8') as f:
    lines = len(f.readlines())

print(f"已追加代码，当前文件行数: {lines}")
