import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, FlatList, Image } from 'react-native'
import Dialog from './Dialog'
import EditorButton from './EditorButton'
import { saveNewIngredient } from '../../utils/utils'

const IngredientNameDialog = (props) => {
    const [isNew, setIsNew] = useState(false)
    const [error, setError] = useState(null)

    const onNameSelect = (name) => {
        props.updateIngredient({ name })
        props.close()
    }

    const onNameSubmit = (event) => {
        const availableName = props.availableIngredients
            .find(ingredient => ingredient.toLowerCase() == event.nativeEvent.text.toLowerCase())

        if (!availableName) {
            setIsNew(true)
        } else {
            props.updateIngredient({ name: availableName })
            props.close()
        }
    }

    const saveIngredient = async () => {
        const result = await saveNewIngredient(props.name)
        console.log('result', result)
        if (result.error) {
            setError('Failed to save new ingredient')
            setTimeout(() => setError(null), 3000)
        } else {
            props.updateIngredient({ name: props.name })
            setIsNew(false)
            props.close()
        }

    }

    const SuggestionList = () => {
        let suggestions = props.availableIngredients.filter(item => item.toLowerCase().includes(props.name.toLowerCase()))
        if (suggestions.length == 0) {
            return <Text style={[styles.suggestions, styles.text]}>No matching ingredients</Text>
        }
        return (
            <FlatList
                contentContainerStyle={styles.suggestions}
                data={suggestions}
                renderItem={({ item, index }) => {
                    return (
                        <Text style={[styles.text]}
                            onPress={onNameSelect.bind(this, item)}>{item}</Text>
                    )
                }}
                keyExtractor={(item, index) => index + item}
            />
        )
    }

    return (
        <Dialog visible={props.visible} close={props.close}> 
            <Text style={styles.heading}>Select ingredient</Text>
            <TextInput style={[styles.input, styles.text]}
                autoFocus={true}
                value={props.name}
                onChangeText={props.onChangeName}
                onSubmitEditing={onNameSubmit} />

            <SuggestionList />

            { error && <Text style={[styles.error, styles.text]}>{error}</Text>}


            {isNew &&
                <View style={styles.confirmation}>
                    <Text style={styles.text}>Ingredient "{props.name}" does not exist. Would you like to create it?</Text>
                    <View style={styles.buttons}>
                        <EditorButton title="Yes" onPress={saveIngredient} />
                        <EditorButton title="No" onPress={setIsNew.bind(this, false)} />
                    </View>
                </View>
            }

        </Dialog>
    )
}

export default IngredientNameDialog

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 24,
        marginBottom: 3
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
    },
    suggestions: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
        marginTop: 2
    },
    confirmation: {
        marginTop: 20
    },
    buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    },
    error: {
        color: 'red',
        borderWidth: 2,
        borderColor: 'red',
        margin: 20,
        padding: 10
    }
})