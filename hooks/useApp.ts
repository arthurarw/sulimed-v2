import { appRepository } from "@/repositories/AppRepository";
import { LocalCategory, LocalCity } from "@/types/Database";

export const useApp = () => {
  async function fetchCities(): Promise<LocalCity[]> {
    try {
      return await appRepository.fetchCities();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchBusinessContracts(): Promise<LocalCategory[]> {
    try {
      return await appRepository.fetchBusinessContracts();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  return { fetchCities, fetchBusinessContracts };
};
