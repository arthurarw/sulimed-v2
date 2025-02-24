import { BusinessContract } from '@/types/Database';
import { City, Contract, ContractBusinessCategories, ContractCategories, Kinship, Neighborhood, PersonContract, Street } from '@/types/Ecard';
import { formatBrazilDate, formatBrazilTime } from '@/utils/String';
import axios, { AxiosInstance } from 'axios';

class AppApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://179.108.169.90:8088/ecard',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  public async fetchCities(): Promise<City[]> {
    try {
      const { data } = await this.client.get('/cidade');

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async fetchStreets(): Promise<Street[]> {
    try {
      const { data } = await this.client.get('/rua');

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  public async fetchNeighborhoods(): Promise<Neighborhood[]> {
    try {
      const { data } = await this.client.get('/bairro');

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async fetchKinships(): Promise<Kinship[]> {
    try {
      const { data } = await this.client.get('/parentesco');

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async storePersonContract(body: PersonContract): Promise<any> {
    try {
      const { data } = await this.client.post('/insereContrato', {
        "idContrato": null,
        "idPessoa": null,
        "filial": 1,
        "preContrato": "N",
        "ativo": "N",
        "dtVenda": formatBrazilDate(),
        "dtContrato": formatBrazilDate(),
        "dtAlteracao": formatBrazilDate(),
        "nroCartao": "00000",
        "mensalista": "N",
        "boleto": null,
        "permuta": "N",
        "empresarial": "S",
        "observacao": body.description,
        "telefone2": body.person.phone,
        "obsTelefone1": "",
        "obsTelefone2": "",
        "obsCelular": "",
        "casaPropria": "S",
        "sexo": 0,
        "estadoCivil": 1,
        "enderecoPaiMae": "",
        "nmPai": "",
        "nmMae": "",
        "idCidadeNaturalidade": null,
        "idUsuarioIncluiu": null,
        "idUsuarioAlterou": null,
        "idOptanteCentercob": null,
        "idOptanteCelesc": null,
        "titularDaConta": null,
        "tipoPessoaTitular": null,
        "cpfCnpjTitularConta": null,
        "rgIeTitularConta": null,
        "codigoConcessionaria": null,
        "parceiroNegocioInstalacao": null,
        "unidadeConsumidora": null,
        "dtVencimentoConta": null,
        "dtLeituraConta": null,
        "energiaPrimeiroVencimento": null,
        "acaoCadastro": null,
        "acaoEnviada": "N",
        "idRemessaCentercob": null,
        "idFuncionario": null,
        "valorComissao": null,
        "boletoParcelas": null,
        "boletoPrimeiroVencimento": null,
        "boletoParcelaGerada": "N",
        "idContratoEmpresarial": null,
        "dtInsercao": formatBrazilTime(),
        "dtUltimaAlteracao": formatBrazilTime(),
        "historicoSistema": null,
        "md5": null,
        "dataCancelamentoContrato": null,
        "dataEncerramentoContratoBoleto": null,
        "tipoPagamentoContrato": null,
        "valorTaxaAdesao": "0.00",
        "tags": null,
        "numerosCartao": null,
        "vencimentoMes": null,
        "vencimentoAno": null,
        "vencimentoFatura": null,
        "cpfTitular": null,
        "titularCartao": null,
        "bandeiraCartao": null,
        "codigoVendedorCenterCob": null,
        "codigoCidadeNFSe": null,
        "proximoLancamentoNFSe": null,
        "nfseEmitida": "N",
        "pessoa": {
          "idPessoa": null,
          "nmPessoa": body.person.name,
          "apelidoFantasia": "",
          "tipo": "F",
          "cep": body.person.zipcode,
          "numero": body.person.number,
          "complemento": "",
          "proximidade": "",
          "idCidade": body.person.cityId,
          "idBairro": body.person.neighborhoodId,
          "idRua": body.person.streetId,
          "telefone": body.person.telephone,
          "email": "",
          "dtCadastro": formatBrazilDate(),
          "observacao": body.description,
          "cpf": body.person.document,
          "dtNascimento": body.person.birthday,
          "rg": "",
          "celular": body.person.phone,
          "cnpj": "",
          "dtFundacao": null,
          "inscricaoEstadual": null,
          "indicadorIeDestinatario": null,
          "regimeTributario": null,
          "empresaTrabalho": null,
          "nmFantasiaEmpresaTrabalho": null,
          "telefoneComercial": null,
          "idCidadeComercial": null,
          "idBairroComercial": null,
          "idRuaComercial": null,
          "cepComercial": null,
          "numeroComercial": null,
          "complementoComercial": null,
          "proximidadeComercial": null,
          "ativa": "S",
          "sexo": null,
          "log": null,
          "infoAdicional": null
        },
        "dependentes": body.dependents.length === 0 ? [] : body.dependents.map(dependent => ({
          "idContratoDependente": null,
          "idContrato": null,
          "nmDependente": dependent.name,
          "dtNascimento": dependent.birthday,
          "idGrauParentesco": dependent.id
        }))
      });

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async storeBusinessContract(body: BusinessContract): Promise<number> {
    try {
      const { data } = await this.client.post('/insereContratoPj', {
        "idContratoEmpresarial": null,
        "filial": 1,
        "ativo": "S",
        "idCategoriaContratoEmpresarial": body.category_business_id,
        "dtVenda": body.sale_at,
        "dtContrato": body.created_at,
        "observacao": body.observation,
        "telefone2": body.phone_2,
        "obsTelefone1": body.observation_phone_1,
        "obsTelefone2": body.observation_phone_2,
        "obsCelular": body.observation_cellphone,
        "idFuncionario": body.colab_id,
        "valorMensalidade": body.mensality_price,
        "diaVencimento": body.due_contract_day,
        "obsCadastroRemoto": body.observation_remote,
        "pessoa": {
          "idPessoa": null,
          "ativa": "S",
          "nmPessoa": body.person_name,
          "apelidoFantasia": body.person_nickname,
          "tipo": "J",
          "cep": body.zipcode,
          "numero": body.number,
          "complemento": body.complement,
          "proximidade": null,
          "idCidade": body.city_id,
          "idBairro": body.neighborhood_id,
          "idRua": body.street_id,
          "telefone": body.phone_1,
          "email": body.email,
          "dtCadastro": body.created_at,
          "observacao": body.person_observation,
          "cnpj": body.document,
          "dtFundacao": body.company_fundation_at,
          "celular": body.cellphone,
          "infoAdicional": null
        },
        "categorias": [
          {
            "idCategoriaContrato": body.category_id
          }
        ]
      });

      return 123;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async sendSignature(contractId: number, signature: string): Promise<any> {
    try {
      const { data } = await this.client.post('/insereImagem', {
        "idOrigem": contractId,
        "dsOrigem": "ecard_contrato",
        "tipoArquivo": "image/png",
        "imagem": signature,
        "descricao": `Imagem da assinatura do contrato ${contractId}`
      });

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async fetchCategories(): Promise<ContractCategories[]> {
    try {
      const { data } = await this.client.get('/categoriaContrato');

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  public async fetchBusinessCategories(): Promise<ContractBusinessCategories[]> {
    try {
      const { data } = await this.client.get('/categoriaContrato_pj');

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new AppApi();
