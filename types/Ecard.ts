export interface City {
  nmCidade: string;
  idCidade: number;
}

export interface Street {
  nmRua: string;
  idRua: number;
  idCidade: number | null;
}

export interface Neighborhood {
  nmBairro: string;
  idBairro: number;
  idCidade: number | null;
}

export interface ContractCategories {
  idCategoriaContrato: number;
  dsCategoriaContrato: string;
  valor: string;
}

export interface ContractBusinessCategories {
  idCategoriaContratoEmpresarial: number;
  dsCategoriaContratoEmpresarial: string;
  nroMaximoFuncionarios: number;
  valor: string;
}

export interface StoreContract {
  idPessoa: number;
  filial: number;
  preContrato: string;
  ativo: string;
  dtVenda: string;
  dtContrato: string;
  dtAlteracao: string;
  nroCartao: string;
  mensalista: string;
  boleto: string;
  permuta: string;
  empresarial: string;
  observacao: string | null;
  telefone2: string;
  obsTelefone1: string | null;
  obsTelefone2: string | null;
  obsCelular: string | null;
  casaPropria: string;
  sexo: any;
  estadoCivil: number;
  enderecoPaiMae: string | null;
  nmPai: string | null;
  nmMae: string | null;
  idCidadeNaturalidade: number | null;
  idUsuarioIncluiu: number | null;
  idUsuarioAlterou: number | null;
  idOptanteCentercob: number | null;
  idOptanteCelesc: number | null;
  titularDaConta: string;
  tipoPessoaTitular: string;
  cpfCnpjTitularConta: string | null;
  rgIeTitularConta: string | null;
  codigoConcessionaria: string | null;
  parceiroNegocioInstalacao: string | null;
  unidadeConsumidora: string | null;
  dtVencimentoConta: string | null;
  dtLeituraConta: string | null;
  energiaPrimeiroVencimento: string | null;
  acaoCadastro: string | null;
  acaoEnviada: string | null;
  idRemessaCentercob: number | null;
  idFuncionario: number | null;
  valorComissao: string | null;
  boletoParcelas: string | null;
  boletoPrimeiroVencimento: string | null;
  boletoParcelaGerada: string | null;
  idContratoEmpresarial: number | null;
  dtInsercao: string;
  dtUltimaAlteracao: string;
  historicoSistema: any;
  md5: string;
  dataCancelamentoContrato: any;
  dataEncerramentoContratoBoleto: any;
  tipoPagamentoContrato: any;
  valorTaxaAdesao: string;
  tags: string;
  numerosCartao: any;
  vencimentoMes: any;
  vencimentoAno: any;
  vencimentoFatura: any;
  cpfTitular: any;
  titularCartao: any;
  bandeiraCartao: any;
  codigoVendedorCenterCob: number;
  codigoCidadeNFSe: number;
  proximoLancamentoNFSe: any;
  nfseEmitida: string;
  nmPessoa: string;
  apelidoFantasia: string;
  tipo: string;
  cep: string;
  numero: string;
  complemento: string;
  proximidade: string;
  idCidade: number;
  idBairro: number;
  idRua: number;
  telefone: string;
  email: string;
  dtCadastro: string;
  cpf: string;
  dtNascimento: string;
  rg: string;
  celular: string;
  cnpj: string;
  dtFundacao: any;
  inscricaoEstadual: any;
  indicadorIeDestinatario: any;
  regimeTributario: any;
  empresaTrabalho: any;
  nmFantasiaEmpresaTrabalho: any;
  telefoneComercial: any;
  idCidadeComercial: any;
  idBairroComercial: any;
  idRuaComercial: any;
  cepComercial: any;
  numeroComercial: any;
  complementoComercial: any;
  proximidadeComercial: any;
  ativa: string;
  log: string;
  infoAdicional: any;
}

export interface PersonContract {
  description: string;
  person: {
    name: string;
    email: string;
    zipcode: string;
    streetId: number | null;
    neighborhoodId: number | null;
    number: string;
    cityId: number | null;
    stateId: number | null;
    document: string;
    document_2: string;
    birthday: string;
  },
  dependents: {
    name: string;
    birthday: string;
    id: number;
  }[]
}

export interface Contract {
  is_company: boolean;
  colab_id: number | null;
  pre_contract: string;
  category_id: number | null;
  category_business_id: number | null;
  person_type: string;
  person_name: string;
  person_nickname: string;
  person_observation: string;
  gender: number;
  civil_state: number;
  observation: string;
  unity_consumer: string;
  dealership_id: number | null;
  phone_1: string | null;
  phone_2: string | null;
  cellphone: string | null;
  observation_phone_1: string | null;
  observation_phone_2: string | null;
  observation_cellphone: string | null;
  name: string | null;
  type: string | null;
  email: string | null;
  zipcode: string | null;
  complement: string | null;
  street_id: number;
  neighborhood_id: number;
  number: string | null;
  city_id: number;
  signature: string | null;
  created_at: string | null;
  sale_at: string | null;
  contract_at: string | null;
  document: string | null;
  document_2: string | null;
  company_fundation_at: string | null;
  mensality_price: string | null;
  due_contract_day: string | number | null;
  observation_remote: string | null;
  parents_address: string | null;
  father_name: string | null;
  mother_name: string | null;
  naturality_city: number | null;
  bankslip_installments_generated: string | null;
  bankslip_installments: number | null;
  membership_fee: number | null;
  account_holder_name: string | null;
  account_holder_type: string | null;
  account_document: string | null;
  account_document_2: string | null;
  action_registration: string | null;
  action_registration_send: string | null;
  installation_partner: string | null;
}
