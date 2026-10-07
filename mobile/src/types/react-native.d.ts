declare module "react-native" {
  export const View: any;
  export const Text: any;
  export const StyleSheet: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const ActivityIndicator: any;
  export const FlatList: any;
  export const ScrollView: any;
  export const SafeAreaView: any;
  export const Image: any;
  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;
}

declare module "expo-status-bar" {
  export const StatusBar: any;
}

declare module "expo" {
  export function registerRootComponent(component: any): void;
}
