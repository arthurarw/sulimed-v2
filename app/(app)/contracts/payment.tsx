import { appRepository } from "@/repositories/AppRepository";
import { styleStore } from "@/styles/styles";
import { router, useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MaskedTextInput } from "react-native-mask-text";

export default function Screen() {
  const { contractId } = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");

  const paymentMethods = [
    { label: "Cartão de Crédito", id: "CC" },
    { label: "Conta de Energia", id: "N" },
  ];

  const dealerships = [
    {
      id: 31,
      label: "RGE",
    },
    {
      id: 98,
      label: "RGE-SUL",
    },
    {
      id: 26,
      label: "CELESC",
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_method: "",
      membership_fee: "",
      account_holder_name: "",
      account_holder_type: "F",
      account_document: "",
      account_document_2: "",
      installation_partner: "",
      dealership_id: "",
      unity_consumer: "",
      due_account_date: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      await appRepository
        .setPaymentMethod(Number(contractId), data)
        .then(() => {
          router.navigate({
            pathname: "/contracts/signature",
            params: { contractId },
          });
        })
        .catch(() => {
          Alert.alert("Erro!", "Ocorreu um erro ao atualizar o contrato.");
        });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao atualizar o contrato.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Método de Pagamento",
        }}
      />
      <Text style={styleStore.text}>
        Vincule o Método de Pagamento ao Contrato
      </Text>
      <ScrollView>
        <Controller
          control={control}
          rules={{ required: "O método de pagamento é obrigatório." }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dropdown
              data={paymentMethods.map(
                (item: { id: string; label: string }) => ({
                  label: item.label,
                  value: item.id,
                }),
              )}
              maxHeight={200}
              placeholder="Selecione o Método de Pagamento"
              value={value}
              style={styleStore.input}
              onChange={(item) => {
                onChange(item.value);
                setPaymentMethod(item.value);
              }}
              onBlur={onBlur}
              labelField={"label"}
              valueField={"value"}
            />
          )}
          name="payment_method"
        />
        {errors.payment_method && (
          <Text style={styleStore.errorText}>
            {errors.payment_method.message}
          </Text>
        )}

        {paymentMethod === "CC" && (
          <>
            <Controller
              control={control}
              rules={{ required: "O campo é obrigatório." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styleStore.input}
                  placeholder="Taxa de Adesão"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                />
              )}
              name="membership_fee"
            />
            {errors.membership_fee && (
              <Text style={styleStore.errorText}>
                {errors.membership_fee.message}
              </Text>
            )}
          </>
        )}

        {paymentMethod === "N" && (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Dropdown
                  data={dealerships.map((item) => ({
                    label: item.label,
                    value: item.id,
                  }))}
                  maxHeight={200}
                  placeholder="Selecione a Concessionária"
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
              name="dealership_id"
            />
            {errors.dealership_id && (
              <Text style={styleStore.errorText}>
                {errors.dealership_id.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{ required: "O campo é obrigatório." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styleStore.input}
                  placeholder="Unidade Consumidora"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
              name="unity_consumer"
            />
            {errors.unity_consumer && (
              <Text style={styleStore.errorText}>
                {errors.unity_consumer.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{ required: "O campo é obrigatório." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styleStore.input}
                  placeholder="Titular da Conta"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
              name="account_holder_name"
            />
            {errors.account_holder_name && (
              <Text style={styleStore.errorText}>
                {errors.account_holder_name.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                required: "O documento é obrigatório.",
                pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MaskedTextInput
                  style={styleStore.input}
                  placeholder="CPF do Titular da Conta"
                  value={value}
                  mask="999.999.999-99"
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                />
              )}
              name="account_document"
            />
            {errors.account_document && (
              <Text style={styleStore.errorText}>
                {errors.account_document.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{ required: "O campo é obrigatório." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styleStore.input}
                  placeholder="RG do Titular da Conta"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
              name="account_document_2"
            />
            {errors.account_document_2 && (
              <Text style={styleStore.errorText}>
                {errors.account_document_2.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{ required: "O campo é obrigatório." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styleStore.input}
                  placeholder="Parceiro de Instalação"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
              name="installation_partner"
            />
            {errors.installation_partner && (
              <Text style={styleStore.errorText}>
                {errors.installation_partner.message}
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                required: "A data de vencimento da conta é obrigatória.",
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
                  placeholder="Data de Vencimento da Conta"
                  value={value}
                  mask="99/99/9999"
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                />
              )}
              name="due_account_date"
            />
            {errors.due_account_date && (
              <Text style={styleStore.errorText}>
                {errors.due_account_date.message}
              </Text>
            )}
          </>
        )}

        <View style={styleStore.btnContainerPayment}>
          <TouchableOpacity
            style={
              paymentMethod === ""
                ? styleStore.buttonDisabled
                : styleStore.button
            }
            onPress={handleSubmit(onSubmit)}
            disabled={paymentMethod === ""}
          >
            <Text style={styleStore.buttonText}>Salvar e Assinar Contrato</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
