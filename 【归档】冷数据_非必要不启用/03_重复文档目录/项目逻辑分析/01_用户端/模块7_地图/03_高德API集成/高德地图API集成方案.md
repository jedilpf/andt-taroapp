# 高德地图API集成方案

## 一、方案概| 属性 | 内容 | 属性 | 内容 
|------|------
| 方案名称 | 高德地图API集成 
| 当前方案 | React-Leaflet + 高德瓦片 
| 目标方案 | 高德JS API 2.0 
| Phase-1优先级 | **P0（核心）** 
| 核心价值 | 完整地图功能、精准定位、丰富API 

---

## 二、当前方案分

### 2.1 当前技术栈

```
当前实现├── 地图库：react-leaflet (v4.x)
├── 底层库：leaflet (v1.9.x)
├── 地图瓦片：高德瓦片服└── 坐标系统：GCJ-02（火星坐标）

当前瓦片URLhttps://wprd04.is.autonavi.com/appmaptilelang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}
```

### 2.2 当前方案优缺| 优点 | 缺点 
|------|------
| 实现简| 功能受限 
| 无需API Key | 无定位服
| 加载速度| 无搜索功
| 开源免| 无逆地理编
| | 坐标偏移问题 
| | 无路径规

### 2.3 需要解决的问题

```
待解决问题：
├── 1. 用户定位：需要获取用户当前位├── 2. 地址搜索：需要POI搜索功能
├── 3. 逆地理编码：坐标转地址
├── 4. 地理编码：地址转坐├── 5. 路径规划：电工导航功└── 6. 坐标转换：WGS-84 GCJ-02
```

---

## 三、高德地图API介绍

### 3.1 API分类

```
高德地图API产品┌─────────────────────────────────────────────────────────────高德开放平├─────────────────────────────────────────────────────────────┌─────────────────────────────────────────────────────Web端API                            ├─────────────────────────────────────────────────────JS API 2.0      地图展示、覆盖物、控Web服务API      HTTP接口，服务端调用             静态地图API     生成静态地图图└─────────────────────────────────────────────────────┌─────────────────────────────────────────────────────移动端API                           ├─────────────────────────────────────────────────────Android SDK     Android原生地图                  iOS SDK         iOS原生地图                      小程序SDK       微信/支付宝小程序                └─────────────────────────────────────────────────────└─────────────────────────────────────────────────────────────```

### 3.2 核心API说明

#### 3.2.1 JS API 2.0

```typescript
// JS API 2.0 主要功能
interface JSAPIFeatures {
  // 地图基础
  map: {
    create: '创建地图实例';
    center: '设置中心;
    zoom: '设置缩放级别';
    bounds: '设置边界';
  };
  
  // 覆盖overlays: {
    marker: '点标;
    polyline: '折线';
    polygon: '多边;
    circle: '圆形';
    infoWindow: '信息窗体';
  };
  
  // 控件
  controls: {
    toolBar: '工具;
    scale: '比例;
    mapType: '地图类型切换';
    geolocation: '定位控件';
  };
  
  // 服务
  services: {
    geocoder: '地理编码';
    placeSearch: '地点搜索';
    districtSearch: '行政区查;
    driving: '驾车路线规划';
    walking: '步行路线规划';
    transfer: '公交换乘';
  };
}
```

#### 3.2.2 Web服务API

```typescript
// Web服务API 主要接口
interface WebAPIEndpoints {
  // 地理编码
  geocoding: {
    geo: '/v3/geocode/geo';       // 地址转坐regeo: '/v3/geocode/regeo';   // 坐标转地址
  };
  
  // POI搜索
  place: {
    text: '/v3/place/text';       // 关键字搜around: '/v3/place/around';   // 周边搜索
    detail: '/v3/place/detail';   // POI详情
    polygon: '/v3/place/polygon'; // 多边形区域搜};
  
  // 路径规划
  direction: {
    driving: '/v3/direction/driving';   // 驾车路线
    walking: '/v3/direction/walking';   // 步行路线
    transit: '/v3/direction/transit/integrated'; // 公交路线
    bicycling: '/v4/direction/bicycling'; // 骑行路线
  };
  
  // 定位服务
  ip: '/v3/ip';  // IP定位
}
```

---

## 四、集成方案设

### 4.1 方案选择

```
推荐方案：JS API 2.0 + Web服务API

理由├── JS API 2.0：前端地图展示、交├── Web服务API：服务端调用，安全可├── 配合使用：前后端分离架构
└── 符合项目：React + TypeScript技术栈
```

