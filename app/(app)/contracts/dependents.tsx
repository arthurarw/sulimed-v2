import { useConnection } from "@/hooks/useConnection";
import { appRepository } from "@/repositories/AppRepository";
import { styleStore } from "@/styles/styles";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MaskedTextInput } from "react-native-mask-text";

export default function Screen() {
  const { contractId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [kinships, setKinships]: any = useState([]);

  const handleFinish = () => {
    router.navigate({
      pathname: "/contracts/payment",
      params: { contractId },
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      contract_id: contractId,
      name: "",
      birthday: "",
      kinship_id: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      await appRepository
        .storeDependents(
          Number(contractId),
          data.name,
          data.birthday,
          data.kinship_id,
        )
        .then((dependent) => {
          Alert.alert(
            "Sucesso!",
            `Dependente ${dependent.insertedRowId} adicionado.`,
          );
          reset();
        })
        .catch(() => {
          Alert.alert("Erro!", "Ocorreu um erro ao adicionar o dependente.");
        });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao adicionar o dependente.");
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    const kinships = appRepository.fetchKinships();
    setKinships(kinships);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Adicionar Dependentes",
        }}
      />
      <Text style={styleStore.text}>
        Adicione os Dependentes que você deseja no cadastro
      </Text>
      {isLoading ? (
        <ActivityIndicator size={"large"} color={"#1D643B"} />
      ) : (
        <ScrollView>
          <Controller
            control={control}
            rules={{ required: "O grau de parentesco é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={kinships.map((item: { id: number; label: string }) => ({
                  label: item.label,
                  value: item.id,
                }))}
                search
                maxHeight={200}
                placeholder="Selecione o Grau de Parentesco"
                value={value}
                style={styleStore.input}
                searchPlaceholder="Buscar Grau de Parentesco"
                onChange={(item) => {
                  onChange(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="kinship_id"
          />
          {errors.kinship_id && (
            <Text style={styleStore.errorText}>
              {errors.kinship_id.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O nome é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text style={styleStore.errorText}>{errors.name.message}</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "A data de nascimento é obrigatória.",
              validate: (value) => {
                const date = value.split("/");
                if (date.length !== 3) {
                  return false;
                }
                const day = parseInt(date[0]);
                const month = parseInt(date[1]);
                const year = parseInt(date[2]);
                return (
                  day > 0 && day < 32 && month > 0 && month < 13 && year > 0
                );
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="Data de Nascimento"
                value={value}
                mask="99/99/9999"
                onChangeText={onChange}
                keyboardType="phone-pad"
                onBlur={onBlur}
              />
            )}
            name="birthday"
          />
          {errors.birthday && (
            <Text style={styleStore.errorText}>{errors.birthday.message}</Text>
          )}
          <View style={styleStore.btnContainer}>
            <TouchableOpacity
              style={styleStore.buttonBlue}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styleStore.buttonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styleStore.button, marginTop: 50 }}
              onPress={handleFinish}
            >
              <Text style={styleStore.buttonText}>Salvar e Continuar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: StatusBar.currentHeight || 0,
  },
});
