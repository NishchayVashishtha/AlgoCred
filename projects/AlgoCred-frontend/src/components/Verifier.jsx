import algosdk from 'algosdk';

// Hum Direct Node aur Indexer dono use karenge
const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
const indexerClient = new algosdk.Indexer("", import.meta.env.VITE_ALGO_INDEXER_URL || "https://testnet-idx.algonode.cloud", "");

export const verifyCertificate = async (assetId) => {
    try {
        const id = parseInt(assetId);
        
        // Step A: Instant check via Direct Node (Algod) - Ye turant result dega
        const assetInfo = await algodClient.getAssetByID(id).do();
        const params = assetInfo.params;

        return {
            valid: true,
            name: params.name,
            url: params.url,
            isSoulbound: params["default-frozen"] === true,
            issuedBy: params["creator"]
        };
    } catch (nodeError) {
        console.warn("Node se nahi mila, Indexer check kar rahe hain...");
        
        try {
            // Step B: Fallback to Indexer (agar network issue ho)
            const indexerInfo = await indexerClient.lookupAssetByID(assetId).do();
            const iParams = indexerInfo.asset.params;
            return {
                valid: true,
                name: iParams.name,
                url: iParams.url,
                isSoulbound: iParams["default-frozen"] === true,
                issuedBy: iParams["creator"]
            };
        } catch (indexerError) {
            console.error("Verification failed on both ends.");
            return { valid: false };
        }
    }
};