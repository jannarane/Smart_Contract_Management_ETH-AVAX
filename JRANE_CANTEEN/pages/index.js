import { useState, useEffect } from "react";
import { ethers } from "ethers";
import jraneabi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [jrane, setJrane] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const jraneABI = jraneabi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log("Accounts are empty");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("You need MetaMask extension to proceed.");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getJraneContract();
  };

  const getJraneContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const JraneContract = new ethers.Contract(contractAddress, jraneABI, signer);
    setJrane(JraneContract);
  };

  useEffect(() => { getWallet(); }, []);
  useEffect(() => { if (account) { getBalance();}}, [account]);

  const getBalance = async () => {
    if (jrane) {
      setBalance((await jrane.getBalance()).toNumber());
    }
  };

  const buyItem = async (amount) => {
    if (jrane && amount > 0) {
      try {
        let tx = await jrane.buyItem(amount);
        await tx.wait();
        getBalance();
        alert("You gained " + (amount) + " JRN Tokens to your wallet!");
      } catch (error) {
        console.error("Buying failed:", error);
      }
    } else {
      console.error("Invalid item to buy!");
    }
  }

  const redeemItem = async (amount) => {
    if (jrane && amount > 0) {
      try {
        let tx = await jrane.redeemItem(amount);
        await tx.wait();
        getBalance();
        alert("You lost " + (amount) + " JRN Tokens from your wallet!");
      } catch (error) {
        console.error("Redemption failed:", error);
      }
    } else {
      alert("You need more" + (amount - balance) + "JRN Tokens!");
    }
  }
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please Install the MetaMask Extension to use this program</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>LET'S BEGIN
      </button>;
    }
  
    return (
      <div>
        <p><strong>Account:</strong> {account}</p>
        <h2><i>================ REGULAR MENU ================</i></h2>
        <p>(3 pts)&nbsp;<b>CHEESE BURGER</b><button onClick={() => buyItem(3)}>BUY</button></p>
        <p>(2 pts)&nbsp;<b>BBQ NUGGETS</b><button onClick={() => buyItem(2)}>BUY</button></p>
        <p>(8 pts)&nbsp;<b>CRISPY PORK SISIG</b><button onClick={() => buyItem(8)}>BUY</button></p>
        <p>(5 pts)&nbsp;<b>EGG FRIED NOODLES</b><button onClick={() => buyItem(5)}>BUY</button></p>
        <h2><i>===============================================</i></h2>  
        <h2><i>============== REDEEMABLE ITEMS ==============</i></h2>
        <p>(56 JRN)&nbsp;<b>METAL STRAW</b><button onClick={() => redeemItem(56)}>REDEEM</button></p>
        <p>(140 JRN)&nbsp;<b>TUMBLER</b><button onClick={() => redeemItem(140)}>REDEEM</button></p>
        <p>(38 JRN)&nbsp;<b>TOTE BAG</b><button onClick={() => redeemItem(38)}>REDEEM</button></p>
        <p>(23 JRN)&nbsp;<b>PREMIUM STICKERS&nbsp;</b><button onClick={() => redeemItem(23)}>REDEEM</button></p>
        <h2><i>===============================================</i></h2>
        <h3>JRANE COINS: {balance}</h3>
      </div>
    );
  };

  return (
    <main className="container">
      <header>
        <h1><u>JRANE'S CANTEEN</u></h1>
      </header>
      {initUser()}  
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}