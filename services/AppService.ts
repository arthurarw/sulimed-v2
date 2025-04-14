import { BusinessContract, IndividualContract } from '@/types/Database';
import { City, ContractBusinessCategories, ContractCategories, Neighborhood, Street } from '@/types/Ecard';
import { convertBrazilianDate, formatBrazilDate, formatBrazilDateTimeNew, formatBrazilTime } from '@/utils/String';
import axios, { AxiosInstance } from 'axios';

class AppApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://179.108.169.90:3366/ecard',
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

  public async storeBusinessContract(body: BusinessContract): Promise<number> {
    try {
      const payload = {
        "idContratoEmpresarial": null,
        "filial": 1,
        "ativo": "S",
        "idCategoriaContratoEmpresarial": body.category_business_id,
        "dtVenda": convertBrazilianDate(body.sale_at),
        "dtContrato": convertBrazilianDate(body.contract_at),
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
          "nmPessoa": body.name,
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
          "inscricaoEstadual": body.document_2,
          "dtFundacao": convertBrazilianDate(body.company_fundation_at),
          "celular": body.cellphone,
          "infoAdicional": null
        },
        "categorias": [
          {
            "idCategoriaContrato": body.category_id
          }
        ]
      }

      console.log('Body Store', payload);

      const { data } = await this.client.post('/insereContratoPj', payload);

      console.log('DATA BUSINESS', data);

      return data.idContratoEmpresarial;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async sendSignature(contractId: number, signature: string, isCompany: boolean = false): Promise<any> {
    try {
      const originDescription = isCompany ? 'ContratoEmpresarialEcard' : 'ContratoEcard';

      const { data } = await this.client.post('/insereImagem', {
        "idOrigem": contractId,
        "dsOrigem": originDescription,
        "tipoArquivo": "image/png",
        "imagem": signature,
        "descricao": `Imagem da assinatura do contrato ${contractId}`
      });

      console.log('DATA SIGNATURE', data);

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

  public async storeContract(body: IndividualContract): Promise<number> {
    try {
      const isCompany = body.person_type === "J";
      const isCreditCard = body.payment_method === "CC";
      const isBankSlip = body.payment_method === "B";

      const installmentsBankslip = () => {
        if (isBankSlip) {
          return body.bankslip_installments;
        }

        if (isCreditCard) {
          return 1;
        }

        return null
      }

      const installmentsBankslipGenerated = () => {
        if (isCreditCard || isBankSlip) {
          return "N";
        }

        return null;
      }

      let payload = {
        "idContrato": null,
        "filial": 1,
        "preContrato": body.pre_contract ?? 'A',
        "ativo": "S",
        "dtVenda": convertBrazilianDate(body.sale_at),
        "dtContrato": convertBrazilianDate(body.contract_at),
        "empresarial": "N",
        "idContratoEmpresarial": null,
        "observacao": body.observation,
        "telefone2": body.phone_2,
        "obsTelefone1": body.observation_phone_1,
        "obsTelefone2": body.observation_phone_2,
        "obsCelular": body.observation_cellphone,
        "sexo": body.gender,
        "estadoCivil": body.civil_state,
        "enderecoPaiMae": body.parents_address,
        "nmPai": body.father_name,
        "nmMae": body.mother_name,
        "idCidadeNaturalidade": body.naturality_city,
        "dtInsercao": formatBrazilTime(),
        "obsCadastroRemoto": body.observation_remote,
        "boleto": body.payment_method,
        "boletoParcelas": installmentsBankslip(),
        "valorTaxaAdesao": isCreditCard || isBankSlip ? body.membership_fee : null,
        "boletoParcelaGerada": installmentsBankslipGenerated(),
        "mensalista": isCreditCard || isBankSlip ? "N" : "S",
        "codigoConcessionaria": isCreditCard || isBankSlip ? null : body.dealership_id,
        "unidadeConsumidora": isCreditCard || isBankSlip ? null : body.unity_consumer,
        "titularDaConta": isCreditCard || isBankSlip ? null : body.account_holder_name,
        "tipoPessoaTitular": isCreditCard || isBankSlip ? null : "F",
        "cpfCnpjTitularConta": isCreditCard || isBankSlip ? null : body.account_document,
        "rgIeTitularConta": isCreditCard || isBankSlip ? null : body.account_document_2,
        "parceiroNegocioInstalacao": isCreditCard || isBankSlip ? null : body.installation_partner,
        "dtVencimentoConta": isCreditCard || isBankSlip ? null : convertBrazilianDate(body.due_account_date),
        "acaoCadastro": isCreditCard || isBankSlip ? null : "I",
        "acaoEnviada": isCreditCard || isBankSlip ? null : "N",
        "boletoPrimeiroVencimento": isBankSlip ? convertBrazilianDate(body.bankslip_due_date) : null,
        "nroCartao": body.card_number ?? null,
        "pessoa": {
          "idPessoa": null,
          "ativa": "S",
          "nmPessoa": body.name,
          "apelidoFantasia": body.person_nickname,
          "tipo": body.person_type,
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
          "cpf": !isCompany ? body.document : null,
          "cnpj": isCompany ? body.document : null,
          "inscricaoEstadual": isCompany ? body.document_2 : null,
          "dtFundacao": isCompany ? convertBrazilianDate(body.company_fundation_at) : null,
          "dtNascimento": !isCompany ? convertBrazilianDate(body.birthday) : null,
          "rg": !isCompany ? body.document_2 : null,
          "celular": body.cellphone,
          "sexo": body.gender,
          "infoAdicional": null
        },
        "categorias": [
          {
            "idCategoriaContrato": body.category_id,
            "valor": body.mensality_price,
          }
        ],
        "dependentes": body.dependents && body.dependents.length > 0 ? body.dependents.map(dependent => {
          return {
            "nmDependente": dependent.name,
            "idGrauParentesco": dependent.kinship_id,
            "dtNascimento": convertBrazilianDate(dependent.birthday),
          }
        }) : []
      }

      console.log('Body Store', payload);

      const { data } = await this.client.post('/insereContrato', payload);

      return data.idContrato;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new AppApi();
