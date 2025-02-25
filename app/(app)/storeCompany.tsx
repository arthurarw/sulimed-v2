import { useConnection } from "@/hooks/useConnection";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { useApp } from "@/hooks/useApp";
import {
  LocalCategory,
  LocalCity,
  LocalNeighborhood,
  LocalStreet,
} from "@/types/Database";
import { styleStore } from "@/styles/styles";
import { MaskedTextInput } from "react-native-mask-text";
import { useAuth } from "@/contexts/AuthContext";
import { appRepository } from "@/repositories/AppRepository";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect } from "@react-navigation/native";

export default function Screen() {
  const { authState } = useAuth();
  const { isConnected } = useConnection();
  const {
    fetchCities,
    fetchCategoriesBusinessContracts,
    fetchStreets,
    fetchNeighborhoods,
    fetchCategoriesContracts,
  } = useApp();
  const [cities, setCities] = useState<LocalCity[]>([]);
  const [categoriesBusinessContracts, setCategoriesBusinessContracts] =
    useState<LocalCategory[]>([]);
  const [categoriesContracts, setCategoriesContracts] = useState<
    LocalCategory[]
  >([]);
  const [streets, setStreets] = useState<LocalStreet[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<LocalNeighborhood[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      business_category_id: "",
      category_id: "",
      mensality_price: "",
      name: "",
      document: "",
      document2: "",
      email: "",
      zipcode: "",
      city_id: "",
      street_id: "",
      neighborhood_id: "",
      number: "",
      person_nickname: "",
      person_type: "J",
      colab_id: authState ? authState.userId : "",
      phone_1: "",
      phone_2: "",
      observation_phone_1: "",
      observation_phone_2: "",
      complement: "",
      company_fundation_at: "",
      due_contract_day: "",
      sale_at: "",
      contract_at: "",
      observation: "",
      observation_remote: "",
    },
  });

  const handleCancel = () => {
    reset();
    return router.push("/");
  };

  const onSubmit = async (data: any) => {
    try {
      const hasNetwork = await isConnected();
      if (!hasNetwork) {
        Alert.alert("Erro", "Ooops!! Sem conexão com a internet.");
        return;
      }

      const id = await appRepository
        .storeBusinessContract(data)
        .then((response) => response.insertedRowId)
        .catch((error) => {
          console.log(error);
          Alert.alert(
            "Erro",
            "Ooops!! Ocorreu um erro ao cadastrar o contrato.",
          );
          return;
        });

      if (id) {
        router.navigate({
          pathname: "/contracts/signature",
          params: { contractId: id },
        });
      }

      console.log("Contrato Salvo:", id);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ooops!! Ocorreu um erro ao salvar o cliente.");
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    const cities = await fetchCities();
    const categoriesContracts = await fetchCategoriesContracts();
    const categoriesBusinessContracts =
      await fetchCategoriesBusinessContracts();
    const streets = await fetchStreets();
    const neighborhoods = await fetchNeighborhoods();

    setCities(cities);
    setCategoriesContracts(categoriesContracts);
    setCategoriesBusinessContracts(categoriesBusinessContracts);
    setStreets(streets);
    setNeighborhoods(neighborhoods);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const onChangeBusinessCategory = (value: number) => {
    const category = categoriesBusinessContracts.find(
      (item) => item.id === value,
    );

    if (category) {
      setValue("mensality_price", category.price.toString());
      return;
    }

    setValue("mensality_price", "0");
  };

  return (
    <SafeAreaView style={styleStore.container}>
      {isLoading ? (
        <ActivityIndicator size={"large"} color={"#1D643B"} />
      ) : (
        <ScrollView>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={categoriesBusinessContracts.map((item) => ({
                  label: item.description,
                  value: item.id,
                }))}
                search
                maxHeight={200}
                placeholder="Selecione a Cat. Emp. do Contrato"
                value={value}
                style={styleStore.input}
                searchPlaceholder="Buscar Categoria Empresarial"
                onChange={(item) => {
                  console.log("uqq", item);
                  onChange(item);
                  onChangeBusinessCategory(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="business_category_id"
          />
          {errors.business_category_id && (
            <Text style={styleStore.errorText}>
              {errors.business_category_id.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O valor da mensalidade é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Valor da Mensalidade"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="mensality_price"
          />
          {errors.mensality_price && (
            <Text style={styleStore.errorText}>
              {errors.mensality_price.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={categoriesContracts.map((item) => ({
                  label: item.description,
                  value: item.id,
                }))}
                search
                maxHeight={200}
                placeholder="Selecione a Cat. Ind. do Contrato"
                value={value}
                style={styleStore.input}
                searchPlaceholder="Buscar Categoria Individual"
                onChange={onChange}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="category_id"
          />
          {errors.category_id && (
            <Text style={styleStore.errorText}>
              {errors.category_id.message}
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
            rules={{ required: "O nome fantasia é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Nome Fantasia"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="person_nickname"
          />
          {errors.person_nickname && (
            <Text style={styleStore.errorText}>
              {errors.person_nickname.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O CNPJ é obrigatório" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="CNPJ"
                value={value}
                mask="99.999.999/9999-99"
                onChangeText={onChange}
                keyboardType="phone-pad"
                onBlur={onBlur}
              />
            )}
            name="document"
          />
          {errors.document && (
            <Text style={styleStore.errorText}>{errors.document.message}</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "O e-mail é obrigatório",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail inválido",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="E-mail"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={styleStore.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O celular é obrigatório" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="Celular"
                value={value}
                mask="(99)99999-9999"
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
            name="phone_1"
          />
          {errors.phone_1 && (
            <Text style={styleStore.errorText}>{errors.phone_1.message}</Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O campo é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Observação Celular"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="observation_phone_1"
          />
          {errors.observation_phone_1 && (
            <Text style={styleStore.errorText}>
              {errors.observation_phone_1.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="Telefone"
                value={value}
                mask="(99)9999-9999"
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
            name="phone_2"
          />
          {errors.phone_2 && (
            <Text style={styleStore.errorText}>{errors.phone_2.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Observação Telefone"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="observation_phone_2"
          />
          {errors.observation_phone_2 && (
            <Text style={styleStore.errorText}>
              {errors.observation_phone_2.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O CEP é obrigatório" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="CEP"
                value={value}
                mask="99999-999"
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
            name="zipcode"
          />
          {errors.zipcode && (
            <Text style={styleStore.errorText}>{errors.zipcode.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Complemento"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="complement"
          />
          {errors.complement && (
            <Text style={styleStore.errorText}>
              {errors.complement.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Número"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="number"
          />
          {errors.number && (
            <Text style={styleStore.errorText}>{errors.number.message}</Text>
          )}

          <Controller
            control={control}
            rules={{ required: "A rua é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={streets.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placeholder="Selecione a Rua"
                search
                maxHeight={200}
                value={value}
                style={styleStore.input}
                searchPlaceholder="Buscar Rua"
                onChange={onChange}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="street_id"
          />
          {errors.street_id && (
            <Text style={styleStore.errorText}>{errors.street_id.message}</Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O bairro é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={neighborhoods.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                search
                maxHeight={200}
                placeholder="Selecione o Bairro"
                value={value}
                style={styleStore.input}
                searchPlaceholder="Buscar Bairro"
                onChange={onChange}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="neighborhood_id"
          />
          {errors.neighborhood_id && (
            <Text style={styleStore.errorText}>
              {errors.neighborhood_id.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={cities.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                search
                maxHeight={200}
                value={value}
                style={styleStore.input}
                placeholder="Selecione a Cidade"
                searchPlaceholder="Buscar Cidade"
                onChange={onChange}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="city_id"
          />
          {errors.city_id && (
            <Text style={styleStore.errorText}>{errors.city_id.message}</Text>
          )}

          <Controller
            control={control}
            rules={{ required: "A data de fundação é obrigatória." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="Data de Fundação"
                value={value}
                mask="99/99/9999"
                onChangeText={onChange}
                keyboardType="phone-pad"
                onBlur={onBlur}
              />
            )}
            name="company_fundation_at"
          />
          {errors.company_fundation_at && (
            <Text style={styleStore.errorText}>
              {errors.company_fundation_at.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "O dia do vencimento é obrigatório" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Dia do Vencimento do Contrato"
                value={value}
                keyboardType="phone-pad"
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="due_contract_day"
          />
          {errors.due_contract_day && (
            <Text style={styleStore.errorText}>
              {errors.due_contract_day.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "A data da venda é obrigatória." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="Data da Venda"
                value={value}
                mask="99/99/9999"
                onChangeText={onChange}
                keyboardType="phone-pad"
                onBlur={onBlur}
              />
            )}
            name="sale_at"
          />
          {errors.sale_at && (
            <Text style={styleStore.errorText}>{errors.sale_at.message}</Text>
          )}

          <Controller
            control={control}
            rules={{ required: "A data do contrato é obrigatória." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder="Data do Contrato"
                value={value}
                mask="99/99/9999"
                onChangeText={onChange}
                keyboardType="phone-pad"
                onBlur={onBlur}
              />
            )}
            name="contract_at"
          />
          {errors.contract_at && (
            <Text style={styleStore.errorText}>
              {errors.contract_at.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Observação Remota"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="observation_remote"
          />
          {errors.observation_remote && (
            <Text style={styleStore.errorText}>
              {errors.observation_remote.message}
            </Text>
          )}

          <View style={styleStore.btnContainer}>
            <TouchableOpacity
              style={styleStore.buttonCancel}
              onPress={handleCancel}
            >
              <Text style={styleStore.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styleStore.button}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styleStore.buttonText}>
                Salvar e Assinar Contrato
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
