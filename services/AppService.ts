import { BusinessContract } from '@/types/Database';
import { City, Contract, ContractBusinessCategories, ContractCategories, Kinship, Neighborhood, PersonContract, Street } from '@/types/Ecard';
import { convertBrazilianDate, formatBrazilDate, formatBrazilTime } from '@/utils/String';
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


  public async storeBusinessContract(body: BusinessContract): Promise<number> {
    try {
      //const categoryContractId = JSON.parse(String(body.category_id)).value;
      //const categoryBusinessContractId = JSON.parse(String(body.category_business_id)).value;


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

  public async sendSignature(contractId: number, signature: string): Promise<any> {
    try {
      const { data } = await this.client.post('/insereImagem', {
        "idOrigem": contractId,
        "dsOrigem": "ecard_contrato",
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
}

export default new AppApi();
