import { Contract, ContractCustomerList, CustomerDatabase } from "@/types/Database";
import * as SQLite from 'expo-sqlite';

class AppRepository {
  private db: any;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    this.db = await SQLite.openDatabaseAsync("sulimed.db");
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

  public async storeContract(data: Omit<Contract, "id">) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO contracts (is_company, fathers_name, mothers_name, observation, unity_consumer, phone_1, phone_2, observation_phone_1, observation_phone_2, name, type, email, phone, telephone, zipcode, street, neighborhood, number, city, state, signature, created_at, document, document_2, external_id, sync) VALUES ($is_company, $fathers_name, $mothers_name, $observation, $unity_consumer, $phone_1, $phone_2, $observation_phone_1, $observation_phone_2, $name, $type, $email, $phone, $telephone, $zipcode, $street, $neighborhood, $number, $city, $state, $signature, $created_at, $document, $document_2, $external_id, $sync)",
    );

    try {
      const result = await statement.executeAsync({
        $is_company: data.is_company ?? '',
        $fathers_name: data.fathers_name ?? '',
        $mothers_name: data.mothers_name ?? '',
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
        $street: data.street ?? '',
        $neighborhood: data.neighborhood ?? '',
        $number: data.number ?? '',
        $city: data.city ?? '',
        $state: data.state ?? '',
        $signature: data.signature ?? '',
        $created_at: data.created_at ?? '',
        $document: data.document ?? '',
        $document_2: data.document_2 ?? '',
        $external_id: data.external_id ?? '',
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
}

export const appRepository = new AppRepository();
