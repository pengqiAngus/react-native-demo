/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './src/screens/HomeScreen';
import VideoScreen from './src/screens/VideoScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import StorageService from './src/services/StorageService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Video') {
            iconName = focused ? 'video-library' : 'video-library';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
        }}
      />
      <Tab.Screen
        name="Video"
        component={VideoScreen}
        options={{
          tabBarLabel: '视频',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    // 初始化数据
    const initializeApp = async () => {
      try {
        const storageService = StorageService.getInstance();
        await storageService.initializeData();
      } catch (error) {
        console.error('初始化应用失败:', error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AppNavigator />
      </View>
    </NavigationContainer>
  );
};

export default App;
