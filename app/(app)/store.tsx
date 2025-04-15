import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/hooks/useApp";
import { useConnection } from "@/hooks/useConnection";
import { styleStore } from "@/styles/styles";
import {
  LocalCategory,
  LocalCity,
  LocalNeighborhood,
  LocalStreet,
} from "@/types/Database";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { appRepository } from "@/repositories/AppRepository";
import ModalStreet from "@/components/ModalStoreStreet";
import ModalNeighborhood from "@/components/ModalStoreNeighborhood";

export default function Screen() {
  const { authState } = useAuth();
  const { isConnected } = useConnection();
  const {
    fetchCities,
    fetchStreets,
    fetchNeighborhoods,
    fetchCategoriesContracts,
  } = useApp();
  const [cities, setCities] = useState<LocalCity[]>([]);
  const [categoriesContracts, setCategoriesContracts] = useState<
    LocalCategory[]
  >([]);
  const [streets, setStreets] = useState<LocalStreet[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<LocalNeighborhood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompany, setIsCompany] = useState(false);
  const [isOpenStreetModal, setIsOpenStreetModal] = useState(false);
  const [isOpenNeighborhoodModal, setIsOpenNeighborhoodModal] = useState(false);

  const civilState = [
    {
      id: 0,
      label: "Casado(a)",
    },
    {
      id: 1,
      label: "Solteiro(a)",
    },
    {
      id: 2,
      label: "Viúvo(a)",
    },
    {
      id: 3,
      label: "Separado(a)",
    },
  ];

  const genders = [
    {
      id: 0,
      label: "Feminino",
    },
    {
      id: 1,
      label: "Masculino",
    },
  ];

  const personTypes = [
    {
      id: "F",
      label: "Pessoa Física",
    },
    {
      id: "J",
      label: "Pessoa Jurídica",
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      category_id: "",
      mensality_price: "",
      name: "",
      document: "",
      document_2: "",
      email: "",
      zipcode: "",
      city_id: "",
      street_id: "",
      neighborhood_id: "",
      number: "",
      person_nickname: "",
      person_type: "",
      colab_id: authState ? authState.userId : "",
      phone_1: "",
      phone_2: "",
      observation_phone_1: "",
      observation_phone_2: "",
      complement: "",
      sale_at: "",
      contract_at: "",
      observation_remote: "",
      observation: "",
      father_name: "",
      mother_name: "",
      parents_address: "",
      naturality_city: "",
      birthday: "",
      dealership_id: "",
      gender: "",
      civil_state: "",
      company_fundation_at: "",
      card_number: "",
    },
  });

  const handleCancel = () => {
    reset();
    return router.push("/");
  };

  const closeModal = () => {
    setIsOpenStreetModal(false);
    setIsOpenNeighborhoodModal(false);
    loadData();
  };

  const onSubmit = async (data: any) => {
    try {
      const hasNetwork = await isConnected();
      if (!hasNetwork) {
        Alert.alert("Erro", "Ooops!! Sem conexão com a internet.");
        return;
      }

      const id = await appRepository
        .storeIndividualContract(data)
        .then((response) => response.insertedRowId)
        .catch((error) => {
          Alert.alert(
            "Erro",
            "Ooops!! Ocorreu um erro ao cadastrar o contrato.",
          );
          return;
        });

      if (id) {
        router.navigate({
          pathname: "/contracts/dependents",
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
    const streets = await fetchStreets();
    const neighborhoods = await fetchNeighborhoods();

    setCities(cities);
    setCategoriesContracts(categoriesContracts);
    setStreets(streets);
    setNeighborhoods(neighborhoods);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  useEffect(() => {
    const redirect = async () => {
      const needToSync = await appRepository.needToSync();
      if (needToSync) {
        router.replace("/sync");
        return;
      }
    };

    redirect();
  }, []);

  const onChangeCategoriy = (value: number) => {
    const category = categoriesContracts.find((item) => item.id === value);

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
            rules={{ required: "O Número do cartão é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Número do Cartão"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="card_number"
          />
          {errors.card_number && (
            <Text style={styleStore.errorText}>
              {errors.card_number.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ required: "A categoria do contrato é obrigatória." }}
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
                onChange={(item) => {
                  onChange(item.value);
                  onChangeCategoriy(item.value);
                }}
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
                data={genders.map((item) => ({
                  label: item.label,
                  value: item.id,
                }))}
                maxHeight={200}
                placeholder="Sexo"
                value={value}
                style={styleStore.input}
                onChange={(item) => {
                  onChange(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="gender"
          />
          {errors.gender && (
            <Text style={styleStore.errorText}>{errors.gender.message}</Text>
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
            rules={{ required: "O apelido é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Apelido"
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
            rules={{ required: "O tipo de pessoa é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={personTypes.map((item) => ({
                  label: item.label,
                  value: item.id,
                }))}
                maxHeight={200}
                placeholder="Tipo de Pessoa"
                value={value}
                style={styleStore.input}
                onChange={(item) => {
                  onChange(item.value);
                  setIsCompany(item.value === "J");
                  setValue("document", "");
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="person_type"
          />
          {errors.person_type && (
            <Text style={styleStore.errorText}>
              {errors.person_type.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "O documento é obrigatório.",
              pattern: !isCompany
                ? /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
                : /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                style={styleStore.input}
                placeholder={isCompany ? "CNPJ" : "CPF"}
                value={value}
                mask={isCompany ? "99.999.999/9999-99" : "999.999.999-99"}
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
              required: "O campo é obrigatório.",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder={isCompany ? "I.E" : "RG"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="document_2"
          />
          {errors.document_2 && (
            <Text style={styleStore.errorText}>
              {errors.document_2.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Dropdown
                data={civilState.map((item) => ({
                  label: item.label,
                  value: item.id,
                }))}
                maxHeight={200}
                placeholder="Estado Civil"
                value={value}
                style={styleStore.input}
                onChange={(item) => {
                  onChange(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="civil_state"
          />
          {errors.civil_state && (
            <Text style={styleStore.errorText}>
              {errors.civil_state.message}
            </Text>
          )}

          {isCompany ? (
            <>
              <Controller
                control={control}
                rules={{
                  required: "A data de fundação é obrigatória.",
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
            </>
          ) : (
            <>
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
                <Text style={styleStore.errorText}>
                  {errors.birthday.message}
                </Text>
              )}
            </>
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
                onChange={(item) => {
                  onChange(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="street_id"
          />
          <TouchableOpacity onPress={() => setIsOpenStreetModal(true)}>
            <Text style={styleStore.textInsert}>Inserir uma nova rua</Text>
          </TouchableOpacity>
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
                onChange={(item) => {
                  onChange(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="neighborhood_id"
          />
          <TouchableOpacity onPress={() => setIsOpenNeighborhoodModal(true)}>
            <Text style={styleStore.textInsert}>Inserir um novo bairro</Text>
          </TouchableOpacity>
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
                onChange={(item) => {
                  onChange(item.value);
                }}
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
            rules={{
              required: "O campo é obrigatório",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Nome do pai"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="father_name"
          />
          {errors.father_name && (
            <Text style={styleStore.errorText}>
              {errors.father_name.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "O campo é obrigatório",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Nome da mãe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="mother_name"
          />
          {errors.mother_name && (
            <Text style={styleStore.errorText}>
              {errors.mother_name.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "O campo é obrigatório",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Endereço dos pais"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="parents_address"
          />
          {errors.parents_address && (
            <Text style={styleStore.errorText}>
              {errors.parents_address.message}
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
                placeholder="Selecione a Cidade de Naturalidade"
                searchPlaceholder="Buscar Cidade"
                onChange={(item) => {
                  onChange(item.value);
                }}
                onBlur={onBlur}
                labelField={"label"}
                valueField={"value"}
              />
            )}
            name="naturality_city"
          />
          {errors.naturality_city && (
            <Text style={styleStore.errorText}>
              {errors.naturality_city.message}
            </Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "A data da venda é obrigatória.",
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
            rules={{
              required: "A data do contrato é obrigatória.",
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
            rules={{ required: "O campo é obrigatório." }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styleStore.input}
                placeholder="Observação"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
            name="observation"
          />
          {errors.observation && (
            <Text style={styleStore.errorText}>
              {errors.observation.message}
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
                Salvar e Adicionar Dependentes
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <ModalStreet
        isOpen={isOpenStreetModal}
        onClose={closeModal}
        isDismissable={true}
      />
      <ModalNeighborhood
        isOpen={isOpenNeighborhoodModal}
        onClose={closeModal}
        isDismissable={true}
      />
    </SafeAreaView>
  );
}
