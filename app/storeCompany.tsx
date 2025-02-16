import { useConnection } from "@/hooks/useConnection";
import { City } from "@/types/Ecard";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useApp } from "@/hooks/useApp";
import { LocalCategory, LocalCity } from "@/types/Database";
import { styleStore } from "@/styles/styles";
import { MaskedTextInput } from "react-native-mask-text";

export default function Screen() {
  const { isConnected } = useConnection();
  const { fetchCities, fetchBusinessContracts } = useApp();
  const [cities, setCities] = useState<LocalCity[]>([]);
  const [businessContracts, setBusinessContracts] = useState<LocalCategory[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      business_category_id: "",
      name: "",
      document: "",
      document2: "",
      email: "",
      phone: "",
      telephone: "",
      zipcode: "",
      state: "",
      city_id: "",
      street: "",
      neighborhood: "",
      number: "",
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

      /*const id = await appRepository
        .store(data)
        .then((response) => response.insertedRowId)
        .catch((error) => {
          Alert.alert("Erro", "Ooops!! Ocorreu um erro ao salvar o cliente.");
          return;
        });*/

      console.log(data);

      const id = 123;

      Alert.alert("Sucesso!!", `Contrato Empresarial ID ${id}`);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ooops!! Ocorreu um erro ao salvar o cliente.");
    }
  };

  useEffect(() => {
    const cities = async () => {
      try {
        const response = await fetchCities();
        setCities(response);
      } catch (error) {
        Alert.alert("Erro", "Ooops!! Ocorreu um erro ao buscar as cidades.");
        throw error;
      }
    };

    const businessContracts = async () => {
      try {
        const response = await fetchBusinessContracts();
        setBusinessContracts(response);
      } catch (error) {
        Alert.alert("Erro", "Ooops!! Ocorreu um erro ao buscar os contratos.");
        throw error;
      }
    };

    cities();
    businessContracts();
  }, []);

  return (
    <SafeAreaView style={styleStore.container}>
      <ScrollView>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              onBlur={onBlur}
              style={styleStore.input}
            >
              <Picker.Item label="Selecione a Cidade" value="" />
              {businessContracts.map((contract, index) => (
                <Picker.Item
                  key={index}
                  label={`${contract.description} - R$${contract.price ?? 0}`}
                  value={contract.id}
                />
              ))}
            </Picker>
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
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styleStore.input}
              placeholder="RG"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="document2"
        />
        {errors.document2 && (
          <Text style={styleStore.errorText}>{errors.document2.message}</Text>
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
          name="phone"
        />
        {errors.phone && (
          <Text style={styleStore.errorText}>{errors.phone.message}</Text>
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
          name="telephone"
        />
        {errors.telephone && (
          <Text style={styleStore.errorText}>{errors.telephone.message}</Text>
        )}

        <Controller
          control={control}
          rules={{ required: "O CEP é obrigatório" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MaskedTextInput
              style={styleStore.input}
              placeholder="CEP"
              value={value}
              mask="99999999"
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
              placeholder="Rua"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="street"
        />
        {errors.street && (
          <Text style={styleStore.errorText}>{errors.street.message}</Text>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styleStore.input}
              placeholder="Bairro"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="neighborhood"
        />
        {errors.neighborhood && (
          <Text style={styleStore.errorText}>
            {errors.neighborhood.message}
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
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              onBlur={onBlur}
              style={styleStore.input}
            >
              <Picker.Item label="Selecione a Cidade" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city.name} value={city.id} />
              ))}
            </Picker>
          )}
          name="city_id"
        />
        {errors.city_id && (
          <Text style={styleStore.errorText}>{errors.city_id.message}</Text>
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
            <Text style={styleStore.buttonText}>Salvar e Assinar Contrato</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
