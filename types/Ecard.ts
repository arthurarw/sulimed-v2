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

export interface Kinship {
  idGrauParentesco: number;
  dsGrauParentesco: string;
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
    phone: string;
    telephone: string;
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
