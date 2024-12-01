export const checkIfWalletIsConnected = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      console.log('Please install MetaMask!');
      return null;
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length !== 0) {
      return accounts[0];
    }

    return null;
  } catch (error) {
    console.error('Error checking if wallet is connected:', error);
    return null;
  }
};

export const listenToAccountChanges = (callback: (accounts: string[]) => void) => {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', callback);
  return () => window.ethereum.removeListener('accountsChanged', callback);
};

export const listenToChainChanges = (callback: (chainId: string) => void) => {
  if (!window.ethereum) return;

  window.ethereum.on('chainChanged', callback);
  return () => window.ethereum.removeListener('chainChanged', callback);
};