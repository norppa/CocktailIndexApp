import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import IngredientNameDialog from './IngredientNameDialog'

const IngredientInput = (props) => {
    const [nameDialogVisible, setNameDialogVisible] = useState(false)
    const { name, amount } = props.ingredient

    const onChangeAmount = (amount) => props.updateIngredient({ amount })
    const onChangeName = (name) => props.updateIngredient({ name })

    return (
        <View style={styles.ingredientInput}>
            <Text style={styles.dot}>{`\u2022`}</Text>
            <TextInput style={[props.style, styles.amountInput]} value={amount} onChangeText={onChangeAmount} />
            <View style={styles.nameInputArea}>
                <Text style={[props.style, styles.nameInput]} onPress={setNameDialogVisible.bind(this, true)}>{name}</Text>
            </View>

            <IngredientNameDialog
                visible={nameDialogVisible}
                close={setNameDialogVisible.bind(this, false)}
                name={name}
                onChangeName={onChangeName}
                availableIngredients={props.availableIngredients}
                updateIngredient={props.updateIngredient}
                close={setNameDialogVisible.bind(this, false)}
            />

        </View>
    )
}

export default IngredientInput

const styles = StyleSheet.create({
    ingredientInput: {
        flexDirection: 'row',
        marginBottom: 5
    },
    dot: {
        fontSize: 28
    },
    amountInput: {
        marginLeft: 5,
        flex: 2
    },
    nameInput: {
        marginLeft: 5,
        flex: 10
    },
    newName: {
        backgroundColor: 'gray',
        borderWidth: 2
    },
    addIngredientBtn: {
        textAlign: 'center',
        marginLeft: 5,
        flex: 1,
        padding: 0
    },
    nameInputArea: {
        flexDirection: 'row',
        flex: 10,
    }
})