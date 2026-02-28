import { uploadToIPFS } from '../utils/ipfs';
import algosdk from 'algosdk';

// Algod Client Setup
const algodClient = new algosdk.Algodv2("", import.meta.env.VITE_ALGO_NODE_URL, "");

const handleMint = async (studentAddr, assetName, file) => {
    // 1. Upload to IPFS
    const ipfsUrl = await uploadToIPFS(file, assetName);
    
    // 2. Call our Smart Contract (App ID: 756315437)
    // Humne backend mein 'mint_certificate' method banaya tha
    // Nishchay, yahan hum Atomic Transaction Composer use karenge
    console.log("Minting with Metadata:", ipfsUrl);
    
    // DTU Judges Point: Humein default-frozen=true ensure karna hai 
    // taaki ye 'Soulbound' rahe.
};