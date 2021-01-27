**SmartContract**

SmartContract is a code written in Solidity language. A smart contract is a self-executing contract with the terms of the agreement between buyer and seller being directly written into lines of code. The code and the agreements contained therein exist across a distributed, decentralized blockchain network. The code controls the execution, and transactions are trackable and irreversible.

Smart contracts permit trusted transactions and agreements to be carried out among disparate, anonymous parties without the need for a central authority, legal system, or external enforcement mechanism.

While blockchain technology has come to be thought of primarily as the foundation for bitcoin, it has evolved far beyond underpinning the virtual currency.

    pragma solidity ^0.4.0;

    contract SimpleStorage {
        uint storedData;
        
        function set(uint x) public {
            storedData = x;
        }
        
        function get() public view returns (uint) {
            return storedData;
        }
    }