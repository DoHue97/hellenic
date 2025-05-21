import React from 'react'
import PropTypes from 'prop-types';
import { HStack } from 'native-base'

function ListItemComponent(props) {
    const { left, body, right } = props;

    return (
        <HStack>
            {left ? <HStack>{left}</HStack> : <HStack></HStack>}
            {body ? <HStack>{body}</HStack> : <HStack></HStack>}
            {right ? <HStack>{right}</HStack> : <HStack></HStack>}
        </HStack>
    )
}

ListItemComponent.propTypes = {
    left: PropTypes.object,
    right: PropTypes.object,
    body: PropTypes.object,
};

export default ListItemComponent;