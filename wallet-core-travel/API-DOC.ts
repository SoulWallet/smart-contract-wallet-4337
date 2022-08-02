/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-02 16:01:35
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-02 21:54:50
 */

/*
┌─────────────────────────────────────────────┐
│                                             │
│             ┌──────────────┐                │
│             │ call process │                │
│             └───────┬──────┘                │
│                     │                       │
│                     │                       │
│              ┌──────▼──────┐                │
│              │ constructor │                │
│              └──────┬──────┘                │
│                     │                       │
│                     │                       │
│          ┌──────────▼─────────────┐         │
│          │ calculateWalletAddress │         │
│          └───────────┬────────────┘         │
│                      │                      │
│                      │                      │
│            ┌─────────▼─────────┐            │
│            │ initUserOperation │            │
│            └─────────┬─────────┘            │
│                      │                      │
│                      │                      │
│               ┌──────▼──────┐               │
│               │ estimateGas │               │
│               └──────┬──────┘               │
│                      │                      │
│                      │                      │
│                ┌─────▼──────┐               │
│                │ signUserOp │               │
│                └────────────┘               │
│                                             │
└─────────────────────────────────────────────┘
 */

export class NpmLib {
  _entryPoint: string = '';
  _create2Factory: string = '';
  _chainId: number = 0;

  /**
   * initialize the library
   * @param entryPoint the entrypoint address
   * @param create2Factory the create2factory address
   * @param chainId the chain id
   */
  constructor(entryPoint: string, create2Factory: string, chainId: number) {
    this._entryPoint = entryPoint;
    this._create2Factory = create2Factory;
    this._chainId = chainId;
  }


  /**
   * calculate EIP-4337 wallet address
   * @param initialWalletOwner the initial wallet owner address
   * @param initCodeHash the init code after keccak256
   * @param salt the salt number
   * @returns the EIP-4337 wallet address
   */
  public calculateWalletAddress(initialWalletOwner: string, initCodeHash: string, salt: number): string {
    return '<address>';
  }


  /**
   * Initialize UserOperation
   * @param sender EIP-4337 wallet address
   * @param nonce unique value the sender uses to verify it is not a replay. (uint256) from 0
   * @param initCode if set, the account contract will be created
   * @param callData the method call to execute on this account.
   * @param callGas gas used for validateUserOp and validatePaymasterUserOp
   * @param verificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
   * @param preVerificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
   * @param maxFeePerGas same as EIP-1559 gas parameter
   * @param maxPriorityFeePerGas same as EIP-1559 gas parameter
   * @param paymaster if set, the paymaster will pay for the transaction instead of the sender
   * @param paymasterData extra data used by the paymaster for validation
   * @returns 
   */
  public initUserOperation(
    sender: string,
    nonce: number,
    initCode: string | null,
    callData: string,
    callGas: string,
    verificationGas: string,
    preVerificationGas: string,
    maxFeePerGas: string,
    maxPriorityFeePerGas: string,
    paymaster: string,
    paymasterData: string
  ): UserOperation {
    const userOperation: UserOperation = new UserOperation();
    userOperation.sender = sender;
    userOperation.nonce = nonce;
    if (initCode)
      userOperation.initCode = initCode;
    userOperation.callData = callData;
    userOperation.callGas = callGas;
    userOperation.verificationGas = verificationGas;
    userOperation.preVerificationGas = preVerificationGas;
    userOperation.maxFeePerGas = maxFeePerGas;
    userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
    userOperation.paymaster = paymaster;
    userOperation.paymasterData = paymasterData;
    return userOperation;
  }

  /**
   * update gas
   * @param userOperation the userOperation to update
   * @param estimateGasFunc the function to estimate gas
   */
  public async estimateGas(
    userOperation: UserOperation,
    estimateGasFunc: (txInfo: transactionInfo) => Promise<number>) {
    userOperation.callGas = (await estimateGasFunc({
      from: this._entryPoint,
      to: userOperation.sender,
      data: userOperation.callData,
    })).toString();
    userOperation.verificationGas = '';
    userOperation.preVerificationGas = '';
  }

  /**
   * Sign the userOperation with the given private key
   * @param userOperation the userOperation to sign
   * @param privateKey private key
   */
  public signUserOp(userOperation: UserOperation, privateKey: string) {
    // auto update the gas before signing
    // #TODO

    userOperation.signature = '<signature>';
  }





}

export class transactionInfo {
  from?: string;
  to?: string;
  data?: string;
}

export class UserOperation {
  /**
   * @param sender the sender account of this request
   */
  sender: string = '';
  /**
   * @param nonce unique value the sender uses to verify it is not a replay.
   */
  nonce: number = 0;
  /**
   * @param initCode if set, the account contract will be created by this constructor
   */
  initCode: string = '0x';
  /**
   * @param callData the method call to execute on this account.
   */
  callData: string = '0x';
  /**
   * @param callGas gas used for validateUserOp and validatePaymasterUserOp
   */
  callGas: string = '0';
  /**
   * @param verificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
   */
  verificationGas: string = '0';
  /**
   * @param preVerificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
   */
  preVerificationGas: string = '21000';
  /**
   * @param maxFeePerGas same as EIP-1559 gas parameter
   */
  maxFeePerGas: string = '0';
  /**
   * @param maxPriorityFeePerGas same as EIP-1559 gas parameter
   */
  maxPriorityFeePerGas: string = '0';
  /**
   * @param paymaster if set, the paymaster will pay for the transaction instead of the sender
   */
  paymaster: string = '0x';
  /**
   * @param paymasterData extra data used by the paymaster for validation
   */
  paymasterData: string = '0x';
  /**
   * @param signature sender-verified signature over the entire request, the EntryPoint address and the chain ID.
   */
  signature: string = '0x';
}