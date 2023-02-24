import { extendTheme } from 'native-base'

const colors = {
  brand: {
    900: '#171900',
    800: '#444900',
    700: '#737a00',
  },
  primary: {
    50: '#dcf6ff',
    100: '#b2dffe',
    200: '#85c8f8',
    300: '#57b2f2',
    400: '#2b9ced',
    500: '#1282d4',
    600: '#0565a6',
    700: '#004878',
    800: '#002b4b',
    900: '#000f1f',
  },

  // Make sure values below matches any of the keys in `fontConfig`
}

const fontConfig = {
  fontConfig: {
    Euclid: {
      /*   100: {
        normal: 'EuclidCircularA-Light',
        italic: 'EuclidCircularA-LightItalic',
      },
      200: {
        normal: 'EuclidCircularA-Light',
        italic: 'EuclidCircularA-LightItalic',
      },
      300: {
        normal: 'EuclidCircularA-Light',
        italic: 'EuclidCircularA-LightItalic',
      }, */
      400: {
        normal: 'EuclidCircularALight',
        //italic: 'EuclidCircularA-Italic',
      },
      500: {
        normal: 'EuclidCircularABold',
      },
      /*  600: {
        normal: 'EuclidCircularA-Medium',
        italic: 'EuclidCircularA-MediumItalic',
      }, */
      // Add more variants
      //   700: {
      //     normal: 'Roboto-Bold',
      //   },
      //   800: {
      //     normal: 'Roboto-Bold',
      //     italic: 'Roboto-BoldItalic',
      //   },
      //   900: {
      //     normal: 'Roboto-Bold',
      //     italic: 'Roboto-BoldItalic',
      //   },
    },
  },
}
export const theme = extendTheme({
  colors,
  fontConfig,

  fonts: {
    heading:'Euclid',
    body: 'Euclid',
    mono: 'Euclid',
  },
})
