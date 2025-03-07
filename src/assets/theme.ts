import { createTheme, useOsTheme } from 'naive-ui'

export const useMacOSTheme = () => {
  const osTheme = useOsTheme()

  return createTheme({
    common: {
      fontFamily: 'SF Pro Text, -apple-system',
      borderRadius: '8px',
      primaryColor: '#007AFF',
      primaryColorHover: '#0063CC',
      heightMedium: '32px'
    },
    DataTable: {
      thPaddingMedium: '12px 16px',
      tdPaddingMedium: '12px 16px'
    },
    Button: {
      textColorPrimary: '#FFFFFF',
      borderPrimary: '1px solid #007AFF'
    }
  })
}