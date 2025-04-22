declare module 'react-native-biometrics' {
    export interface BiometryAvailability {
      available: boolean;
      biometryType?: string | null;
      error?: string;
    }
    export interface PromptResult {
      success: boolean;
      error?: string;
    }
    export default class ReactNativeBiometrics {
      constructor(options?: { allowDeviceCredentials: boolean });
      isSensorAvailable(): Promise<BiometryAvailability>;
      simplePrompt(options: {
        promptMessage: string;
        fallbackPromptMessage?: string;
        cancelButtonText?: string;
      }): Promise<PromptResult>;
    }
  }
  