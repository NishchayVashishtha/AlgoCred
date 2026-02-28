import algosdk from 'algosdk';
import { uploadToIPFS } from './ipfs';


// Environment variables se details uthao
const app_id = parseInt(import.meta.env.VITE_ALGO_APP_ID);
const algodClient = new algosdk.Algodv2("", import.meta.env.VITE_ALGO_NODE_URL, "");

export const mintSBT = async (adminAddr, studentAddr, file, assetName) => {
    try {
        // 1. Pehle certificate ko IPFS par chadhate hain
        const ipfsUrl = await uploadToIPFS(file, assetName);
        
        // 2. Transaction parameters setup karte hain
        const params = await algodClient.getTransactionParams().do();
        
        // TODO: Yahan tumhara asali smart contract call aayega 
        // Jo humne AlgoKit se deploy kiya tha (App ID: 756315437)
        
        console.log(`🚀 Minting SBT for ${studentAddr} with Metadata: ${ipfsUrl}`);
        
        // Testing ke liye success return kar rahe hain
        return { success: true, assetId: Math.floor(Math.random() * 1000000) };
    } catch (error) {
        console.error("❌ Minting Error:", error);
        throw error;
    }
};