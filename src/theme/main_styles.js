

import { Dimensions, Platform } from 'react-native';
import { useTheme } from 'native-base';
const { colors, fontSizes } = useTheme();
export var main_styles = {
    icon_xsmall: {
        fontSize: fontSizes.md,
    },
    icon_small: {
        fontSize: fontSizes.lg,
    },
    icon_normal: {
        fontSize: fontSizes.xl,
    },
    icon_large: {
        fontSize: fontSizes['2xl'],
    },
    icon_xlarge: {
        fontSize: fontSizes['3xl'],
    },

    icon_color_light: {
        color: colors.primary[600]
    },
    icon_color_on_light: {
        color: colors.icon.onLight
    },
    icon_color_primary: {
        color: colors.primary[600]
    },
    icon_color_default: {
        color: colors.icon.main
    },
    icon_color_active: {
        color: colors.icon.selected
    },
    icon_color_deactive: {
        color: colors.icon.unselected
    },
    icon_color_success: {
        color: colors.success[600]
    },
    icon_color_error: {
        color: colors.red[600]
    },
    icon_color_white: {
        color: colors.white,
    },
    icon_image: {
        xsmallCustom: {
            width: 11.18,
            height: 6.59,
        },
        xxxsmall: {
            width: 12,
            height: 12
        },
        xxsmall: {
            width: 16,
            height: 16
        },
        xsmall: {
            width: 18,
            height: 18
        },
        small: {
            width: 20,
            height: 20,
        },
        medium: {
            width: 24,
            height: 24,
        },
        large: {
            width: 32,
            height: 32,
        },
        xlarge: {
            width: 48,
            height: 48,
        },
        xxlarge: {
            width: 56,
            height: 56,
        },
        xxxlarge: {
            width: 72,
            height: 72,
        },
        xxxxlarge: {
            width: 100,
            height: 100,
        },
        swichIcon: {
            width: 58,
            height: 34,
        },
        swichSmall: {
            width: 40,
            height: 20,
            resizeMode: 'contain'
        }
    },
    stepIndicatorStyle: {
        stepIndicatorSize: 30,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 2,
        stepStrokeCurrentColor: colors.border.indicator,
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: colors.primary[600],
        stepStrokeUnFinishedColor: colors.border.indicator,
        separatorFinishedColor: colors.primary[600],
        separatorUnFinishedColor: colors.border.indicator,
        stepIndicatorFinishedColor: colors.primary[600],
        stepIndicatorUnFinishedColor: colors.border.indicator,
        stepIndicatorCurrentColor: colors.border.indicator,
        stepIndicatorLabelFontSize: 14,
        currentStepIndicatorLabelFontSize: 14,
        stepIndicatorLabelCurrentColor: colors.dark[600],
        stepIndicatorLabelFinishedColor: colors.white,
        stepIndicatorLabelUnFinishedColor: colors.dark[600],
    },
    bg_icon_primary: {
        backgroundColor: colors.primary["600"],
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
}

