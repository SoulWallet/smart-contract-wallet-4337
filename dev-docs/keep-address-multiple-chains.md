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



================== 

maybe code can better describe the idea...

# CODE(*Pseudocode* only)

Deployer: on L1 and L2 chains,with same address 

*For simplicity, all calls are assumed to be from EOA*

```solidity
contract Deployer {

    bool private initialized;
    address private owner;

    bytes walletCode = '0x00<byte code of WalletContract>';

    mapping (uint256 => address) L2MessengeBridge;

    initialize(address _owner) {
        require(!initialized);
        owner = _owner;
        // OP chainid:5,L2CrossDomainMessenger:0x4200000000000000000000000000000000000007
        L2MessengeBridge[5] = 0x4200000000000000000000000000000000000007;

        initialized = true;
    }

    function updateL2MessengeBridge(uint256 chainId, address addr) public {
        require(msg.sender == owner);
        L2MessengeBridge[chainId] = addr;
    }


    function deploy(bytes memory _initCode, bytes32 _salt) private returns (address payable createdContract){
        assembly {
            createdContract := create2(0, add(_initCode, 0x20), mload(_initCode), _salt)
        }
    }


    function deployContract(address _walletAddress,address _initialWalletOwner,address _walletOwner) public returns (address payable createdContract){
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        bytes32 salt = keccak256(abi.encodePacked(_initialWalletOwner)); 

        if (chainId == 0){
            // deploy contract on L1
            require(_initialWalletOwner == msg.sender);  
            require(_walletAddress == address(0),'no need wallet address on L1');
            createdContract = deploy(_byteCode, salt);
            createdContract.call(abi.encodeWithSignature("updateOwner(address)", _initialWalletOwner));
        }else{
            // deploy contract on L2
            // require call from L2CrossDomainMessenger 
            address l2Messenger = L2MessengeBridge[chainId];
            require (l2Messenger != address(0));
            require(msg.sender == l2Messenger);
            // msg.sender on L1 must be _walletAddress
            require(_walletAddress ==l2Messenger.xDomainMessageSender(),'msg.sender on L1 must be _walletAddress');
            createdContract = deploy(walletCode, salt);
            require (createdContract == _walletAddress,'wallet address not match');
            createdContract.call(abi.encodeWithSignature("updateOwner(address)", _walletOwner));
        }
    }
}
```




user smart contract wallet demo()
```solidity
contract WalletContract {

    bool private initialized;
    address public initialOwner;
    address public owner;

    initialize(address _owner) {
        require(!initialized);
        initialOwner = _owner;
        owner = _owner;
        initialized = true;
    } 

    function updateOwner(address _owner) public {
        require(msg.sender == owner);
        owner = _owner;
    }

    function deployToL2(address _deployer,address _L2MessengeBridge){
        _L2MessengeBridge.sendMessage(
            _deployer,
            abi.encodeWithSignature(
                "deployContract(bytes,address)", 
                address(this),initialOwner,owner
            )
        )
    }
}
```
