const config = {
  projectName: 'andt-taro-app',
  date: '2026-04-22',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-platform-weapp',
    '@tarojs/plugin-platform-jd'
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compAppType: 'part',
  mini: {
    compile: {
      include: []
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]'
        }
      }
    }
  },
  h5: {
    devServer: {
      port: 3010,
      proxy: {
        '/auth': {
          target: 'http://localhost:8081',
          changeOrigin: true
        },
        '/user': {
          target: 'http://localhost:8081',
          changeOrigin: true
        },
        '/api/inspection': {
          target: 'http://localhost:8083',
          changeOrigin: true
        },
        '/api/electrician': {
          target: 'http://localhost:8083',
          changeOrigin: true
        },
        '/api/rectification': {
          target: 'http://localhost:8082',
          changeOrigin: true
        }
      }
    },
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      pxtransform: {
        enable: true,
        config: {
          designWidth: 375,
          deviceRatio: {
            640: 2.34 / 2,
            750: 1,
            828: 1.81 / 2
          }
        }
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]'
        }
      }
    }
  }
};

export default config;
