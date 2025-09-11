# Universal Token (UTK) Cross-Chain Sync Demo

This example demonstrates a minimal cross-chain total supply synchronization for an ERC-20-like token `UTK` using per-chain `Bridge` contracts and an off-chain relayer.

Components:
- UTK (`contracts/UTK.sol`): ERC-20 with bridge-only mint/burn and a `globalTotalSupply` mirrored by the bridge.
- Bridge (`contracts/Bridge.sol`): Mints/burns locally and emits events; accepts remote updates via relayer.
- Relayer (`scripts/relayer.js`): Listens to events on both chains and mirrors global supply to the opposite bridge.

Environment variables (create `.env`):
```
DEPLOYER_PRIVATE_KEY=
RELAYER_PRIVATE_KEY=

CHAIN_A_RPC=
CHAIN_B_RPC=

UTK_NAME=Universal Token
UTK_SYMBOL=UTK
```

Deploy UTK and Bridge on Chain A:
```
npx hardhat run scripts/deploy_utk.js --network chainA
TOKEN_ADDRESS_A=0x... from output
TRUSTED_RELAYER=0x...your relayer EOA
TOKEN_ADDRESS=$TOKEN_ADDRESS_A TRUSTED_RELAYER=$TRUSTED_RELAYER npx hardhat run scripts/deploy_bridge.js --network chainA
BRIDGE_A=0x... from output
```

Deploy UTK and Bridge on Chain B:
```
npx hardhat run scripts/deploy_utk.js --network chainB
TOKEN_ADDRESS_B=0x... from output
TOKEN_ADDRESS=$TOKEN_ADDRESS_B TRUSTED_RELAYER=$TRUSTED_RELAYER npx hardhat run scripts/deploy_bridge.js --network chainB
BRIDGE_B=0x... from output
```

Start relayer:
```
CHAIN_A_BRIDGE=$BRIDGE_A CHAIN_B_BRIDGE=$BRIDGE_B node scripts/relayer.js
```

Test flow (Chain A):
1) Call `Bridge.mintLocal(to, amount)` on Chain A (owner-only) -> emits `LocalMint`.
2) Relayer calls `Bridge.updateGlobalTotalSupplyFromRemote(newGlobal)` on Chain B.
3) Both `Bridge.globalTotalSupply` and `UTK.globalTotalSupply` are in sync.

Notes:
- This demo trusts an EOA relayer and owner-only local mint/burn. Production deployments must enforce authenticated cross-chain messages (e.g., CCIP, LayerZero, IBC).
