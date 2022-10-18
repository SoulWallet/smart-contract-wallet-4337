//                                                 .___
// __  _  __ ____     _____   _______  __ ____   __| _/ _______   ____ ______   ____
// \ \/ \/ // __ \   /     \ /  _ \  \/ // __ \ / __ |  \_  __ \_/ __ \\____ \ /  _ \
//  \     /\  ___/  |  Y Y  (  <_> )   /\  ___// /_/ |   |  | \/\  ___/|  |_> >  <_> )
//   \/\_/  \___  > |__|_|  /\____/ \_/  \___  >____ |   |__|    \___  >   __/ \____/
//              \/        \/                 \/     \/               \/|__|

contract Info {
    event Moved(string);

    constructor() {
        // @link https://github.com/proofofsoulprotocol/soul-wallet-contract/blob/main/contracts/SmartWallet.sol
        emit Moved(
            "we moved repo to: https://github.com/proofofsoulprotocol/soul-wallet-contract/blob/main/contracts/SmartWallet.sol"
        );
    }
}
