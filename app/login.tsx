import { useSession } from "@/contexts/ProviderContext";
import { router } from "expo-router";
import { Button, View } from "react-native";

export default function Login() {
  const { signIn } = useSession();
  const handleLogin = () => {
    signIn();
    //Antes de navegar, tenha certeza de que o usuário está autenticado
    router.replace("/");
  };

  return (
    <View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
