import { Platform } from 'react-native';

const API_PORT = 3000;
const IOS_LOCAL_API_URL = `http://localhost:${API_PORT}`;
const ANDROID_EMULATOR_API_URL = `http://10.0.2.2:${API_PORT}`;
const DEFAULT_API_URL = Platform.OS === 'android' ? ANDROID_EMULATOR_API_URL : IOS_LOCAL_API_URL;

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');
export const HEALTH_PATH = '/health';
