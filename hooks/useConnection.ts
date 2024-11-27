import * as Network from "expo-network";

export const useConnection = () => {
  async function isConnected(): Promise<boolean> {
    const airplaneMode = await Network.isAirplaneModeEnabledAsync();
    if (airplaneMode) {
      return false;
    }

    const connection = await Network.getNetworkStateAsync();
    if (
      connection.isConnected === false ||
      connection.isInternetReachable === false
    ) {
      return false;
    }

    return true;
  }

  return { isConnected };
};
