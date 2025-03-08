module.exports = {
  expo: {
    name: 'vanitymate',
    slug: 'vanitymate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.vanitymate.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.vanitymate.app'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      testUserId: process.env.EXPO_PUBLIC_TEST_USER_ID,
      testCategoryId: process.env.EXPO_PUBLIC_TEST_CATEGORY_ID,
      testSubcategoryId: process.env.EXPO_PUBLIC_TEST_SUBCATEGORY_ID,
    },
    plugins: [
      [
        '@react-native-firebase/app',
        {
          // Firebase 配置选项
        }
      ]
    ],
    // 启用新架构
    experiments: {
      tsconfigPaths: true
    },
    // 显式启用新架构
    newArchEnabled: true
  }
}; 