### 4.2 架构设计

```
┌─────────────────────────────────────────────────────────────地图服务架构                              ├─────────────────────────────────────────────────────────────┌─────────────────────────────────────────────────────前端├─────────────────────────────────────────────────────React组件                                          ├── MapPage.tsx（地图找电工├── MapPickerModal.tsx（地址选择└── components/map/（地图组件）                    Hooks                                              ├── useAMap.ts（高德地图初始化├── useGeolocation.ts（定位）                      └── usePlaceSearch.ts（搜索）                      └──────────────────────┬──────────────────────────────┌─────────────────────────────────────────────────────服务├─────────────────────────────────────────────────────services/                                          ├── amapService.ts（高德服务封装）                 ├── geocodingService.ts（地理编码）                └── placeService.ts（POI搜索└──────────────────────┬──────────────────────────────┌─────────────────────────────────────────────────────API├─────────────────────────────────────────────────────高德JS API 2.0（前端调用）                         ├── 地图展示                                       ├── 覆盖└── 定位                                           高德Web服务API（后端调用）                         ├── 地理编码                                       ├── POI搜索                                        └── 路径规划                                       └─────────────────────────────────────────────────────└─────────────────────────────────────────────────────────────```

---

## 五、具体实现方

### 5.1 API Key配置

```typescript
// config/amap.ts
export const AMAP_CONFIG = {
  // JS API Key（前端使用）
  JS_API_KEY: 'YOUR_JS_API_KEY',
  
  // Web服务Key（后端使用）
  WEB_API_KEY: 'YOUR_WEB_API_KEY',
  
  // 安全密钥（JS API 2.0需要）
  SECURITY_JS_CODE: 'YOUR_SECURITY_CODE',
  
  // API版本
  VERSION: '2.0',
};

// 环境变量配置
// .env.development
VITE_AMAP_JS_KEY=your_dev_js_key
VITE_AMAP_WEB_KEY=your_dev_web_key
VITE_AMAP_SECURITY_CODE=your_dev_security_code

// .env.production
VITE_AMAP_JS_KEY=your_prod_js_key
VITE_AMAP_WEB_KEY=your_prod_web_key
VITE_AMAP_SECURITY_CODE=your_prod_security_code
```

### 5.2 JS API加载

```typescript
// utils/loadAMap.ts
interface AMapLoaderOptions {
  key: string;
  version: string;
  plugins: string[];
}

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

export const loadAMap = (options: AMapLoaderOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 设置安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
    };
    
    // 检查是否已加载
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }
    
    // 创建script标签
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    
    // 构建URL
    const plugins = options.plugins.join(',') | '';
    const url = `https://webapi.amap.com/mapsv=${options.version | '2.0'}&key=${options.key}&plugins=${plugins}`;
    
    script.src = url;
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error('AMap加载失败'));
      }
    };
    script.onerror = () => {
      reject(new Error('AMap脚本加载失败'));
    };
    
    document.head.appendChild(script);
  });
};

// hooks/useAMap.ts
import { useEffect, useState } from 'react';
import { loadAMap } from '../utils/loadAMap';
import { AMAP_CONFIG } from '../config/amap';

