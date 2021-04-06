import React from 'react'
import { ComponentObject } from 'display-api'
import { CardComponent } from './components/CardComponent'
import { Text } from 'react-native-paper'
import { TextComponent } from './components/TextComponent'
import { StackComponent } from './components/StackComponent'
import { InputComponent } from './components/InputComponent'
import { ButtonComponent } from './components/ButtonComponent'
import { LinkComponent } from './components/LinkComponent'
import { DropdownComponent } from './components/DropdownComponent'
import { CheckboxComponent } from './components/CheckboxComponent'
import { BadgeComponent } from './components/BadgeComponent'
import { ProgressBarComponent } from './components/ProgressBarComponent'
import { ActionPopoverComponent } from './components/ActionPopoverComponent'
import { DisplayListComponent } from './components/DisplayListComponent'
import { RichTextComponent } from './components/RichTextComponent'
import { StickyToggleButtonComponent } from './components/StickyToggleButtonComponent'

export const ComponentDelegate = ({ component }: { component: ComponentObject }) => {
	switch (component.cid) {
		case 'card':
			return <CardComponent {...component.args} />
		case 'text':
			return <TextComponent {...component.args} />
		case 'stack':
			return <StackComponent {...component.args} />
		case 'input':
			return <InputComponent {...component.args} />
		case 'button':
			return <ButtonComponent {...component.args} />
		case 'link':
			return <LinkComponent {...component.args} />
		case 'checkbox':
			return <CheckboxComponent {...component.args} />
		case 'badge':
			return <BadgeComponent {...component.args} />
		case 'progress':
			return <ProgressBarComponent {...component.args} />
		case 'dropdown':
			return <DropdownComponent {...component.args} />
		case 'actionpopover':
			return <ActionPopoverComponent {...component.args} />
		case 'displaylist':
			return <DisplayListComponent {...component.args} />
		case 'richtext':
			return <RichTextComponent {...component.args} />
		case 'stickytogglebutton':
			return <StickyToggleButtonComponent {...component.args} />
		default:
			return <Text>No Component Found</Text>
	}
}
