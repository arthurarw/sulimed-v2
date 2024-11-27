import { CustomerDatabase } from "@/types/Database";
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
