import React, { useState } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'


const Editor = (props) => {
    return (
        <View>
            <Text>Editor view</Text>
            <Button title="close" onPress={props.closeEditor} />
        </View>
    )
}

export default Editor

const styles = StyleSheet.create({
    
})