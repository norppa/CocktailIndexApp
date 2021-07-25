import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { login } from '../../utils/apiUtils'

import { Button, Dialog, TextInput } from '../common/styledComponents'

const Login = (props) => {
    const [usernameValue, setUsernameValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [busy, setBusy] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const submit = async (username, password) => {
        if (!usernameValue) {
            return setError('Missing username')
        }
        if (!passwordValue) {
            return setError('Missing password')
        }

        setBusy(true)
        const response = await login(usernameValue, passwordValue)
        console.log('response received')
        setBusy(false)
        if (response.error) {
            setError('Could not log in: ' + JSON.stringify(response.msg), 20000)
            return
        }

        props.close(response.token)
    }

    const setError = (errorMsg, timeout=3000) => {
        setErrorMsg(errorMsg)
        setTimeout(setErrorMsg.bind(this, ''), timeout)
    }



    const Error = () => {
        if (errorMsg) {
            return <View style={styles.error}><Text style={styles.text}>{errorMsg}</Text></View>
        } else {
            return null
        }
    }

    const Busy = () => {
        if (busy) {
            return <View style={styles.busy}><Text style={styles.text}>Logging in...</Text></View>
        } else {
            return null
        }
    }


    return (
        <Dialog>
            <Text style={styles.heading}>Please log in</Text>
            <Text style={styles.text}>Username:</Text>
            <TextInput value={usernameValue} onChangeText={setUsernameValue} />
            <Text style={styles.text}>Password:</Text>
            <TextInput value={passwordValue} onChangeText={setPasswordValue} />

            <Busy />
            <Error />

            <Button style={styles.button} title="Submit" onPress={submit} />
        </Dialog>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 24,
        marginBottom: 10
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
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    },
    error: {
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 10,
        margin: 20,
        padding: 10,
    },

    busy: {
        borderWidth: 2,
        borderRadius: 10,
        margin: 20,
        padding: 10,

    },
    button: {
        marginTop: 20,
        width: '70%',
        alignSelf: 'center',
    }
})

export default Login;
