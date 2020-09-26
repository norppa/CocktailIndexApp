import React from 'react'
import { TouchableWithoutFeedback, FlatList } from 'react-native'
import { Text, Header, Dialog } from '../common/styledComponents'

const SelectMethodDialog = (props) => {
    return (
        <Dialog visible={props.visible} close={props.close}>
            <Header>Select method</Header>
            <FlatList
                data={props.methods}
                renderItem={({ item }) => {
                    return (
                        <TouchableWithoutFeedback onPress={props.selectMethod.bind(this, item)}>
                            <Text>{item}</Text>
                        </TouchableWithoutFeedback>
                    )
                }}
                keyExtractor={(item, index) => index + item}
            />
        </Dialog>
    )
}

export default SelectMethodDialog