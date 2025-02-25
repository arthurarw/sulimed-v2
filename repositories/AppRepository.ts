import AppService from "@/services/AppService";
import { BusinessContract, Contract, ContractCustomerList, LocalCategory, LocalCity, LocalKinship, LocalNeighborhood } from "@/types/Database";
import { DATABASE_NAME } from "@/utils/Settings";
import { formatBrazilDate, formatBrazilTime } from "@/utils/String";
import * as SQLite from 'expo-sqlite';

class AppRepository {
  private db: any;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });
  }

  public async storeBusinessContract(data: Omit<BusinessContract, "id">) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO contracts (is_company,category_business_id,category_id,mensality_price,colab_id,phone_1,phone_2,observation_phone_1,observation_phone_2,name,document,document_2, type,email,zipcode,street_id,neighborhood_id,number,city_id,created_at,sale_at,contract_at,person_nickname,person_type,company_fundation_at,due_contract_day,observation_remote,sync, observation) VALUES ($is_company,$category_business_id,$category_id,$mensality_price,$colab_id,$phone_1,$phone_2,$observation_phone_1,$observation_phone_2,$name,$document,$document_2,$type,$email,$zipcode,$street_id,$neighborhood_id,$number,$city_id,$created_at,$sale_at,$contract_at,$person_nickname,$person_type,$company_fundation_at,$due_contract_day,$observation_remote,$sync,$observation)"
    );

    try {
      const result = await statement.executeAsync({
        $is_company: true,
        $category_business_id: data.category_business_id ?? '',
        $category_id: data.category_id ?? '',
        $mensality_price: data.mensality_price ?? '',
        $colab_id: data.colab_id ?? '',
        $phone_1: data.phone_1 ?? '',
        $phone_2: data.phone_2 ?? '',
        $observation_phone_1: data.observation_phone_1 ?? '',
        $observation_phone_2: data.observation_phone_2 ?? '',
        $name: data.name ?? '',
        $document: data.document ?? '',
        $document_2: data.document_2 ?? '',
        $type: data.person_type ?? 'J',
        $email: data.email ?? '',
        $zipcode: data.zipcode ?? '',
        $street_id: data.street_id ?? '',
        $neighborhood_id: data.neighborhood_id ?? '',
        $number: data.number ?? '',
        $city_id: data.city_id ?? '',
        $created_at: formatBrazilDate(),
        $sale_at: data.sale_at ?? '',
        $contract_at: data.contract_at ?? '',
        $person_nickname: data.person_nickname ?? '',
        $person_type: data.person_type ?? 'J',
        $company_fundation_at: data.company_fundation_at ?? '',
        $due_contract_day: data.due_contract_day ?? '',
        $observation_remote: data.observation_remote ?? '',
        $sync: false,
        $observation: data.observation ?? '',
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      console.log(insertedRowId);

      return { insertedRowId };
    } catch (error) {
      console.log('Errouuuu', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async setContractSyncConcluded(id: number) {
    const statement = await this.db.prepareAsync(
      "UPDATE contracts SET sync = $sync, sync_at = $sync_at WHERE id = $id",
    );

    try {
      await statement.executeAsync({
        $id: id,
        $sync: true,
        $sync_at: formatBrazilTime(),
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

  public async fetchContract(id: number): Promise<Contract | null> {
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

  public async syncBusinessContracts(): Promise<boolean> {
    try {
      const results: BusinessContract[] = await this.db.getAllAsync('SELECT * FROM contracts WHERE is_company = 1 AND id NOT IN (1,2) AND signature IS NOT NULL AND sync = 0');
      console.log('Results', results);

      if (!results || results.length === 0) {
        console.log('No contracts to sync.');
        return false;
      }

      results.map(async (contract) => {
        await AppService.storeBusinessContract(contract).then(async (contractId) => {
          console.log('Contract ID', contractId);

          if (!contractId) {
            throw new Error('Error while syncing contract.');
          }

          if (contract.signature) {
            await AppService.sendSignature(contractId, contract.signature);
          }

          await this.setContractSyncConcluded(contract.id);
        }).catch((error) => {
          console.log('ERROR', error);
        });
      });

      return true;
    } catch (error) {
      throw error;
    } finally {
      await this.db.closeAsync();
    }
  }

  public async fetchContracts() {
    try {
      const query = "SELECT id, name, created_at, is_company, sync FROM contracts ORDER BY created_at DESC";
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

  public async fetchCities() {
    try {
      const query = "SELECT id, name FROM cities ORDER BY name ASC";
      const results: LocalCity[] = await this.db.getAllAsync(query);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchCategoriesBusinessContracts() {
    try {
      const query = "SELECT id, description, price, max_colabs FROM contract_business_categories ORDER BY description ASC";
      const results: LocalCategory[] = await this.db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching business contracts from server...');
        await AppService.fetchBusinessCategories().then(async (categories) => {
          categories.map(async (category) => {
            await this.storeBusinessCategory(category.idCategoriaContratoEmpresarial, category.dsCategoriaContratoEmpresarial, category.valor, category.nroMaximoFuncionarios);
            console.log('Categoria Empresarial inserida: ', category.idCategoriaContratoEmpresarial);
          });
        });

        return await this.db.getAllAsync(query);
      }

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
      const results: LocalNeighborhood[] = await this.db.getAllAsync(query);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchCategoriesContract() {
    try {
      const query = "SELECT id, description, price FROM contract_categories ORDER BY description ASC";
      const results: Omit<LocalCategory[], "max_colabs"> = await this.db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching contracts from server...');
        await AppService.fetchCategories().then(async (categories) => {
          categories.map(async (category) => {
            await this.storeCategory(category.idCategoriaContrato, category.dsCategoriaContrato, category.valor);
            console.log('Categoria inserida: ', category.idCategoriaContrato);
          });
        });

        return await this.db.getAllAsync(query);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchKinships() {
    try {
      const query = "SELECT id, name FROM kinships ORDER BY name ASC";
      const results: LocalKinship[] = await this.db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching kinships from server...');
        await AppService.fetchKinships().then(async (kinships) => {
          kinships.map(async (kinship) => {
            await this.db.execAsync(`INSERT INTO kinships (id, name) VALUES ('${kinship.idGrauParentesco}', '${kinship.dsGrauParentesco}')`);
          });
        });
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async storeNeighborhood(id: number, name: string) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO neighborhoods (id, name) VALUES ($id, $name)"
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $name: name
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      console.log('Bairro inserido: ', insertedRowId);

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }


  public async storeBusinessCategory(id: number, name: string, price: string, maxColabs: number) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO contract_business_categories (id, description, price, max_colabs) VALUES ($id, $description, $price, $max_colabs)"
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $description: name,
        $price: price,
        $max_colabs: maxColabs
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      console.log('Categoria Empresarial inserida: ', insertedRowId);

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeCategory(id: number, name: string, price: string) {
    const statement = await this.db.prepareAsync(
      "INSERT INTO contract_categories (id, description, price) VALUES ($id, $description, $price)"
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $description: name,
        $price: price
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      console.log('Categoria inserida: ', insertedRowId);

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async setSignature(contractId: number, signature: string) {
    const statement = await this.db.prepareAsync(
      "UPDATE contracts SET signature = $signature WHERE id = $id",
    );

    try {
      await statement.executeAsync({
        $id: contractId,
        $signature: signature,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async syncTablesToServer() {
    try {
      console.log('Dropping tables...');
      await this.db.execAsync(`DROP TABLE IF EXISTS cities;`);
      await this.db.execAsync(`DROP TABLE IF EXISTS neighborhoods;`);
      await this.db.execAsync(`DROP TABLE IF EXISTS streets;`);
      await this.db.execAsync(`DROP TABLE IF EXISTS contract_business_categories;`);
      await this.db.execAsync(`DROP TABLE IF EXISTS contract_business_categories;`);

      console.log('Creating tables...');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS cities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS neighborhoods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS streets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_business_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL,
          max_colabs INTEGER NULL DEFAULT 0
        );
      `);

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL
        );
      `);


      console.log('Inserting values...');
      await AppService.fetchCities().then(async (cities) => {
        cities.map(async (city) => {
          await this.db.execAsync(`INSERT INTO cities (id, name) VALUES ('${city.idCidade}', '${city.nmCidade}')`);
        });
      });

      await AppService.fetchStreets().then(async (streets) => {
        streets.map(async (street) => {
          await this.db.execAsync(`INSERT INTO streets (id, name) VALUES ('${street.idRua}', '${street.nmRua}')`);
        });
      });

      await AppService.fetchNeighborhoods().then(async (neighborhoods) => {
        for await (const neighborhood of neighborhoods) {
          await this.storeNeighborhood(neighborhood.idBairro, neighborhood.nmBairro);
        }
      }).catch((error) => {
        console.log('ERROR', error);
      });

      await this.fetchCategoriesBusinessContracts();

      await this.fetchCategoriesContract();

      return;
    } catch (error) {
      throw error;
    }
  }
}

export const appRepository = new AppRepository();
