import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Empty } from '@nutui/nutui-react-taro';
import { Wallet, Search, Top, Clock } from '@nutui/icons-react-taro';
import { electricianApi } from '../../../services/api/inspection';
import type { InspectionOrder } from '../../../types/api';
import './index.scss';

interface IncomeStats {
  totalIncome: number;
  monthlyIncome: number;
  orderCount: number;
}

interface IncomeRecord {
  date: string;
  amount: number;
  order: string;
}

const Income = () => {
  const [stats, setStats] = useState<IncomeStats | null>(null);
  const [records, setRecords] = useState<IncomeRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [statsResult, tasksResult] = await Promise.allSettled([
        electricianApi.getIncomeStats(),
        electricianApi.getMyTasks(1, 50),
      ]);

      let incomeStats: IncomeStats = { totalIncome: 0, monthlyIncome: 0, orderCount: 0 };
      let completedTasks: InspectionOrder[] = [];

      if (statsResult.status === 'fulfilled') {
        incomeStats = statsResult.value;
      } else {
        console.error('获取收入统计失败:', statsResult.reason);
      }

      if (tasksResult.status === 'fulfilled') {
        const allTasks = tasksResult.value.list || [];
        completedTasks = allTasks.filter(
          (task) => task.status === 'COMPLETED' || task.status === 'PAID'
        );

        if (statsResult.status !== 'fulfilled' || incomeStats.orderCount === 0) {
          const totalFromTasks = completedTasks.reduce((sum, t) => sum + t.price, 0);
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthlyTasks = completedTasks.filter((t) => new Date(t.createTime) >= monthStart);
          const monthlyFromTasks = monthlyTasks.reduce((sum, t) => sum + t.price, 0);

          incomeStats = {
            totalIncome: incomeStats.totalIncome || totalFromTasks,
            monthlyIncome: incomeStats.monthlyIncome || monthlyFromTasks,
            orderCount: incomeStats.orderCount || completedTasks.length,
          };
        }
      } else {
        console.error('获取任务列表失败:', tasksResult.reason);
      }

      setStats(incomeStats);

      const incomeRecords: IncomeRecord[] = completedTasks
        .map((task) => ({
          date: task.createTime ? task.createTime.split(' ')[0] : '',
          amount: task.isFree ? 0 : task.price,
          order: getServiceTypeLabel(task.serviceType),
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      setRecords(incomeRecords);
    } catch (error) {
      console.error('获取收入数据失败:', error);
      Taro.showToast({ title: '获取数据失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  Taro.useDidShow(() => {
    fetchData();
  });

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      home_inspection: '家庭电路检测',
      commercial_inspection: '商业电路检测',
      repair: '电路维修',
      install: '电路安装',
    };
    return labels[serviceType] || serviceType;
  };

  const pendingSettlement = records.reduce((sum, r) => sum + r.amount, 0) - (stats?.totalIncome || 0);

  return (
    <View className="income-page">
      {/* 头部 */}
      <View className='header-section'>
        <View className='header-bg' />
        <View className='header-content'>
          <View className="icon-wrap">
            <Wallet size={48} color="#FFFFFF" />
          </View>
          <Text className='title'>我的收入</Text>
          <Text className='subtitle'>查看您的收益统计</Text>
        </View>
        <View className='decoration-circle' />
      </View>

      {/* 收入概览 */}
      <View className="stats-container">
        <View className="stats-card">
          <View className="stat-item">
            <View className="stat-icon-wrap total">
              <Top size={24} color="#FFFFFF" />
            </View>
            <View className="stat-info">
              <Text className="stat-label">总收入</Text>
              <Text className="stat-value">¥{(stats?.totalIncome || 0).toFixed(2)}</Text>
            </View>
          </View>
          <View className="stat-divider" />
          <View className="stat-item">
            <View className="stat-icon-wrap pending">
              <Clock size={24} color="#FFFFFF" />
            </View>
            <View className="stat-info">
              <Text className="stat-label">待结算</Text>
              <Text className="stat-value">¥{Math.max(pendingSettlement, 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 收入记录 */}
      <View className="content-section">
        <View className="section-header">
          <Text className="section-title">收入记录</Text>
          <Text className="section-count">共 {records.length} 笔</Text>
        </View>

        <View className="records-list">
          {!loading && records.length === 0 ? (
            <View className='empty-state'>
              <Empty
                title='暂无收入记录'
                description='完成订单后将显示收入记录'
                image={<Search size={80} color="#CCCCCC" />}
              />
            </View>
          ) : (
            records.map((record, index) => (
              <View key={index} className="record-card">
                <View className="record-info">
                  <Text className="record-order">{record.order}</Text>
                  <Text className="record-date">{record.date}</Text>
                </View>
                <Text className="record-amount">+¥{record.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default Income;
