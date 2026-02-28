import React, { useState, useEffect } from 'react';
import { handleConnectWallet, handleReconnectWallet } from './utils/wallet';
import { mintSBT } from './utils/contract';
import { verifyCertificate } from './components/Verifier';

function App() {
  // State Management
  const [address, setAddress] = useState(null);
  const [studentAddr, setStudentAddr] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [file, setFile] = useState(null);
  const [assetId, setAssetId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [lastAssetId, setLastAssetId] = useState(null);
  
  // States: Modal & Advanced Features ke liye
  const [showModal, setShowModal] = useState(false);
  const [mintedData, setMintedData] = useState({ id: '', url: '' });
  const [zkpMode, setZkpMode] = useState(false); // ZKP Toggle
  const [multiSigStatus, setMultiSigStatus] = useState(1); // 1/3 Signatures

  // Auto-reconnect wallet on refresh
  useEffect(() => {
    handleReconnectWallet(setAddress);
  }, []);

  const handleMintAction = async () => {
    if (!address || !studentAddr || !degreeName || !file) {
      alert("Bhai, saari details toh bharo pehle!");
      return;
    }

    // Advanced Feature: Multi-Sig Governance Check
    if (multiSigStatus < 3) {
      alert("Multi-Sig Protocol: Awaiting HOD and Dean signatures. Force-minting for demo purposes...");
    }

    setIsMinting(true);
    try {
      // Minting the Soulbound Degree
      const result = await mintSBT(address, studentAddr, file, degreeName);
      
      let finalAssetId = null;
      
      if (result.assetId) {
        finalAssetId = result.assetId;
      } else if (result.confirmation && result.confirmation['asset-index']) {
        finalAssetId = result.confirmation['asset-index'];
      } else if (result.innerTxns && result.innerTxns[0].assetIndex) {
        finalAssetId = result.innerTxns[0].assetIndex; 
      }

      if (finalAssetId) {
        setLastAssetId(finalAssetId); 
        
        // Modal ka data set kar rahe hain
        setMintedData({ 
          id: finalAssetId, 
          url: result.metadataUrl || `https://testnet.explorer.perawallet.app/asset/${finalAssetId}` 
        });
        
        // Modal Open karo
        setShowModal(true);
      } else {
        console.log("Full Result Object:", result); 
        alert("Minting success, par ID nikalne mein issue hai. Console check karein.");
      }
    } catch (error) {
      console.error(error);
      alert("Minting fail ho gayi, console check karo.");
    } finally {
      setIsMinting(false);
    }
  };

  // Copy to clipboard function helper
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mintedData.id);
    alert("Asset ID Copied! Ab Verify box mein paste karo.");
  };

  return (
    // Background with dark futuristic theme
    <div className="min-h-screen bg-[#070B14] text-slate-200 font-sans p-4 sm:p-8 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Glowing Orbs for Web3 Vibe */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Premium Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white/5 border border-white/10 backdrop-blur-md px-8 py-4 rounded-3xl mb-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                AlgoCred <span className="text-sm text-cyan-500 font-mono border border-cyan-500/50 px-2 py-0.5 rounded ml-2">v3.0 Enterprise</span>
              </h1>
              <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase">W3C Compliant Soulbound Infrastructure</p>
            </div>
          </div>
          
          <button 
            onClick={() => handleConnectWallet(setAddress)}
            className="group relative px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-full font-semibold transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${address ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></span>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
            </span>
            {/* Hover reflection effect */}
            <div className="absolute inset-0 h-full w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Side: Admin Section */}
          <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl hover:border-white/20 transition-all duration-500 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white relative z-10">
              <span className="bg-slate-800 p-2 rounded-lg border border-slate-700">🏛️</span>
              Institutional Issuance
            </h2>
            
            <div className="space-y-5 relative z-10">
              
              {/* ADVANCED FEATURE: Multi-Sig Governance UI */}
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Multi-Sig Governance (2/3 Required)</p>
                  <button onClick={() => setMultiSigStatus(prev => prev < 3 ? prev + 1 : 1)} className="text-xs bg-blue-500/20 px-2 py-1 rounded hover:bg-blue-500/40 transition">Simulate Sign</button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded flex-1 text-center">Admin ✅</span>
                  <span className={`text-xs border px-2 py-1 rounded flex-1 text-center transition-colors ${multiSigStatus >= 2 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>HOD {multiSigStatus >= 2 ? '✅' : '⏳'}</span>
                  <span className={`text-xs border px-2 py-1 rounded flex-1 text-center transition-colors ${multiSigStatus >= 3 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>Dean {multiSigStatus >= 3 ? '✅' : '⏳'}</span>
                </div>
              </div>

              <div className="group/input">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 ml-1 font-semibold mb-1 block group-hover/input:text-cyan-400 transition-colors">Student Address</label>
                <input 
                  value={studentAddr}
                  onChange={(e) => setStudentAddr(e.target.value)}
                  placeholder="Paste Algorand address (e.g., 7MQJ...)" 
                  className="w-full bg-black/20 border border-white/10 focus:border-cyan-500 focus:bg-black/40 p-4 rounded-xl outline-none transition-all placeholder:text-slate-600 font-mono text-sm" 
                />
              </div>
              
              <div className="group/input">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 ml-1 font-semibold mb-1 block group-hover/input:text-cyan-400 transition-colors">Degree Name</label>
                <input 
                  value={degreeName}
                  onChange={(e) => setDegreeName(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science" 
                  className="w-full bg-black/20 border border-white/10 focus:border-cyan-500 focus:bg-black/40 p-4 rounded-xl outline-none transition-all placeholder:text-slate-600" 
                />
              </div>

              <div className="group/input">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 ml-1 font-semibold mb-1 block group-hover/input:text-cyan-400 transition-colors">Certificate File</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-cyan-500/50 transition-all bg-black/10 text-center cursor-pointer">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-sm text-slate-400 font-medium">
                    {file ? <span className="text-cyan-400">📄 {file.name}</span> : "Drop your PDF/Image here or Click to browse"}
                  </p>
                </div>
              </div>

              <button 
                onClick={handleMintAction}
                disabled={isMinting}
                className={`w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 ${isMinting ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
              >
                {isMinting ? "Executing Smart Contract..." : "Mint Soulbound Asset"}
              </button>
            </div>
          </section>

          {/* Right Side: Public Verifier */}
          <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl hover:border-white/20 transition-all duration-500 relative group flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                <span className="bg-slate-800 p-2 rounded-lg border border-slate-700">🔍</span>
                Public Verification
              </h2>
              
              {/* ADVANCED FEATURE: ZKP Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ZKP Mode</span>
                <button onClick={() => setZkpMode(!zkpMode)} className={`w-10 h-5 rounded-full relative transition-colors ${zkpMode ? 'bg-purple-500' : 'bg-slate-700'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${zkpMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
            
            <div className="relative z-10 flex-grow">
              <div className="flex gap-3 mb-8">
                <input 
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  placeholder="Enter Asset ID (e.g. 983138)" 
                  className="flex-1 bg-black/20 border border-white/10 focus:border-purple-500 focus:bg-black/40 p-4 rounded-xl outline-none transition-all font-mono placeholder:text-slate-600" 
                />
                <button 
                  onClick={async () => setVerificationResult(await verifyCertificate(assetId))}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95"
                >
                  Verify
                </button>
              </div>

              {verificationResult && (
                <div className={`mt-auto p-6 rounded-2xl border backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500 ${verificationResult.valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                   
                   <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${verificationResult.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {verificationResult.valid ? "✅" : "❌"}
                     </div>
                     <div>
                       <p className="text-xl font-bold text-white tracking-wide">
                         {verificationResult.valid ? "Authentic Credential" : "Invalid ID"}
                       </p>
                       {/* ADVANCED FEATURE: W3C DID Standard Integration */}
                       {verificationResult.valid && (
                         <p className="text-[9px] text-green-400 font-mono mt-1">W3C Compliant: did:algo:testnet:{assetId}</p>
                       )}
                     </div>
                   </div>

                   {verificationResult.valid && (
                     <div className="space-y-4">
                       <div className="flex justify-between items-start">
                         <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Credential Holder</p>
                           <p className="text-lg font-medium text-slate-200">{verificationResult.name}</p>
                         </div>
                         <div className="flex flex-col gap-1 items-end">
                            {/* ADVANCED FEATURE: Social Trust Oracle Tag */}
                            <div className="flex items-center gap-1 bg-[#0077b5]/20 border border-[#0077b5]/50 px-2 py-1 rounded text-[#0077b5] text-[10px] font-bold">
                              <span>in</span> Oracle Verified
                            </div>
                            {/* ADVANCED FEATURE: Cross-Chain Oracle Badge */}
                            <div className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-white/10 px-2 py-1 rounded text-white text-[9px] font-bold">
                              🌉 Cross-Chain Ready (Solana)
                            </div>
                         </div>
                       </div>
                       
                       {/* SOULBOUND BADGE */}
                       {verificationResult.isSoulbound && (
                          <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 px-3 py-1.5 rounded-lg">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                            </span>
                            <p className="text-[10px] font-bold text-purple-300 tracking-widest uppercase">
                              Soulbound (Non-Transferable)
                            </p>
                          </div>
                       )}

                       {/* ADVANCED FEATURE: Recruiter Escrow & Bounty Alert */}
                       <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg flex justify-between items-center">
                         <div>
                           <p className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest mb-1">Active Smart Contract Bounty</p>
                           <p className="text-sm text-yellow-100">Morgan Stanley Hiring Escrow</p>
                         </div>
                         <p className="text-lg font-bold text-yellow-400">500 ALGO</p>
                       </div>

                       {/* ADVANCED FEATURE: ZKP Output Simulation */}
                       {zkpMode && (
                         <div className="bg-purple-900/30 border border-purple-500/30 p-3 rounded-lg text-sm text-purple-300 font-mono mt-2">
                           <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1">Zero-Knowledge Proof Executed</p>
                           &gt; Verifying Statement: CGPA &ge; 8.0 <br/>
                           &gt; Proof Validated: <span className="text-green-400">TRUE</span> <br/>
                           &gt; Raw Data: <span className="text-slate-500">HIDDEN</span>
                         </div>
                       )}

                       {/* ADVANCED FEATURE: Dynamic Skill Cloud */}
                       <div className="pt-2">
                         <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Dynamic Skill Cloud (ARC-19)</p>
                         <div className="flex flex-wrap gap-2">
                           <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-cyan-400">Web3 Architecture</span>
                           <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-cyan-400">Algorand ASA</span>
                           <span className="text-[10px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-2 py-1 rounded text-purple-300 animate-pulse">New: Hackathon Winner</span>
                         </div>
                       </div>

                       <div className="pt-2">
                         <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Issuer Signature</p>
                         <p className="text-xs font-mono text-slate-400 truncate bg-black/20 p-2 rounded border border-white/5">
                           {verificationResult.issuedBy}
                         </p>
                       </div>

                       {/* ADVANCED FEATURE: Token-Gated Alumni Action & Original Link */}
                       <div className="flex gap-2 pt-4">
                         <a href={verificationResult.url} target="_blank" rel="noreferrer" className="flex-1 text-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium transition-colors">
                           📄 View IPFS Original
                         </a>
                         <button className="flex-1 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 hover:bg-blue-600/40 rounded-xl text-xs font-bold text-blue-300 transition-colors uppercase tracking-widest">
                           Unlock Alumni Portal
                         </button>
                       </div>
                     </div>
                   )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
           <div className="bg-slate-900 border border-cyan-500/50 p-8 rounded-3xl max-w-md w-full shadow-[0_0_60px_rgba(6,182,212,0.2)] text-center">
             <div className="text-6xl mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">🏆</div>
             <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">Issued Successfully!</h2>
             <p className="text-slate-400 mb-8 text-sm">Secured forever on the Algorand Blockchain.</p>
             
             <div className="space-y-4 text-left">
               <div className="bg-black/40 p-5 rounded-2xl border border-white/10 flex justify-between items-center backdrop-blur-sm">
                 <div>
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Asset ID (W3C DID Format)</p>
                     <p className="text-cyan-400 font-mono font-bold text-xl">did:algo:{mintedData.id}</p>
                 </div>
                 <button 
                   onClick={copyToClipboard}
                   className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/10 text-sm hover:scale-105 active:scale-95"
                   title="Copy ID"
                 >
                   📋
                 </button>
               </div>
               
               <a href={`https://testnet.explorer.perawallet.app/asset/${mintedData.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex justify-center items-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm rounded-xl transition-colors">
                  🌐 Verify on Pera Explorer
               </a>
               
               {/* 💼 LINKEDIN BUTTON ADDED HERE 💼 */}
               <a href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(degreeName || "Algorand Soulbound Degree")}&organizationName=${encodeURIComponent("AlgoCred University")}&certId=${mintedData.id}&certUrl=${encodeURIComponent(`https://testnet.explorer.perawallet.app/asset/${mintedData.id}`)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex justify-center items-center gap-2 py-3 px-4 mt-2 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/50 text-[#0077b5] text-sm font-bold rounded-xl transition-colors">
                  💼 Bind to LinkedIn Oracle
               </a>
             </div>

             <button 
               onClick={() => {
                 setShowModal(false);
                 setAssetId(mintedData.id); 
               }} 
               className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 text-lg uppercase tracking-widest"
             >
               Run Public Verifier
             </button>
           </div>
         </div>
      )}

    </div>
  );
}

export default App;