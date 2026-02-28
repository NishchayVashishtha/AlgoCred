import algosdk from 'algosdk';

export const optInToSBT = async (studentAddr, assetId, peraWallet) => {
    const algodClient = new algosdk.Algodv2("", import.meta.env.VITE_ALGO_NODE_URL, "");
    const params = await algodClient.getTransactionParams().do();

    // Opt-in is just a 0-amount transfer of the asset to yourself
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: studentAddr,
        to: studentAddr,
        assetIndex: assetId,
        amount: 0,
        suggestedParams: params,
    });

    const singleTxn = [{ txn: txn, signers: [studentAddr] }];
    const signedTxn = await peraWallet.signTransaction([singleTxn]);
    await algodClient.sendRawTransaction(signedTxn).do();
    
    return "Opt-in Successful! Student can now receive the SBT.";
};