export const useAMap = () => {
  const [AMap, setAMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAMap({
      key: AMAP_CONFIG.JS_API_KEY,
      version: AMAP_CONFIG.VERSION,
      plugins: [
        'AMap.Geolocation',
        'AMap.PlaceSearch',
        'AMap.Geocoder',
        'AMap.Marker',
        'AMap.InfoWindow',
      ],
    })
      .then((AMap) => {
        setAMap(AMap);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { AMap, loading, error };
};
```

### 5.3 地图组件封装

```typescript
// components/map/AMapContainer.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useAMap } from '../../hooks/useAMap';
import { AMAP_CONFIG } from '../../config/amap';

interface AMapContainerProps {
  center: [number, number];
  zoom: number;
  onMapReady: (map: any) => void;
  children: React.ReactNode;
}

export interface AMapContainerRef {
  getMap: () => any;
  setCenter: (lng: number, lat: number) => void;
  setZoom: (zoom: number) => void;
}

export const AMapContainer = forwardRef<AMapContainerRef, AMapContainerProps>(
  ({ center = [121.4360, 31.1940], zoom = 14, onMapReady, children }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const { AMap, loading, error } = useAMap();

    useEffect(() => {
      if (!AMap | !containerRef.current) return;

      // 创建地图实例
      const map = new AMap.Map(containerRef.current, {
        zoom,
        center,
        viewMode: '2D',
        mapStyle: 'amap://styles/normal',
      });

      mapRef.current = map;
      onMapReady.(map);

      return () => {
        map.destroy();
      };
    }, [AMap, center, zoom]);

    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
      setCenter: (lng, lat) => {
        mapRef.current.setCenter([lng, lat]);
      },
      setZoom: (zoom) => {
        mapRef.current.setZoom(zoom);
      },
    }));

    if (loading) {
      return <div className="w-full h-full flex items-center justify-center bg-gray-100">地图加载..</div>;
    }

    if (error) {
      return <div className="w-full h-full flex items-center justify-center bg-gray-100">地图加载失败</div>;
    }

    return (
      <div ref={containerRef} className="w-full h-full relative">
        {children}
      </div>
    );
  }
);
```

### 5.4 定位服务

```typescript
// hooks/useGeolocation.ts
import { useState, useCallback } from 'react';
import { useAMap } from './useAMap';

interface LocationResult {
  lng: number;
  lat: number;
  address: string;
  province: string;
  city: string;
  district: string;
}

export const useGeolocation = () => {
  const { AMap } = useAMap();
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCurrentPosition = useCallback(() => {
    if (!AMap) {
      setError(new Error('地图未加));
      return;
    }

    setLoading(true);
    setError(null);

    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      convert: true,
      showButton: false,
      showMarker: false,
      showCircle: false,
      panToLocation: false,
      zoomToAccuracy: false,
    });

    geolocation.getCurrentPosition((status: string, result: any) => {
      setLoading(false);
      
      if (status === 'complete') {
        setLocation({
          lng: result.position.lng,
          lat: result.position.lat,
          address: result.formattedAddress,
          province: result.addressComponent.province,
          city: result.addressComponent.city,
          district: result.addressComponent.district,
        });
      } else {
        setError(new Error(result.message | '定位失败'));
      }
    });
  }, [AMap]);

  return {
    location,
    loading,
    error,
    getCurrentPosition,
  };
};
```

### 5.5 POI搜索服务

```typescript
// services/placeService.ts
import { AMAP_CONFIG } from '../config/amap';

interface POI {
  id: string;
  name: string;
  address: string;
  location: {
    lng: number;
    lat: number;
  };
  distance: number;
  type: string;
  tel: string;
}

interface SearchParams {
  keywords: string;
  city: string;
  citylimit: boolean;
  offset: number;
  page: number;
}

interface AroundSearchParams {
  location: string;  // "lng,lat"
  keywords: string;
  radius: number;
  offset: number;
  page: number;
}

class PlaceService {
  private baseUrl = 'https://restapi.amap.com/v3';

  // 关键字搜async searchText(params: SearchParams): Promise<POI[]> {
    const url = new URL(`${this.baseUrl}/place/text`);
    url.searchParams.append('key', AMAP_CONFIG.WEB_API_KEY);
    url.searchParams.append('keywords', params.keywords);
    if (params.city) url.searchParams.append('city', params.city);
    if (params.citylimit) url.searchParams.append('citylimit', 'true');
    url.searchParams.append('offset', String(params.offset | 20));
    url.searchParams.append('page', String(params.page | 1));
    url.searchParams.append('extensions', 'all');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== '1') {
      throw new Error(data.info | '搜索失败');
    }

    return data.pois.map((poi: any) => ({
      id: poi.id,
      name: poi.name,
      address: poi.address,
      location: {
        lng: parseFloat(poi.location.split(',')[0]),
        lat: parseFloat(poi.location.split(',')[1]),
      },
      distance: poi.distance parseFloat(poi.distance) : undefined,
      type: poi.type,
      tel: poi.tel,
    }));
  }

  // 周边搜索
  async searchAround(params: AroundSearchParams): Promise<POI[]> {
    const url = new URL(`${this.baseUrl}/place/around`);
    url.searchParams.append('key', AMAP_CONFIG.WEB_API_KEY);
    url.searchParams.append('location', params.location);
    if (params.keywords) url.searchParams.append('keywords', params.keywords);
    url.searchParams.append('radius', String(params.radius | 1000));
    url.searchParams.append('offset', String(params.offset | 20));
    url.searchParams.append('page', String(params.page | 1));
    url.searchParams.append('extensions', 'all');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== '1') {
      throw new Error(data.info | '搜索失败');
    }

    return data.pois.map((poi: any) => ({
      id: poi.id,
      name: poi.name,
      address: poi.address,
      location: {
        lng: parseFloat(poi.location.split(',')[0]),
        lat: parseFloat(poi.location.split(',')[1]),
      },
      distance: parseFloat(poi.distance),
      type: poi.type,
      tel: poi.tel,
    }));
  }
}

