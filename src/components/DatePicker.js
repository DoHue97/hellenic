import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Box, Button, HStack, Pressable, Text, View, useTheme } from 'native-base';
import { Platform } from 'react-native';
import { formatDateToDDMMYYYY } from '../utils/util';
import moment from 'moment';
import { strings } from '../translations';
import { LockIcon } from './Icons';
function DatePicker(props) {
    const { placeHolder, mode, disabled, maximumDate, minimumDate, border, value } = props;
    let momentValue = value ? moment(value, 'MM/DD/YYYY') : null;
    const [date, setDate] = useState(momentValue ? new Date(value) : undefined);
    useEffect(()=>{
        if(value){
            momentValue = moment(value, 'MM/DD/YYYY')
            setDate(new Date(momentValue))
        }
    },[value])
    const [tempDate, setTempDate] = useState(momentValue ? new Date(momentValue) : undefined);
    const [showDatePicker, setShowDatePicker] = useState(false)
    const { colors } = useTheme();
    const onChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (event.type === 'dismissed') {
            return;
        }
        let _date;
        if (event.type === 'neutralButtonPressed') {
            _date = new Date(0)
        } else {
            _date = selectedDate;
        }
        setDate(_date);
        if(Platform.OS=='android'){ 
            if (props.onChange) {
                props.onChange(_date)
            }
        }
    };

    const onCancel = () => {
        setShowDatePicker(false);
        setDate(momentValue)
    }

    const onOK = () => {
        setShowDatePicker(false);
        let _date = date ? date : new Date();
        if (props.onChange) {
            props.onChange(_date)
        }
        setDate(_date)
    }

    return (
        <Box width={'100%'} 
            paddingX={3} paddingY={3} 
            style={border ? { borderWidth: 1, borderRadius: 5, borderColor: colors.border.main } : undefined}
            backgroundColor={Platform.OS=='ios' && showDatePicker ? 'white' : undefined}
        >
            <Pressable onPress={disabled ? undefined : () => setShowDatePicker(true)} marginBottom={Platform.OS=='ios' && showDatePicker ? 2 : undefined} accessibilityLabel='datePicker/btnShow'>
                {date ? <Text color={Platform.OS=='ios' && showDatePicker ? colors.textCustom.onLight : undefined}>{formatDateToDDMMYYYY(date)}</Text> : <Text>{placeHolder}</Text>}
                {disabled && <View style={{position:'absolute',right:0,top:0}}><LockIcon /></View>}
            </Pressable>
            {showDatePicker && <DateTimePicker
                testID="dateTimePicker"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                value={date ? date : new Date()}
                mode={mode ? mode : "date"}
                is24Hour
                display={'spinner'}
                onChange={onChange}
                disabled={disabled}
                themeVariant="light"
            />}
            {Platform.OS=='ios' && showDatePicker && <HStack marginX={2} justifyContent={'flex-end'}>
                <Button colorScheme={'light'} variant={'ghost'} onPress={() => onCancel()} accessibilityLabel='datePicker/btnCancel'>{strings.btn_cancel}</Button>
                <Button marginLeft={3} variant={'ghost'} onPress={() => onOK()} accessibilityLabel='datePicker/btnOK'>{"OK"}</Button>
            </HStack>}
        </Box>
    )
}

DatePicker.propTypes = {
    placeHolder: PropTypes.string,
    mode: PropTypes.string,
    maximumDate: PropTypes.string,
    minimumDate: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    border: PropTypes.bool,
    value: PropTypes.string,
};

export default DatePicker;