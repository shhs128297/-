import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import IdentityContract from "./contracts/Identity.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import EthCrypto from 'eth-crypto';

class App extends Component {
  state = { storageValue: null, web3: null, accounts: null, contract: null, next: null, ethkey:null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = IdentityContract.networks[networkId];
      const instance = new web3.eth.Contract(
        IdentityContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runInit = async () => {
    const { accounts, contract } = this.state;
    const response = "請點選登入後開始使用";
    this.setState({ storageValue: response });
  };

  clicktoRegister = async () => {
    const { accounts, contract, ethkey } = this.state;
    if(ethkey){
        try {
          const ethepublickey = EthCrypto.publicKeyByPrivateKey(ethkey);
          const etheaddress = EthCrypto.publicKey.toAddress(ethepublickey);
          if(etheaddress==accounts[0]){
            try {
              await contract.methods.register(accounts[0], ethepublickey).send({ from: accounts[0] });
              const response = "註冊完畢，請再次點選登入";
        
              this.setState({ storageValue: response });
            } catch (error){
              this.setState({ storageValue: "註冊失敗，請確認是否已註冊過" });
            }
          } else {
            this.setState({ storageValue: "私鑰錯誤" });
          }

        } catch (error){
          this.setState({ storageValue: "私鑰錯誤" });
        }



    } else {
      this.setState({ storageValue: "未輸入私鑰" });
    }


  };

  clicktoCheck = async () => {
    const { accounts, contract } = this.state;
    const usercheck = await contract.methods.check(accounts[0]).call();
    let response = "驗證未成功，請再次確認。";

    if (usercheck == 1){

      response = "帳號驗證成功，歡迎使用";
      this.setState({ next:<li><Link to = "/start">點選開始使用</Link></li> });
    }
    if (usercheck == 0){

      response = "帳號還未註冊，請點選註冊。";
      
    }
    this.setState({storageValue: response});

  };

  EnterKey = async (event) => {

    try {
        this.setState({ ethkey: event.target.value });
    } catch (error) {
        this.setState({ ethkey: "" });
    }  
 
  };

  render() {
    if (!this.state.web3) {
      return <div align="center" >Loading Web3, accounts, and contract...(等待過久請重新整理)</div>;
    }
    return (
      <div className="App">
        <h1>使用者登入頁面</h1>
        <p>本系統使用metamask管理ethereum帳號</p>
        <p>切換帳號後請重新整理</p>

        <div>目前帳號：  {this.state.accounts} </div>
        <div>帳號狀態：  {this.state.storageValue} </div>
        
        <div>註冊請輸入私鑰：<input type="text" value={this.state.ethkey} onChange={this.EnterKey} /></div>
        <div><button type="button" onClick={this.clicktoRegister}> 註冊 </button> </div>
        <div><button type="button" onClick={this.clicktoCheck}> 登入 </button> </div>

        <div>{this.state.next} </div>

      </div>
    );
  }
}

export default App;
