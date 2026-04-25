const config = {
  pages: [
    'pages/user/home/index',
    'pages/auth/login',
    'pages/auth/profile-complete',
    'pages/auth/bind-phone',
    'pages/user/inspection/index',
    'pages/user/inspection/book',
    'pages/user/inspection/process',
    'pages/user/inspection/report',
    'pages/user/orders/index',
    'pages/user/profile/index',
    'pages/electrician/hall/index',
    'pages/electrician/tasks/index',
    'pages/electrician/income/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#E60012',
    navigationBarTitleText: '安电通',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F7F8FA'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#E60012',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/user/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/user/inspection/index',
        text: '检测'
      },
      {
        pagePath: 'pages/user/orders/index',
        text: '订单'
      },
      {
        pagePath: 'pages/user/profile/index',
        text: '我的'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于查找附近电工'
    }
  },
  requiredPrivateMessages: ['chooseAddress']
};

export default config;
