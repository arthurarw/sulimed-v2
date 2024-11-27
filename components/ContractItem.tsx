import { Text, View } from "react-native";

type Props = {
  name: string;
  id: number;
  sync: boolean;
};

export default function ContractItem(props: Props) {
  return (
    <View>
      <Text>{props.name}</Text>
    </View>
  );
}
