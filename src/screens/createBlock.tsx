import { CreationObject } from 'display-api'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from 'urql'
import { BLOCK_CREATION_DISPLAY } from '../api/gql'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'


export const CreateBlock = ({ route, navigation }) => {

    type CreationDisplayResult = { blockCreationDisplay: string }
    type CreationDisplayRequest = { type: string }

    const type = route.params.name
    const [displayResult] = useQuery<CreationDisplayResult, CreationDisplayRequest>({
        query: BLOCK_CREATION_DISPLAY,
        variables: { type },
    })

    const creationObject: CreationObject = displayResult.data?.blockCreationDisplay ? JSON.parse(displayResult.data.blockCreationDisplay) : null

    const createBlock = async (template: string) => {
		console.log('TODO Create Block: ', template)
	}

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
            <SafeAreaView>
            {creationObject ? (
                <View>
                    <ComponentDelegate component={creationObject.header_component} />
                    <ComponentDelegate component={creationObject.main_component} />
                    <Button
                        onPress={() => createBlock(creationObject.input_template)}
                        style={styles.button}
                        contentStyle={globalStyles.buttonContentStyle}
                        mode="contained"
                        labelStyle={{ color: 'white' }}>
                        Create Block
                    </Button>
                </View>
            ) : (
                    <ActivityIndicator
                        {...null}
                        style={globalStyles.flex1}
                        color={colors.primary} />
                )
            }
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flex: 1,
        paddingHorizontal: 30,
    },
    headline: {
        marginTop: 0,
    },
    caption: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    inputText: {
        marginBottom: 20
    },
    validationError: {
        color: '#DD3B2C',
    },
    serverError: {
        color: '#DD3B2C',
        textAlign: 'center'
    },
    signupContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
})
