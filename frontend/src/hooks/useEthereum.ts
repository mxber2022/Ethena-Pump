import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { TOKEN_FACTORY_ABI, TOKEN_FACTORY_ADDRESS, USDE_ADDRESS, USDE_ABI } from '../contracts/types';
import { checkIfWalletIsConnected, listenToAccountChanges, listenToChainChanges } from '../utils/ethereum';
import toast from 'react-hot-toast';

export function useEthereum() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [usdeContract, setUsdeContract] = useState<ethers.Contract | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const initializeContracts = useCallback(async (provider: ethers.providers.Web3Provider) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, signer);
    const usdeContract = new ethers.Contract(USDE_ADDRESS, USDE_ABI, signer);
    
    setProvider(provider);
    setSigner(signer);
    setContract(contract);
    setUsdeContract(usdeContract);
  }, []);

  useEffect(() => {
    const init = async () => {
      const connectedAddress = await checkIfWalletIsConnected();
      if (connectedAddress && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await initializeContracts(provider);
        setAddress(connectedAddress);
      }
    };

    init();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const unsubscribeAccounts = listenToAccountChanges(handleAccountsChanged);
    const unsubscribeChain = listenToChainChanges(handleChainChanged);

    return () => {
      if (unsubscribeAccounts) unsubscribeAccounts();
      if (unsubscribeChain) unsubscribeChain();
    };
  }, [initializeContracts]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      await initializeContracts(provider);
      setAddress(address);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setUsdeContract(null);
    setAddress('');
  };

  const approveUsde = async (amount: ethers.BigNumber): Promise<boolean> => {
    if (!usdeContract || !contract) return false;

    try {
      const allowance = await usdeContract.allowance(address, contract.address);
      if (allowance.gte(amount)) return true;

      const tx = await usdeContract.approve(contract.address, amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error approving USDE:', error);
      throw error;
    }
  };

  return {
    provider,
    signer,
    contract,
    usdeContract,
    address,
    isConnecting,
    connectWallet,
    disconnectWallet,
    approveUsde
  };
}