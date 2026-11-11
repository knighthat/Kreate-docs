/** Human-readable labels for values found in an APK. */

import { translate } from '@docusaurus/Translate'

const ANDROID_VERSIONS: Record<number, string> = {
  21: '5.0', 22: '5.1', 23: '6.0', 24: '7.0', 25: '7.1', 26: '8.0', 27: '8.1',
  28: '9', 29: '10', 30: '11', 31: '12', 32: '12L', 33: '13', 34: '14',
  35: '15', 36: '16', 37: '17',
}

/** 23 -> "Android 6.0 (API 23)"; unknown levels and codenames are shown as-is. */
export function sdkLabel(sdk: number | string): string {
  if (typeof sdk === 'string')
    return translate({ id: 'verify.sdk.preview', message: 'Preview "{codename}"', description: 'Unreleased Android version; {codename} is e.g. "Baklava"' }, { codename: sdk })
  const name = ANDROID_VERSIONS[sdk]
  return name ? `Android ${name} (API ${sdk})` : `API ${sdk}`
}

// Functions so translate() runs at render time, in the visitor's locale.
const ABIS: Record<string, () => string> = {
  'arm64-v8a': () => translate({ id: 'verify.abi.arm64_v8a', message: '64-bit ARM' }),
  'armeabi-v7a': () => translate({ id: 'verify.abi.armeabi_v7a', message: '32-bit ARM' }),
  'x86_64': () => translate({ id: 'verify.abi.x86_64', message: '64-bit Intel/AMD' }),
  'x86': () => translate({ id: 'verify.abi.x86', message: '32-bit Intel/AMD' }),
}

export function abiLabel(abi: string): string | undefined {
  return ABIS[abi]?.()
}

const PERMISSIONS: Record<string, () => string> = {
  'android.permission.INTERNET': () => translate({ id: 'verify.permission.INTERNET', message: 'Access the internet' }),
  'android.permission.ACCESS_NETWORK_STATE': () => translate({ id: 'verify.permission.ACCESS_NETWORK_STATE', message: 'See whether you are online' }),
  'android.permission.ACCESS_WIFI_STATE': () => translate({ id: 'verify.permission.ACCESS_WIFI_STATE', message: 'See Wi-Fi connection details' }),
  'android.permission.POST_NOTIFICATIONS': () => translate({ id: 'verify.permission.POST_NOTIFICATIONS', message: 'Show notifications' }),
  'android.permission.FOREGROUND_SERVICE': () => translate({ id: 'verify.permission.FOREGROUND_SERVICE', message: 'Keep running while in the background' }),
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK': () => translate({ id: 'verify.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK', message: 'Play music in the background' }),
  'android.permission.FOREGROUND_SERVICE_DATA_SYNC': () => translate({ id: 'verify.permission.FOREGROUND_SERVICE_DATA_SYNC', message: 'Sync or download data in the background' }),
  'android.permission.WAKE_LOCK': () => translate({ id: 'verify.permission.WAKE_LOCK', message: 'Keep the device awake during playback' }),
  'android.permission.RECEIVE_BOOT_COMPLETED': () => translate({ id: 'verify.permission.RECEIVE_BOOT_COMPLETED', message: 'Run after the device restarts' }),
  'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS': () => translate({ id: 'verify.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS', message: 'Ask to be excluded from battery optimization' }),
  'android.permission.REQUEST_INSTALL_PACKAGES': () => translate({ id: 'verify.permission.REQUEST_INSTALL_PACKAGES', message: 'Ask to install app updates' }),
  'android.permission.READ_MEDIA_AUDIO': () => translate({ id: 'verify.permission.READ_MEDIA_AUDIO', message: 'Read music files on the device' }),
  'android.permission.READ_EXTERNAL_STORAGE': () => translate({ id: 'verify.permission.READ_EXTERNAL_STORAGE', message: 'Read files on shared storage' }),
  'android.permission.WRITE_EXTERNAL_STORAGE': () => translate({ id: 'verify.permission.WRITE_EXTERNAL_STORAGE', message: 'Write files to shared storage' }),
  'android.permission.RECORD_AUDIO': () => translate({ id: 'verify.permission.RECORD_AUDIO', message: 'Use the microphone' }),
  'android.permission.MODIFY_AUDIO_SETTINGS': () => translate({ id: 'verify.permission.MODIFY_AUDIO_SETTINGS', message: 'Change audio settings' }),
  'android.permission.SET_WALLPAPER': () => translate({ id: 'verify.permission.SET_WALLPAPER', message: 'Set the wallpaper' }),
  'android.permission.VIBRATE': () => translate({ id: 'verify.permission.VIBRATE', message: 'Vibrate' }),
  'android.permission.BLUETOOTH_CONNECT': () => translate({ id: 'verify.permission.BLUETOOTH_CONNECT', message: 'Connect to Bluetooth devices' }),
}

/** Returns a description, or undefined for permissions we don't have a label for. */
export function permissionLabel(name: string): string | undefined {
  if (PERMISSIONS[name]) return PERMISSIONS[name]()
  // Added automatically by AndroidX; only the app itself can hold it.
  if (name.endsWith('.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION')) return translate({ id: 'verify.permission.internal', message: 'Internal, used only by the app itself' })
  return undefined
}
