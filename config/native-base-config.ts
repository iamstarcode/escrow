import { extendTheme } from 'native-base';

const colors = {
  brand: {
    900: '#171900',
    800: '#444900',
    700: '#737a00',
  },
  primary: {
    50: '#ebe6ff',
    100: '#c3b7fe',
    200: '#9a88f8',
    300: '#7258f3',
    400: '#4b29ef',
    500: '#3110d5',
    600: '#260ca7',
    700: '#1a0778',
    800: '#0e0449',
    900: '#05011e',
  },

  // Make sure values below matches any of the keys in `fontConfig`
};

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
};
export const theme = extendTheme({
  colors,
  fontConfig,

  fonts: {
    heading: 'Euclid',
    body: 'Euclid',
    mono: 'Euclid',
  },
});
