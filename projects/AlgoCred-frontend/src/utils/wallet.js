import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export const handleConnectWallet = async (setAddress) => {
  try {
    const newAccounts = await peraWallet.connect();
    setAddress(newAccounts[0]);
    
    // Disconnect listener
    peraWallet.setOnDisconnected(() => {
      setAddress(null);
      console.log("Wallet Disconnected");
    });
  } catch (error) {
    if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
      console.error("Wallet Connection Error:", error);
    }
  }
};

export const handleReconnectWallet = (setAddress) => {
  peraWallet.reconnectSession().then((accounts) => {
    if (accounts.length > 0) {
      setAddress(accounts[0]);
    }
  });
};