import { extendTheme, useTheme, useToken } from 'native-base';
import { Platform } from 'react-native';
const initTheme = (config) => {
    let colorScreenButton = '#0E3557';
    let colorScreenCard = '#dddddd';
    let isDarkMode = false;

    const BaseTheme = extendTheme({
        fontConfig: {
            OpenSans: {
                100: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : "OpenSans-Light",
                },
                200: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : "OpenSans-Light",
                },
                300: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : "OpenSans-Light",
                },
                400: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : "OpenSans-Regular",
                },
                500: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : "OpenSans-Regular",
                },
                600: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : "OpenSans-Regular",
                },
                700: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : 'OpenSans-Semibold',
                },
                800: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : 'OpenSans-Semibold',
                },
                900: {
                    normal: Platform.OS == 'ios' ? "Open Sans" : 'OpenSans-Bold',
                },
            },
        },
        // Make sure values below matches any of the keys in `fontConfig`
        fonts: {
            heading: "OpenSans",
            body: "OpenSans",
            mono: "OpenSans",
            button: "OpenSans",
            custom: "OpenSans"
        },
        components: {
            Button: {
                baseStyle: {
                    rounded: 'xl',
                    _text: {
                        fontFamily: 'button',
                        fontStyle: 'normal',
                        fontWeight: '900'
                    },
                },
                variants: {
                    primary: () => { return btnVariantPrimary(config) },
                    customOutline: ({ colorScheme,size }) => { return btnVariantOutLineRounded(colorScheme,size) },
                    customSolid: ({ colorScheme }) => { return btnVariantSolidRounded(colorScheme) },
                }
            },
            Badge: {
                baseStyle: {
                    py: 0.5,
                    px: 1,
                    _text: { fontSize: 'sm', fontWeight: 'bold' },
                }
            },
            Spinner: {
                baseStyle: {
                    color: isDarkMode ? '#ffffff' : '#212121',
                },

            },
            Text: {
                baseStyle: {
                    color: isDarkMode ? '#ffffff' : '#212121',
                },

            },
            Input: {
                baseStyle: {
                    px: 3,
                    py: 0,
                    height: '45',
                    width: '100%',
                },
                defaultProps: {
                    size: 'md'
                }
            },

        },
        colors: {
            primary: {
                300: colorScreenButton +'4D',
                400: colorScreenButton + "66",
                500: colorScreenButton + "80",
                600: colorScreenButton,
                700: colorScreenButton,
                800: colorScreenButton + "80",
                900: colorScreenButton,
            },
            secondary: {
                600: "#D9A411"
            },
            dark: {
                500: "#212121",
                600: "#03041D"
            },
            link: {
                600: colorScreenButton,
            },
            button: {
                main: colorScreenButton,
                selected: colorScreenButton,
                unselected: colorScreenCard,
            },
            background: {
                main: isDarkMode ? '#212121' : '#ffffff',
                card: colorScreenCard,
                wallet: colorScreenCard,
                item: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colorScreenCard,
                info: "#F0F0F3",
                modal: 'rgba(33, 33, 33, 0.7)',
            },
            card: {
                background: colorScreenCard,
                landing: landingPageCard,
                text: "#212121",
                icon: "#03041D",
                border: "transparent",
            },
            input: {
                background: colorScreenCard,
                text: "#03041D",
                label: "#212121",
                border: "transparent",
                placeholder: '#A2A2A2',
            },
            tabbar: {
                background: isDarkMode ? '#212121' : "#ffffff",
                selected: colorScreenButton,
                unselected: colorScreenCard,
                textSelected: colorScreenButton,
                textUnselected: colorScreenCard,
            },
            icon: {
                main: isDarkMode ? "#ffffff" : '#212121',
                selected: colorScreenButton,
                unselected: colorScreenCard,
                onLight: '#212121'
            },
            border: {
                main: isDarkMode ? "rgba(255, 255, 255, 0.3)" : 'rgba(3, 4, 29, 0.16)',
                indicator: '#F0F0F3'
            },
            textCustom: {
                600: isDarkMode ? "#ffffff" : '#212121',
                700: '#000000',
                800: isDarkMode ? "#ffffff" : '#00104D',
                900: '#4A4F52',
                landing: isDarkMode ? "#ffffff" : '#212121',
                onLight: '#212121',
                label: isDarkMode ? "#ffffff" : '#00104D99',
                info: '#A2A2A2',
            },
        },

        config: {
            initialColorMode: isDarkMode ? 'dark' : 'light',
        },
    });
    return BaseTheme;
}

const btnVariantPrimary = (config) => {
    return {
        bg: colorScreenButton,
        _text: {
            color: '#ffffff',
        },
        rounded: "xl"
    }
}

const btnVariantOutLineRounded = (colorScheme,size) => {
    const { components,fontSizes } = useTheme();
    const [primaryColor] = useToken("colors", [colorScheme, "600"]);
    let defaultVariants = components.Button.variants.outline({});
    defaultVariants._text = {
        fontWeight: '500',
        color: primaryColor['600']
    }
    defaultVariants.bg = "transparent";
    defaultVariants._pressed = {
        bg: "transparent",
    }
    defaultVariants.rounded = 'full'
    defaultVariants.borderColor = primaryColor['600']
    let _dark = defaultVariants._dark;
    defaultVariants._dark = {
        ..._dark,
        _text: {
            fontWeight: '500',
            color: primaryColor['600'],
            fontSize: size ? fontSizes[size] : undefined
        },
        borderColor: primaryColor['600'],
    }
    defaultVariants.paddingTop = size == 'sm' ? 2 : 2.5;
    defaultVariants.paddingBottom = size == 'sm' ? 2 : 2.5;
    return defaultVariants;
}

const btnVariantSolidRounded = (colorScheme) => {
    const { components, colors } = useTheme();
    const [primaryColor] = useToken("colors", [colorScheme, "600"]);
    let defaultVariants = components.Button.variants.solid({});
    defaultVariants._text = {
        fontWeight: '500',
        color: colors.white
    }
    defaultVariants.bg = primaryColor['600'];
    defaultVariants._pressed = {
        bg: primaryColor['600'],
    }
    defaultVariants.rounded = 'full'
    let _dark = defaultVariants._dark;
    defaultVariants._dark = {
        ..._dark,
        bg: primaryColor['600'],
        _text: {
            fontWeight: '500',
            color: colors.white
        }
    }
    return defaultVariants;
}

export default initTheme;
