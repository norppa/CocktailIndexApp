import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList } from 'react-native'

import Dialog from '../common/Dialog'
import Button from '../common/Button'

const Menu = (props) => {
    return (
        <Dialog style={styles.menu} visible={props.open} close={props.close}>
            <Button style={styles.button} title="Open Editor" onPress={props.onSelect('editor')} />
            <Button style={styles.button} title="Log Out" onPress={props.onSelect('logout')} />
        </Dialog>

    )
}

export default Menu

const styles = StyleSheet.create({
    button: {
        margin: 3
    }
})