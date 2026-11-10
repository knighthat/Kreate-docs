/** Human-readable labels for values found in an APK. */

const ANDROID_VERSIONS: Record<number, string> = {
  21: '5.0', 22: '5.1', 23: '6.0', 24: '7.0', 25: '7.1', 26: '8.0', 27: '8.1',
  28: '9', 29: '10', 30: '11', 31: '12', 32: '12L', 33: '13', 34: '14',
  35: '15', 36: '16', 37: '17',
}

/** 23 -> "Android 6.0 (API 23)"; unknown levels and codenames are shown as-is. */
export function sdkLabel(sdk: number | string): string {
  if (typeof sdk === 'string') return `Preview "${sdk}"`
  const name = ANDROID_VERSIONS[sdk]
  return name ? `Android ${name} (API ${sdk})` : `API ${sdk}`
}

const ABIS: Record<string, string> = {
  'arm64-v8a': '64-bit ARM',
  'armeabi-v7a': '32-bit ARM',
  'x86_64': '64-bit Intel/AMD',
  'x86': '32-bit Intel/AMD',
}

export function abiLabel(abi: string): string | undefined {
  return ABIS[abi]
}

const PERMISSIONS: Record<string, string> = {
  'android.permission.INTERNET': 'Access the internet',
  'android.permission.ACCESS_NETWORK_STATE': 'See whether you are online',
  'android.permission.ACCESS_WIFI_STATE': 'See Wi-Fi connection details',
  'android.permission.POST_NOTIFICATIONS': 'Show notifications',
  'android.permission.FOREGROUND_SERVICE': 'Keep running while in the background',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK': 'Play music in the background',
  'android.permission.FOREGROUND_SERVICE_DATA_SYNC': 'Sync or download data in the background',
  'android.permission.WAKE_LOCK': 'Keep the device awake during playback',
  'android.permission.RECEIVE_BOOT_COMPLETED': 'Run after the device restarts',
  'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS': 'Ask to be excluded from battery optimization',
  'android.permission.REQUEST_INSTALL_PACKAGES': 'Ask to install app updates',
  'android.permission.READ_MEDIA_AUDIO': 'Read music files on the device',
  'android.permission.READ_EXTERNAL_STORAGE': 'Read files on shared storage',
  'android.permission.WRITE_EXTERNAL_STORAGE': 'Write files to shared storage',
  'android.permission.RECORD_AUDIO': 'Use the microphone',
  'android.permission.MODIFY_AUDIO_SETTINGS': 'Change audio settings',
  'android.permission.SET_WALLPAPER': 'Set the wallpaper',
  'android.permission.VIBRATE': 'Vibrate',
  'android.permission.BLUETOOTH_CONNECT': 'Connect to Bluetooth devices',
}

/** Returns a description, or undefined for permissions we don't have a label for. */
export function permissionLabel(name: string): string | undefined {
  if (PERMISSIONS[name]) return PERMISSIONS[name]
  // Added automatically by AndroidX; only the app itself can hold it.
  if (name.endsWith('.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION')) return 'Internal, used only by the app itself'
  return undefined
}
