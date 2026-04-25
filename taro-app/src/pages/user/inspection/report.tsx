import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import { useInspectionStore } from '../../../store/inspectionStore';
import './report.scss';

const SAFETY_LEVEL_MAP: Record<string, string> = {
  excellent: '优秀',
  good: '良好',
  warning: '警告',
  danger: '危险',
};

const Report = () => {
  const router = Taro.getCurrentInstance().router;
  const orderId = Number(router?.params?.id) || 0;

  const { currentReport, fetchReport } = useInspectionStore();
  const [loading, setLoading] = useState(true);

  Taro.useDidShow(() => {
    if (orderId) {
      setLoading(true);
      Taro.showLoading({ title: '加载中...' });
      fetchReport(orderId).finally(() => {
        setLoading(false);
        Taro.hideLoading();
      });
    }
  });

  const getStatusIcon = (status: string) => {
    return status === 'pass' ? '✓' : status === 'warn' ? '!' : '×';
  };

  const getStatusColor = (status: string) => {
    return status === 'pass' ? '#4caf50' : status === 'warn' ? '#ff9800' : '#f44336';
  };

  if (loading) {
    return (
      <View className="report-page">
        <View className="header-section">
          <Text className="level-text">加载中...</Text>
        </View>
      </View>
    );
  }

  if (!currentReport) {
    return (
      <View className="report-page">
        <View className="header-section">
          <Text className="level-text">暂无报告数据</Text>
        </View>
      </View>
    );
  }

  const report = currentReport;

  return (
    <View className="report-page">
      <View className="header-section">
        <View className="score-circle">
          <Text className="score-value">{report.totalScore}</Text>
          <Text className="score-label">安全评分</Text>
        </View>
        <Text className="level-text">安全等级：{SAFETY_LEVEL_MAP[report.safetyLevel] || report.safetyLevel}</Text>
      </View>

      <View className="content-section">
        <View className="section-title">检测项目</View>
        <View className="items-list">
          {report.reportData.map((item) => (
            <View key={item.id} className="item-card">
              <View className="item-info">
                <Text className="item-name">{item.itemName}</Text>
                <Text className="item-value">{item.testValue}（标准：{item.standardValue}）</Text>
              </View>
              <View className="item-status" style={{ color: getStatusColor(item.status) }}>
                {getStatusIcon(item.status)}
              </View>
            </View>
          ))}
        </View>

        {report.suggestions && (
          <>
            <View className="section-title">整改建议</View>
            <View className="suggestions-card">
              <Text className="suggestions-text">{report.suggestions}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Report;
