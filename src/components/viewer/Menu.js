import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { Button, Dialog } from '../common/styledComponents'

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