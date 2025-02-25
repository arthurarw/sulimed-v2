import AppService from "@/services/AppService";
import { BusinessContract, Contract, ContractCustomerList, IndividualContract, LocalCategory, LocalCity, LocalDependents, LocalNeighborhood } from "@/types/Database";
import { CHUNK_SIZE, DATABASE_NAME } from "@/utils/Settings";
import { formatBrazilDate, formatBrazilTime } from "@/utils/String";
import * as SQLite from 'expo-sqlite';

class AppRepository {
  public async storeBusinessContract(data: Omit<BusinessContract, "id">) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
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

      return { insertedRowId };
    } catch (error) {
      console.log('Errouuuu', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeIndividualContract(data: Omit<BusinessContract, "id">) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
      "INSERT INTO contracts (is_company,category_id,mensality_price,colab_id,phone_1,phone_2,observation_phone_1,observation_phone_2,name,document,document_2,type,email,zipcode,street_id,neighborhood_id,number,city_id,created_at,sale_at,contract_at,person_nickname,person_type,company_fundation_at,observation_remote,sync,observation,father_name,mother_name,parents_address,naturality_city,birthday,dealership_id,gender,civil_state) VALUES ($is_company,$category_id,$mensality_price,$colab_id,$phone_1,$phone_2,$observation_phone_1,$observation_phone_2,$name,$document,$document_2,$type,$email,$zipcode,$street_id,$neighborhood_id,$number,$city_id,$created_at,$sale_at,$contract_at,$person_nickname,$person_type,$company_fundation_at,$observation_remote,$sync,$observation,$father_name,$mother_name,$parents_address,$naturality_city,$birthday,$dealership_id,$gender,$civil_state)"
    );

    try {
      const result = await statement.executeAsync({
        $is_company: false,
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
        $person_type: data.person_type ?? 'F',
        $company_fundation_at: data.company_fundation_at ?? '',
        $observation_remote: data.observation_remote ?? '',
        $sync: false,
        $observation: data.observation ?? '',
        $father_name: data.father_name ?? '',
        $mother_name: data.mother_name ?? '',
        $parents_address: data.parents_address ?? '',
        $naturality_city: data.naturality_city ?? '',
        $birthday: data.birthday ?? '',
        $dealership_id: data.dealership_id ?? '',
        $gender: data.gender ?? '',
        $civil_state: data.civil_state ?? '',
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      console.log('Errouuuu', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async setContractSyncConcluded(id: number) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
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
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      await db.execAsync(`DELETE FROM customers WHERE id = ${id}`);
    } catch (error) {
      throw error;
    }
  }

  public async fetchContract(id: number): Promise<Contract | null> {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const result: Contract | null = await db.getFirstAsync('SELECT * FROM contracts WHERE id = ?', id);

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async syncBusinessContracts(): Promise<boolean> {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const results: BusinessContract[] = await db.getAllAsync('SELECT * FROM contracts WHERE is_company = 1 AND id NOT IN (1,2) AND signature IS NOT NULL AND sync = 0');

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
            await AppService.sendSignature(contractId, contract.signature, true);
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
      await db.closeAsync();
    }
  }

  public async syncIndividualContracts(): Promise<boolean> {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      console.log('Syncing individual contracts...');
      const results: IndividualContract[] = await db.getAllAsync('SELECT * FROM contracts WHERE is_company = 0 AND signature IS NOT NULL AND sync = 0');

      if (!results || results.length === 0) {
        console.log('No individual contracts to sync.');
        return false;
      }

      for await (const contract of results) {
        console.log('Contract ID', contract.id);
        const dependents = await this.fetchDependents(contract.id);
        contract.dependents = dependents.length > 0 ? dependents : [];
      }

      results.map(async (contract) => {
        await AppService.storeContract(contract).then(async (contractId) => {
          console.log('Contract ID', contractId);

          if (!contractId) {
            throw new Error('Error while syncing contract.');
          }

          if (contract.signature) {
            await AppService.sendSignature(contractId, contract.signature, true);
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
      await db.closeAsync();
    }
  }

  public async fetchDependents(contractId: number): Promise<LocalDependents[]> {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      console.log('Fetching dependents...');
      const results: LocalDependents[] = await db.getAllAsync(`SELECT name, birthday, kinship_id FROM dependents WHERE contract_id = ${contractId}`);


      if (!results || results.length === 0) {
        return [];
      }

      return results;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await db.closeAsync();
    }
  }

  public async fetchContracts() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const query = "SELECT id, name, created_at, is_company, sync FROM contracts ORDER BY created_at DESC";
      const results: ContractCustomerList[] = await db.getAllAsync(query);

      console.log(results);

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchCities() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const query = "SELECT id, name FROM cities ORDER BY name ASC";
      const results: LocalCity[] = await db.getAllAsync(query);

      if (!results || results.length === 0) {
        await AppService.fetchCities().then(async (cities) => {
          for (let i = 0; i < cities.length; i += CHUNK_SIZE) {
            const chunk = cities.slice(i, i + CHUNK_SIZE);
            chunk.map(async (city) => {
              await this.storeCity(city.idCidade, city.nmCidade);
            });
          }
        });

        return await db.getAllAsync(query);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchCategoriesBusinessContracts() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const query = "SELECT id, description, price, max_colabs FROM contract_business_categories ORDER BY description ASC";
      const results: LocalCategory[] = await db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching business contracts from server...');
        await AppService.fetchBusinessCategories().then(async (categories) => {
          categories.map(async (category) => {
            await this.storeBusinessCategory(category.idCategoriaContratoEmpresarial, category.dsCategoriaContratoEmpresarial, category.valor, category.nroMaximoFuncionarios);
          });
        });

        return await db.getAllAsync(query);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchStreets() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const query = "SELECT id, name FROM streets ORDER BY name ASC";
      const results: LocalCity[] = await db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching streets from server...');
        await AppService.fetchStreets().then(async (streets) => {
          for (let i = 0; i < streets.length; i += CHUNK_SIZE) {
            const chunk = streets.slice(i, i + CHUNK_SIZE);
            chunk.map(async (street) => {
              await this.storeStreet(street.idRua, street.nmRua);
            });
          }
        });

        return await db.getAllAsync(query);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchNeighborhoods() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const query = "SELECT id, name FROM neighborhoods ORDER BY name ASC";
      const results: LocalNeighborhood[] = await db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching neighborhoods from server...');
        await AppService.fetchNeighborhoods().then(async (neighborhoods) => {
          for (let i = 0; i < neighborhoods.length; i += CHUNK_SIZE) {
            const chunk = neighborhoods.slice(i, i + CHUNK_SIZE);
            chunk.map(async (neighborhood) => {
              await this.storeNeighborhood(neighborhood.idBairro, neighborhood.nmBairro);
            });
          }
        });

        return await db.getAllAsync(query);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async fetchCategoriesContract() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      const query = "SELECT id, description, price FROM contract_categories ORDER BY description ASC";
      const results: Omit<LocalCategory[], "max_colabs"> = await db.getAllAsync(query);

      if (!results || results.length === 0) {
        console.log('Fetching contracts from server...');
        await AppService.fetchCategories().then(async (categories) => {
          categories.map(async (category) => {
            await this.storeCategory(category.idCategoriaContrato, category.dsCategoriaContrato, category.valor);
          });
        });

        return await db.getAllAsync(query);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  public async storeNeighborhood(id: number, name: string) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
      "INSERT INTO neighborhoods (id, name) VALUES ($id, $name)"
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $name: name
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeBusinessCategory(id: number, name: string, price: string, maxColabs: number) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
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

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeCity(id: number, name: string) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
      "INSERT INTO cities (id, name) VALUES ($id, $name)"
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $name: name
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeStreet(id: number, name: string) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
      "INSERT INTO streets (id, name) VALUES ($id, $name)"
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $name: name
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  public async storeCategory(id: number, name: string, price: string) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
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
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
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
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    try {
      console.log('Dropping tables...');
      await db.execAsync(`DROP TABLE IF EXISTS cities;`);
      await db.execAsync(`DROP TABLE IF EXISTS neighborhoods;`);
      await db.execAsync(`DROP TABLE IF EXISTS streets;`);
      await db.execAsync(`DROP TABLE IF EXISTS contract_business_categories;`);
      await db.execAsync(`DROP TABLE IF EXISTS contract_business_categories;`);

      console.log('Creating tables...');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS cities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS neighborhoods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS streets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_business_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL,
          max_colabs INTEGER NULL DEFAULT 0
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS contract_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          price NUMERIC NOT NULL,
          description TEXT NOT NULL
        );
      `);


      console.log('Inserting Cities...');
      await this.fetchCities();

      console.log('Inserting Streets...');
      await this.fetchStreets();

      console.log('Inserting Neighborhoods...');
      await this.fetchNeighborhoods();

      console.log('Inserting Business Categories...');
      await this.fetchCategoriesBusinessContracts();

      console.log('Inserting categories...');
      await this.fetchCategoriesContract();

      return;
    } catch (error) {
      throw error;
    }
  }

  public fetchKinships() {
    const data = [
      {
        "idGrauParentesco": 1,
        "dsGrauParentesco": "FILHO(A)"
      },
      {
        "idGrauParentesco": 2,
        "dsGrauParentesco": "ESPOSO(A)"
      },
      {
        "idGrauParentesco": 3,
        "dsGrauParentesco": "AVÔ(Ó)"
      },
      {
        "idGrauParentesco": 4,
        "dsGrauParentesco": "MÃE / PAI"
      },
      {
        "idGrauParentesco": 5,
        "dsGrauParentesco": "TIO(A)"
      },
      {
        "idGrauParentesco": 6,
        "dsGrauParentesco": "SOGRO(A)"
      },
      {
        "idGrauParentesco": 7,
        "dsGrauParentesco": "OUTROS"
      },
      {
        "idGrauParentesco": 8,
        "dsGrauParentesco": "IRMÃ(O)"
      },
      {
        "idGrauParentesco": 9,
        "dsGrauParentesco": "GENRO/NORA"
      },
      {
        "idGrauParentesco": 10,
        "dsGrauParentesco": "ENTEADO(A)"
      },
      {
        "idGrauParentesco": 11,
        "dsGrauParentesco": "NETO(A)"
      },
      {
        "idGrauParentesco": 12,
        "dsGrauParentesco": "PRIMO (A)"
      },
      {
        "idGrauParentesco": 13,
        "dsGrauParentesco": "SOBRINHO (A)"
      },
      {
        "idGrauParentesco": 14,
        "dsGrauParentesco": "NAMORADO (A)"
      },
      {
        "idGrauParentesco": 15,
        "dsGrauParentesco": "PADASTRO / MADASTRA"
      },
      {
        "idGrauParentesco": 17,
        "dsGrauParentesco": "CUNHADO (A)"
      }
    ];

    return data.map((kinship) => {
      return {
        id: kinship.idGrauParentesco,
        label: kinship.dsGrauParentesco
      }
    })
  }

  public async storeDependents(contractId: number, name: string, birthday: string, kinshipId: number) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true
    });

    const statement = await db.prepareAsync(
      "INSERT INTO dependents (contract_id,name,birthday,kinship_id) VALUES ($contract_id,$name,$birthday,$kinship_id)"
    );

    try {
      const result = await statement.executeAsync({
        $contract_id: contractId,
        $name: name,
        $birthday: birthday,
        $kinship_id: kinshipId
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }
}

export const appRepository = new AppRepository();
