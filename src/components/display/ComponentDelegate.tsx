import React from 'react'
import { ComponentObject } from "display-api"
import { CardComponent } from "./components/CardComponent"
import { Text } from "react-native-paper"
import { TextComponent } from './components/TextComponent'
import { StackComponent } from './components/StackComponent'
import { InputComponent } from './components/InputComponent'
import { ButtonComponent } from './components/ButtonComponent'

export const ComponentDelegate = ({ component }: { component: ComponentObject }) => {

    switch (component.cid) {
        case "card":
            return <CardComponent {...component.args} />
        case "text":
            return <TextComponent {...component.args} />
        case "stack":
            return <StackComponent {...component.args} />
        case "input":
            return <InputComponent {...component.args} />
        case "button":
            return <ButtonComponent {...component.args} />
        default:
            return <Text>No Component Found</Text>
    }
}