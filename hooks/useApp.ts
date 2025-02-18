import { appRepository } from "@/repositories/AppRepository";
import { LocalCategory, LocalCity, LocalNeighborhood, LocalStreet } from "@/types/Database";

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

  async function fetchStreets(): Promise<LocalStreet[]> {
    try {
      return await appRepository.fetchStreets();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchNeighborhoods(): Promise<LocalNeighborhood[]> {
    try {
      return await appRepository.fetchNeighborhoods();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchKinships() {
    try {
      return await appRepository.fetchNeighborhoods();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  return { fetchCities, fetchBusinessContracts, fetchStreets, fetchNeighborhoods };
};
