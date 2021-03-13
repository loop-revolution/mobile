import { useNavigation } from "@react-navigation/core";
import { LinkArgs } from "display-api";
import { Linking } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { redirectTo } from "../../../utils/helper";
import { TextComponent } from "./TextComponent";

export const LinkComponent = ({ text, external, app_path, url }: LinkArgs) => {
    const navigation = useNavigation()

    const onPress = () => {
        if (app_path) {
            redirectTo(app_path, navigation)
        } else if (external && url && Linking.canOpenURL(url)) {
            Linking.openURL(url)
        }
    }

    return (
        <TouchableRipple onPress={onPress}>
            {TextComponent({ ...text.args }, { isLink: true })}
        </TouchableRipple>
    )
}