export const placeService = new PlaceService();

// hooks/usePlaceSearch.ts
import { useState, useCallback } from 'react';
import { placeService } from '../services/placeService';

export const usePlaceSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (keywords: string, city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const pois = await placeService.searchText({ keywords, city });
      setResults(pois);
    } catch (err) {
      setError(err as Error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAround = useCallback(async (location: string, keywords: string, radius: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const pois = await placeService.searchAround({ location, keywords, radius });
      setResults(pois);
    } catch (err) {
      setError(err as Error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
    searchAround,
  };
};
```

### 5.6 地理编码服务

```typescript
// services/geocodingService.ts
import { AMAP_CONFIG } from '../config/amap';

interface GeocodingResult {
  location: {
    lng: number;
    lat: number;
  };
  level: string;
}

interface ReGeocodingResult {
  formattedAddress: string;
  addressComponent: {
    province: string;
    city: string;
    district: string;
    township: string;
    street: string;
    streetNumber: string;
  };
}

class GeocodingService {
  private baseUrl = 'https://restapi.amap.com/v3';

  // 地址转坐async geocode(address: string, city: string): Promise<GeocodingResult> {
    const url = new URL(`${this.baseUrl}/geocode/geo`);
    url.searchParams.append('key', AMAP_CONFIG.WEB_API_KEY);
    url.searchParams.append('address', address);
    if (city) url.searchParams.append('city', city);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== '1' | !data.geocodes.length) {
      throw new Error(data.info | '地址解析失败');
    }

    const geocode = data.geocodes[0];
    const [lng, lat] = geocode.location.split(',');

    return {
      location: {
        lng: parseFloat(lng),
        lat: parseFloat(lat),
      },
      level: geocode.level,
    };
  }

  // 坐标转地址
  async regeocode(lng: number, lat: number): Promise<ReGeocodingResult> {
    const url = new URL(`${this.baseUrl}/geocode/regeo`);
    url.searchParams.append('key', AMAP_CONFIG.WEB_API_KEY);
    url.searchParams.append('location', `${lng},${lat}`);
    url.searchParams.append('extensions', 'all');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== '1') {
      throw new Error(data.info | '逆地理编码失);
    }

    const regeocode = data.regeocode;
    return {
      formattedAddress: regeocode.formatted_address,
      addressComponent: {
        province: regeocode.addressComponent.province,
        city: regeocode.addressComponent.city,
        district: regeocode.addressComponent.district,
        township: regeocode.addressComponent.township,
        street: regeocode.addressComponent.streetNumber.street | '',
        streetNumber: regeocode.addressComponent.streetNumber.number | '',
      },
    };
  }
}

export const geocodingService = new GeocodingService();
```

---

## 六、迁移步

### 6.1 Phase-1：基础迁移

```
Phase-1迁移步骤Step 1: 申请高德API Key
├── 注册高德开放平台账├── 创建应用
├── 获取JS API Key
└── 获取Web服务Key

Step 2: 配置环境变量
├── 创建.env文件
├── 配置API Key
└── 配置安全密钥

Step 3: 封装地图组件
├── 创建AMapContainer组件
├── 封装useAMap Hook
└── 替换MapPage中的Leaflet

Step 4: 实现定位功能
├── 封装useGeolocation Hook
├── 获取用户当前位置
└── 更新用户位置状Step 5: 实现搜索功能
├── 封装usePlaceSearch Hook
├── 实现POI搜索
└── 实现周边搜索

Step 6: 实现地理编码
├── 封装geocodingService
├── 实现地址转坐└── 实现坐标转地址
```

### 6.2 Phase-2：功能增```
Phase-2增强步骤Step 1: 路径规划
├── 集成路径规划API
├── 实现驾车路线规划
└── 实现步行路线规划

Step 2: 导航功能
├── 集成导航SDK
├── 实现实时导航
└── 语音播报

Step 3: 地图样式
├── 自定义地图样├── 深色模式
└── 卫星图切Step 4: 性能优化
├── 离线地图
├── 地图缓存
└── 懒加```

---

## 七、API Key管理

### 7.1 Key申请流程

```
申请流程1. 访问高德开放平https://lbs.amap.com/

2. 注册/登录账号
   - 个人开发- 企业开发3. 实名认证
   - 个人：身份证认证
   - 企业：营业执照认4. 创建应用
   - 应用名称：安电- 应用类型：Web应用

5. 添加Key
   - 平台：Web端（JS API- 平台：Web服务

6. 配置白名- 开发环境：localhost
   - 生产环境：yourdomain.com

7. 获取Key
   - JS API Key
   - Web服务Key
   - 安全密钥
```

### 7.2 Key安全配置

```typescript
// 安全配置建议

// 1. 使用环境变量
const API_KEY = import.meta.env.VITE_AMAP_JS_KEY;

// 2. 设置Referer白名// 在高德控制台配置允许的域// 3. 使用安全密钥
window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
};

