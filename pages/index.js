import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const BankContractAddress = "0x123..."; // Replace with your contract address
const BankContractABI = [/* Insert the ABI of your contract here */];

function App() {
  const [amount, setAmount] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    async function getAccountBalance() {
      try {
        // Prompt the user to connect their Metamask wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create an ethers.js provider and contract instance
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          BankContractAddress,
          BankContractABI,
          provider
        );

        // Get the user's account balance
        const address = await provider.getSigner().getAddress();
        const balance = await contract.balances(address);
        setAccountBalance(balance);
      } catch (error) {
        console.error(error);
        alert("Failed to connect to Metamask");
      }
    }

    getAccountBalance();
  }, []);

  async function deposit() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        BankContractAddress,
        BankContractABI,
        signer
      );

      const tx = await contract.deposit({ value: amount });
      await tx.wait();

      // Update the account balance
      const address = await signer.getAddress();
      const balance = await contract.balances(address);
      setAccountBalance(balance);

      alert("Deposit successful!");
    } catch (error) {
      console.error(error);
      alert("Deposit failed");
    }
  }

  async function withdraw() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        BankContractAddress,
        BankContractABI,
        signer
      );

      const tx = await contract.withdraw(amount);
      await tx.wait();

      // Update the account balance
      const address = await signer.getAddress();
      const balance = await contract.balances(address);
      setAccountBalance(balance);

      alert("Withdrawal successful!");
    } catch (error) {
      console.error(error);
      alert("Withdrawal failed");
    }
  }

  return (
    <div>
      <h1>Bank App</h1>
      <p>Your account balance: {accountBalance} ETH</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}

export default App;
