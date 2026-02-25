
import React from 'react';

export const ArchitectureDoc: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24">
      <section className="space-y-6 text-center">
        <h1 className="text-5xl font-display font-black text-slate-100 tracking-mysterious uppercase glow-text">Veil Infrastructure</h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed font-light">
          Production-grade architecture for non-custodial confidential finance. 
          Powered by Zama fhEVM, ERC-4337, and WebAuthn.
        </p>
      </section>

      {/* Wallet Abstraction Layer */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-48 h-48 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.234 3.41.659m-4.74 4.892A1 1 0 0011 9h4a1 1 0 00.993-.883L16 8l-.007-.117A1 1 0 0015 7h-4a1 1 0 00-1 1l.007.117a1 1 0 00.993.883zM11 12v1m0 4v1m4-5v1m0 4v1" /></svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-8 uppercase tracking-mysterious">Veil Wallet Abstraction (VWA)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-cyan-400 font-bold uppercase tracking-tighter text-sm">Hardware-Bound Signers</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">Uses WebAuthn to leverage the device's Secure Enclave. Private keys never exist on a server or as a seed phrase.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-cyan-400 font-bold uppercase tracking-tighter text-sm">ERC-4337 Integration</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">User accounts are Smart Contracts. Every transaction is a <code>UserOperation</code> validated by the Passkey credential.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-cyan-400 font-bold uppercase tracking-tighter text-sm">Social & Multi-Device Recovery</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">Lost devices are recovered via FHE-encrypted guardians. No single party can unilaterally reset access.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-10 overflow-x-auto font-mono text-xs text-indigo-300 leading-relaxed shadow-2xl relative">
        <div className="absolute top-4 right-6 text-[10px] text-slate-600 font-bold tracking-mysterious uppercase">User Flow: Signup to Settlement</div>
        <h3 className="text-slate-100 mb-8 font-display text-lg font-extrabold uppercase tracking-mysterious border-b border-slate-800 pb-4">Transactional Life-Cycle</h3>
        <pre className="opacity-80 hover:opacity-100 transition-opacity">{`
 [User Device] --(1. Biometric Auth)--> [Passkey Signature]
       |                                     |
 [Veil Frontend] <--(2. Signature)-----------+
       |
 [Veil Paymaster] --(3. Sponsor Gas)--> [Veil Bundler]
                                             |
 [fhEVM Node] <--(4. UserOperation)---------+
       |
 [SCA Contract] --(5. Validate P-256)--> [fhEVM: VeilToken]
                                             |
 [Confidential State] <--(6. TFHE.transfer)--+
        `}</pre>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-emerald-400 uppercase tracking-mysterious">Nigerian Liquidity Layer</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-emerald-500/30 transition-colors">
            <h4 className="font-bold text-slate-200 uppercase tracking-tighter">Shadow P2P Settlement:</h4>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-3 font-light">
              <li><strong>Verification:</strong> LPs verify bank receipts using FHE proofs without seeing the sender's total balance.</li>
              <li><strong>NUBAN Mapping:</strong> Username to Account mapping is encrypted at rest.</li>
              <li><strong>Compliance:</strong> KYC status is stored as a <code>bool</code> encrypted via TFHE. Only authorized auditors can threshold-decrypt.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-cyan-400 uppercase tracking-mysterious">Threat Model</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-cyan-500/30 transition-colors">
            <h4 className="font-bold text-slate-200 uppercase tracking-tighter">VWA Protections:</h4>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-3 font-light">
              <li><strong>Key Extraction:</strong> Impossible. Credentials are hardware-locked.</li>
              <li><strong>Operator Theft:</strong> SCA only executes code if valid hardware signature is provided.</li>
              <li><strong>Front-Running:</strong> UserOps are signed with high-entropy nonces and account-specific challenges.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="space-y-8">
        <h2 className="text-3xl font-display font-black text-slate-100 uppercase tracking-mysterious text-center">Smart Contract Infrastructure</h2>
        
        <div className="grid grid-cols-1 gap-10">
          {/* Account Contract */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-4">
              <h3 className="text-sm font-mono text-cyan-500 font-bold tracking-widest">// VeilSmartAccount.sol (Passkey Auth)</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 font-mono text-xs text-slate-400 leading-relaxed overflow-x-auto shadow-inner">
              <pre className="opacity-90">{`
import "fhevm/lib/TFHE.sol";
import "@account-abstraction/BaseAccount.sol";

contract VeilSmartAccount is BaseAccount {
    bytes32 public passkeyPublicKey;

    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash) 
        internal override returns (uint256 validationData) {
        // WebAuthn P256 verification logic...
        return WebAuthn.verify(userOpHash, userOp.signature, passkeyPublicKey) ? 0 : 1;
    }

    function executeFheTransfer(address to, bytes calldata cipherAmount) public onlyEntryPoint {
        euint64 amount = TFHE.asEuint64(cipherAmount);
        VeilToken.transfer(to, amount);
    }
}
              `}</pre>
            </div>
          </div>

          {/* Token Contract */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-4">
              <h3 className="text-sm font-mono text-emerald-500 font-bold tracking-widest">// VeilToken.sol (Confidential TFHE)</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 font-mono text-xs text-slate-400 leading-relaxed overflow-x-auto shadow-inner">
              <pre className="opacity-90">{`
import "fhevm/lib/TFHE.sol";

contract VeilToken is EERC20 {
    mapping(address => euint64) internal _balances;

    function transfer(address to, bytes calldata encryptedAmount) public returns (bool) {
        euint64 amount = TFHE.asEuint64(encryptedAmount);
        
        // Homomorphic subtraction & addition
        // Validators see NOTHING. Only encrypted state changes.
        TFHE.optReq(TFHE.le(amount, _balances[msg.sender]));
        _balances[msg.sender] = TFHE.sub(_balances[msg.sender], amount);
        _balances[to] = TFHE.add(_balances[to], amount);
        
        return true;
    }
}
              `}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