// 4. 服务端代// Web服务API通过后端代理调用
// 避免暴露Key到前// 5. Key轮换
// 定期更换API Key
// 降低Key泄露风险
```

---

## 八、费用说

### 8.1 免费配额

| API类型 | 免费配额 | 超出费用 
| 属性 | 接口概览 | 接口名称 |---------| 属性 | 接口概览 | 接口名称 |----------| 属性 | 接口概览 | 接口名称 |----------
| JS API | 无限| 免费 
| 地理编码 | 5,000| 5万次 
| 逆地理编| 5,000| 5万次 
| POI搜索 | 5,000| 5万次 
| 路径规划 | 5,000| 5万次 

### 8.2 费用预估

```
日活用户预估0,000人均调用次数0日调用量00,000月调用量,000,000免费配额,000× 30= 150,000超出部分,000,000 - 150,000 = 2,850,000预估费用- 地理编码,850,000 / 10000 × 5 = 1,425- 逆地理编码：同上
- POI搜索：同总计：约4,275建议1. 申请提升配额
2. 实现缓存机制
3. 优化调用频率
```

---

## 九、注意事

### 9.1 坐标系统

```
坐标系统说明WGS-84：GPS原始坐标（国际标准）
GCJ-02：国测局坐标（火星坐标，高德使用BD-09：百度坐标（百度地图使用高德地图使用GCJ-02坐标需要处理与WGS-84的转// 坐标转换工具
import { coordtransform } from 'coordtransform';

// WGS-84 GCJ-02
const gcj02 = coordtransform.wgs84togcj02(lng, lat);

// GCJ-02 WGS-84
const wgs84 = coordtransform.gcj02towgs84(lng, lat);
```

### 9.2 兼容```
浏览器兼容性：

支持├── Chrome 60+
├── Firefox 55+
├── Safari 11+
├── Edge 79+
└── 微信浏览不支持：
├── IE 11及以└── 旧版移动浏览解决方案├── 检测浏览器版本
├── 提示用户升级
└── 提供降级方案
```

### 9.3 性能优化

```
性能优化建议1. 按需加载
   - 只加载需要的插件
   - 懒加载地图组2. 缓存策略
   - 缓存地理编码结果
   - 缓存搜索结果

3. 节流防抖
   - 搜索输入防抖
   - 地图事件节流

4. 资源优化
   - 使用CDN加载
   - 压缩图片资源

5. 监控告警
   - 监控API调用- 设置配额告警
```

---

## 十、文件清| 文件 | 说明 | 状
|------|------| 属性 | 接口概览 | 接口名称 |------
| `config/amap.ts` | 高德配置文件 | 📝 待开发
| `utils/loadAMap.ts` | 高德API加载| 📝 待开发
| `hooks/useAMap.ts` | 高德地图Hook | 📝 待开发
| `hooks/useGeolocation.ts` | 定位Hook | 📝 待开发
| `hooks/usePlaceSearch.ts` | 搜索Hook | 📝 待开发
| `services/placeService.ts` | POI搜索服务 | 📝 待开发
| `services/geocodingService.ts` | 地理编码服务 | 📝 待开发
| `components/map/AMapContainer.tsx` | 地图容器组件 | 📝 待开发
| `components/map/AMapMarker.tsx` | 标记组件 | 📝 待开发
| `components/map/AMapInfoWindow.tsx` | 信息窗体组件 | 📝 待开发
