# 安电通商业计划书 - 阿里云OSS部署指南

## 📋 部署前准备

### 1. 所需材料
- [x] 安电通-汇报材料合集.zip（已打包完成）
- [ ] 阿里云账号
- [ ] 已备案的域名（可选，但推荐）

### 2. 预计费用
- **OSS存储费**：约 0.12元/GB/月（65KB几乎可以忽略）
- **流量费**：0.24-0.80元/GB（按量付费）
- **CDN加速**（可选）：0.15-0.30元/GB
- **域名**：约 50-100元/年

---

## 🚀 部署步骤

### 第一步：创建OSS Bucket

1. 登录 [阿里云控制台](https://www.aliyun.com/)
2. 搜索并进入 **对象存储 OSS**
3. 点击 **创建 Bucket**
4. 填写配置：
   - **Bucket名称**：`andiantong-bp`（全局唯一，建议使用）
   - **地域**：选择离您最近的地域（如华东1-杭州）
   - **存储类型**：标准存储
   - **读写权限**：**公共读**（重要！）
   - **服务器端加密**：无
   - **版本控制**：不开通
5. 点击 **确定** 创建

### 第二步：开启静态网站托管

1. 进入刚创建的 Bucket
2. 左侧菜单选择 **基础设置** → **静态页面**
3. 配置：
   - **默认首页**：`安电通商业计划书-完整版.html`
   - **默认404页**：`安电通商业计划书-完整版.html`（可选）
4. 点击 **保存**

### 第三步：上传文件

#### 方式A：控制台上传（简单）
1. 进入 Bucket → **文件管理**
2. 点击 **上传文件**
3. 拖拽或选择 ZIP 文件
4. 上传后解压（OSS控制台暂不支持直接解压，需先本地解压再上传）

#### 方式B：OSS Browser工具（推荐）
1. 下载 [OSS Browser](https://github.com/aliyun/oss-browser/releases)
2. 使用 AccessKey 登录
3. 直接拖拽文件夹上传

#### 方式C：命令行上传（专业）
```bash
# 安装 ossutil
wget http://gosspublic.alicdn.com/ossutil/1.7.15/ossutil64
chmod 755 ossutil64

# 配置
./ossutil64 config -e oss-cn-hangzhou.aliyuncs.com -i <AccessKeyID> -k <AccessKeySecret>

# 上传文件夹
./ossutil64 cp -r ./汇报材料 oss://andiantong-bp/
```

### 第四步：访问测试

上传完成后，通过以下地址访问：
```
http://andiantong-bp.oss-cn-hangzhou.aliyuncs.com/安电通商业计划书-完整版.html
```

---

## 🌐 绑定自定义域名（推荐）

### 1. 添加自定义域名
1. 进入 Bucket → **传输管理** → **域名管理**
2. 点击 **绑定域名**
3. 输入域名：`bp.andiantong.com`（示例）
4. 开启 **CDN加速**（推荐）
5. 按提示完成域名验证

### 2. 配置DNS解析
在您的域名服务商处添加 CNAME 记录：
```
主机记录：bp
记录类型：CNAME
记录值：andiantong-bp.oss-cn-hangzhou.aliyuncs.com
TTL：600
```

### 3. 配置HTTPS（推荐）
1. 进入 **CDN控制台**
2. 找到对应的加速域名
3. 开启 **HTTPS**
4. 上传或申请 SSL 证书

---

## 📱 各文件访问链接

部署完成后，您将获得以下访问地址：

| 文件 | 访问地址 |
|------|----------|
| 完整版 | `https://bp.andiantong.com/安电通商业计划书-完整版.html` |
| 简约版 | `https://bp.andiantong.com/安电通商业计划书-简约版.html` |
| 演示版 | `https://bp.andiantong.com/安电通项目提案-演示版.html` |
| 投资人版 | `https://bp.andiantong.com/安电通-投资人汇报版.html` |

---

## 🔒 安全建议

1. **设置Referer防盗链**（防止他人盗用流量）
   - Bucket → **权限管理** → **防盗链**
   - 添加您的域名到白名单

2. **开启日志记录**
   - Bucket → **日志管理**
   - 记录访问日志，分析访问情况

3. **设置IP白名单**（可选）
   - 如果仅限特定人员访问

---

## 💡 快捷分享方案

### 生成短链接
使用阿里云短链接服务或第三方工具：
```
长链接：https://bp.andiantong.com/安电通商业计划书-完整版.html
短链接：https://s.andiantong.com/bp1
```

### 生成二维码
使用阿里云OSS图片处理服务生成二维码：
```
https://bp.andiantong.com/安电通商业计划书-完整版.html?x-oss-process=image/qrcode
```

---

## 📞 常见问题

**Q1：上传后中文文件名乱码？**
A：确保文件使用 UTF-8 编码，或在 ossutil 上传时添加 `--encoding-type url`

**Q2：如何设置密码保护？**
A：OSS本身不支持密码保护，建议：
- 使用长且随机的文件名
- 或部署到ECS+Nginx做基本认证

**Q3：如何查看访问统计？**
A：开通 OSS日志服务 或 阿里云CDN的实时监控

---

## 📦 自动化部署脚本

见同目录下的 `deploy-to-oss.sh` 脚本，一键完成部署。
