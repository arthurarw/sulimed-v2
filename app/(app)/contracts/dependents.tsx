import { appRepository } from "@/repositories/AppRepository";
import { styleStore } from "@/styles/styles";
import { router, useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useEffect, useState } from "react";
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
  TextInput,
  FlatList,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MaskedTextInput } from "react-native-mask-text";

export default function Screen() {
  const { contractId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [dependents, setDependents]: any = useState([]);

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
          fetchDependents();
        })
        .catch(() => {
          Alert.alert("Erro!", "Ocorreu um erro ao adicionar o dependente.");
        });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao adicionar o dependente.");
    }
  };

  const kinships = [
    {
      idGrauParentesco: 1,
      dsGrauParentesco: "FILHO(A)",
    },
    {
      idGrauParentesco: 2,
      dsGrauParentesco: "ESPOSO(A)",
    },
    {
      idGrauParentesco: 3,
      dsGrauParentesco: "AVÔ(Ó)",
    },
    {
      idGrauParentesco: 4,
      dsGrauParentesco: "MÃE / PAI",
    },
    {
      idGrauParentesco: 5,
      dsGrauParentesco: "TIO(A)",
    },
    {
      idGrauParentesco: 6,
      dsGrauParentesco: "SOGRO(A)",
    },
    {
      idGrauParentesco: 7,
      dsGrauParentesco: "OUTROS",
    },
    {
      idGrauParentesco: 8,
      dsGrauParentesco: "IRMÃ(O)",
    },
    {
      idGrauParentesco: 9,
      dsGrauParentesco: "GENRO/NORA",
    },
    {
      idGrauParentesco: 10,
      dsGrauParentesco: "ENTEADO(A)",
    },
    {
      idGrauParentesco: 11,
      dsGrauParentesco: "NETO(A)",
    },
    {
      idGrauParentesco: 12,
      dsGrauParentesco: "PRIMO (A)",
    },
    {
      idGrauParentesco: 13,
      dsGrauParentesco: "SOBRINHO (A)",
    },
    {
      idGrauParentesco: 14,
      dsGrauParentesco: "NAMORADO (A)",
    },
    {
      idGrauParentesco: 15,
      dsGrauParentesco: "PADASTRO / MADASTRA",
    },
    {
      idGrauParentesco: 17,
      dsGrauParentesco: "CUNHADO (A)",
    },
  ];

  const fetchDependents = async () => {
    setIsLoading(true);
    const dependents = await appRepository.fetchDependents(Number(contractId));

    if (dependents.length > 0) {
      setDependents(
        dependents.map((dependent) => {
          const labelKinship = kinships.find(
            (kinship) => kinship.idGrauParentesco === dependent.kinship_id,
          );

          return {
            ...dependent,
            labelKinship: labelKinship?.dsGrauParentesco,
          };
        }),
      );

      setIsLoading(false);
      return;
    }

    setDependents([]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDependents();
  }, []);

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
      <View>
        <Controller
          control={control}
          rules={{ required: "O grau de parentesco é obrigatório." }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dropdown
              data={kinships.map((item) => ({
                label: item.dsGrauParentesco,
                value: item.idGrauParentesco,
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
          <Text style={styleStore.errorText}>{errors.kinship_id.message}</Text>
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
              return day > 0 && day < 32 && month > 0 && month < 13 && year > 0;
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

        <TouchableOpacity
          style={styleStore.buttonBlue}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styleStore.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ ...styleStore.text, marginTop: 5, marginBottom: 5 }}>
        Dependentes Cadastrados
      </Text>
      {isLoading ? (
        <ActivityIndicator size={"large"} color={"#1D643B"} />
      ) : (
        <FlatList
          data={dependents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>
                {item.name} - {item.labelKinship} - {item.birthday}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styleStore.btnContainer}>
        <TouchableOpacity
          style={{ ...styleStore.button }}
          onPress={handleFinish}
        >
          <Text style={styleStore.buttonText}>Salvar e Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  listItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 5,
  },
});
