How to keep the address of the contract wallet that can change the owner in multiple chains:

A idea:

L1 as the source, and the same wallet address as L1 can be created at any time on L2

The wallets above L1 and L2 are uniformly created by a contract with the same address

Create a wallet on L1:

The user provides the initial ownerAddress-A, and the contract is executed in the same tx:
create2(bytecode='fixed bytecode' , salt = uint256(uint160(ownerAddress-A))); // no construction parameters
initialize(ownerAddress-A) ;// Execute the initialization function and set the wallet owner to ownerAddress-A

--------

User updates owner to ownerAddress-B on L1
updateOwner(ownerAddress-B)

Created on L2 (eg OP):
First call on L1: https://community.optimism.io/docs/developers/bridge/messaging/#communication-basics-between-layers The method transfers data to L2 through the contract wallet.
L1 -> L2 :
ovmL1CrossDomainMessenger.sendMessage(
 myOptimisticContractAddress,
 packMethod(ownerAddress-A, ownerAddress-B)
)

Secondly, after verifying the message from L1 on L2, execute:
create2(bytecode='fixed bytecode' , salt = uint256(uint160(ownerAddress-A))); // No construction parameters Note that the owner above L1 is no longer ownerAddress-A, the ownerAddress-A here is from L1 parameter
initialize(ownerAddress-B) ;// Execute the initialization function and set the wallet owner to ownerAddress-B


After executing the above, you can have two wallets with the same address in L1 and L2 (even if ownerAddress-A is lost),
Key point: The contract address of L1 L2 to help users deploy wallets needs to be the same (it can be solved through EOA with nonce or through create2+ upgradeable contract)
