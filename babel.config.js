const SVG_CONFIG = [
    "babel-plugin-inline-import",
    {
        "extensions": [".svg"]
    }
]

const MODULE_RESOLVER = [
    'module-resolver',
    {
        alias: {
            'alias_firebase_kit': 'react-native-firebase'
        }
    }
];

module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [SVG_CONFIG, MODULE_RESOLVER, 'react-native-reanimated/plugin']
};