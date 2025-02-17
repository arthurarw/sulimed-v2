import { Contract, ContractCustomerList, CustomerDatabase, LocalCategory, LocalCity } from "@/types/Database";
import { DATABASE_NAME } from "@/utils/Settings";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from 'date-fns/locale';
import * as SQLite from 'expo-sqlite';

class AppRepository {
  private db: any;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  public async store(data: Omit<CustomerDatabase, "id">) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO customers (name, email, phone, telephone, zipcode, street, neighborhood, city, state, number) VALUES ($name, $email, $phone, $telephone, $zipcode, $street,$neighborhood, $city, $state, $number)",
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $email: data.email,
        $phone: data.phone,
        $telephone: data.telephone ?? "",
        $zipcode: data.zipcode ?? "",
        $street: data.street ?? "",
        $neighborhood: data.neighborhood ?? "",
        $city: data.city ?? "",
        $state: data.state ?? "",
        $number: data.number ?? "",
        $sync: 1,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeBusinessContract(data: Omit<Contract, "id">) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO contracts (is_company, colab_id, pre_contract,category_id,person_type,person_name,person_nickname,person_observation,gender,civil_state,observation,unity_consumer,dealership_id,phone_1,phone_2,cellphone,observation_phone_1,observation_phone_2,observation_cellphone,name,type,email,phone,telephone,zipcode,street_id,neighborhood_id,number,city_id,signature,created_at,sale_at,contract_at,document,document_2,mensality_price,due_contract_day,observation_remote,parents_address,father_name,mother_name,naturality_city,bankslip_installments_generated,bankslip_installments,membership_fee,account_holder_name,account_holder_type,account_document,account_document_2,action_registration,action_registration_send,installation_partner) VALUES ($is_company, $colab_id, $pre_contract, $category_id, $person_type, $person_name, $person_nickname, $person_observation, $gender, $civil_state, $observation, $unity_consumer, $dealership_id, $phone_1, $phone_2, $cellphone, $observation_phone_1, $observation_phone_2, $observation_cellphone, $name, $type, $email, $phone, $telephone, $zipcode, $street_id, $neighborhood_id, $number, $city_id, $signature, $created_at, $sale_at, $contract_at, $document, $document_2, $mensality_price, $due_contract_day, $observation_remote, $parents_address, $father_name, $mother_name, $naturality_city, $bankslip_installments_generated, $bankslip_installments, $membership_fee, $account_holder_name, $account_holder_type, $account_document, $account_document_2, $action_registration, $action_registration_send, $installation_partner)"
    );

    try {
      const result = await statement.executeAsync({
        $is_company: true,
        $colab_id: data.colab_id ?? '',
        $father_name: data.father_name ?? '',
        $mother_name: data.mother_name ?? '',
        $observation: data.observation ?? '',
        $unity_consumer: data.unity_consumer ?? '',
        $phone_1: data.phone_1 ?? '',
        $phone_2: data.phone_2 ?? '',
        $observation_phone_1: data.observation_phone_1 ?? '',
        $observation_phone_2: data.observation_phone_2 ?? '',
        $name: data.name ?? '',
        $type: data.type ?? '',
        $email: data.email ?? '',
        $phone: data.phone ?? '',
        $telephone: data.telephone ?? '',
        $zipcode: data.zipcode ?? '',
        $street_id: data.street_id ?? '',
        $neighborhood_id: data.neighborhood_id ?? '',
        $number: data.number ?? '',
        $city_id: data.city_id ?? '',
        $created_at: formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
        $document: data.document ?? '',
        $document_2: data.document_2 ?? '',
        $sync: data.sync ?? true,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      console.log(insertedRowId);

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async setSyncConcluded(id: number) {
    const statement = await this.db.prepareAsync(
      "UPDATE customers SET sync = $sync WHERE id = $id",
    );

    try {
      await statement.executeAsync({
        $id: id,
        $sync: 0,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async remove(id: number) {
    try {
      await this.db.execAsync("DELETE FROM customers WHERE id = " + id);
    } catch (error) {
      throw error;
    }
  }

  public async fetchContract(id: number) {
    try {
      const result: Contract = await this.db.getFirstAsync('SELECT * FROM contracts WHERE id = ?', id);

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async fetchSyncCustomers() {
    try {
      const query = "SELECT * FROM customers WHERE sync = 1";
      const results: CustomerDatabase[] = await this.db.getAllAsync(query);

      console.log("XXX", results);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchContracts() {
    try {
      const query = "SELECT id, name, created_at, sync FROM contracts ORDER BY created_at DESC";
      const results: ContractCustomerList[] = await this.db.getAllAsync(query);

      console.log(results);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async syncContractsToServer() {
    try {
      const query = "SELECT * FROM contracts WHERE sync = 1";
      const results: Contract[] = await this.db.getAllAsync(query);

      // TODO: Implement the logic to sync the contracts with the server.
      if (!results) {
        return false;
      }

      for (const row of results) {
        console.log('HEHE', row);

        console.log('Deleting contract...');
        await this.db.execAsync(`DELETE FROM contracts WHERE id = ${row.id}`);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async syncToServer(customers: CustomerDatabase[]) {
    try {
      //const ids = customers.map((customer) => customer.id);

      customers.map(async (customer) => {
        // TODO: Implement the logic to sync the customers with the server.

        await this.setSyncConcluded(customer.id);
      });
    } catch (error) {
      throw error;
    }
  }

  public async fetchCities() {
    try {
      const query = "SELECT id, name FROM cities ORDER BY name ASC";
      const results: LocalCity[] = await this.db.getAllAsync(query);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchBusinessContracts() {
    try {
      const query = "SELECT id, description, price FROM contract_business_categories ORDER BY description ASC";
      const results: LocalCategory[] = await this.db.getAllAsync(query);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchStreets() {
    try {
      const query = "SELECT id, name FROM streets ORDER BY name ASC";
      const results: LocalCity[] = await this.db.getAllAsync(query);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchNeighborhoods() {
    try {
      const query = "SELECT id, name FROM neighborhoods ORDER BY name ASC";
      const results: LocalCity[] = await this.db.getAllAsync(query);

      return results;
    } catch (error) {
      throw error;
    }
  }
}

export const appRepository = new AppRepository();
