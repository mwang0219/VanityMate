import { Alert, AlertButton } from 'react-native';

interface ConfirmationDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: AlertButton['style'];
  cancelStyle?: AlertButton['style'];
  cancelable?: boolean;
}

interface ConfirmationDialogResult {
  confirmed: boolean;
}

export async function showConfirmationDialog({
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  confirmStyle = 'destructive',
  cancelStyle = 'cancel',
  cancelable = true,
}: ConfirmationDialogOptions): Promise<ConfirmationDialogResult> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: cancelStyle,
          onPress: () => resolve({ confirmed: false }),
        },
        {
          text: confirmText,
          style: confirmStyle,
          onPress: () => resolve({ confirmed: true }),
        },
      ],
      {
        cancelable,
        onDismiss: () => resolve({ confirmed: false }),
      }
    );
  });
} 