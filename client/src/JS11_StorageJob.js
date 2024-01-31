import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import AllContract from "./contracts/AllContract.json";
import IdentityContract from "./contracts/Identity.json";
import getWeb3 from "./getWeb3";
import JS7_ButtonSwithResultPage from './JS7_ButtonSwithResultPage';
import { create } from 'ipfs-http-client';
import EthCrypto from 'eth-crypto';




class JS11_StorageJob extends Component {
  state = { storageValue: null, 
            web3: null, 
            accounts: null, 
            contract: null, 
            next: null,
            joblist:null,
            page:null,
            pagenum:null,
            pageswitch:null,
            result1:null,
            result2:null,
            result3:null,
            result4:null,
            result5:null,
            button1:null,
            button2:null,
            button3:null,
            button4:null,
            button5:null,
            getresultbutton:null,
            payresultinfo:null,
            releasebutton:null,
            ethmassage1:null,
            ethmassage2:null
          };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AllContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AllContract.abi,
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
    await this.getjob();
    
  };

  getjob = async () => {
    const { accounts, contract } = this.state;

    const ownjoblist = await contract.methods.getOwnJobID(accounts[0]).call();
    await this.setState({ joblist: ownjoblist });
    await this.setState({ page: 0 });
    await this.setState({ pagenum: "第"+ 1 +"頁" });
    await this.setState({ pageswitch: <JS7_ButtonSwithResultPage set = {this.pageset} /> });
    await this.pageset(0);
  };

  overjob = async (jid, acc) => {
    const { accounts, contract } = this.state;
    const payresult = await contract.methods.getpaymentresult(jid).call();
    if(payresult[0]==0){
      await contract.methods.paymentcontrol(jid).send({ from: accounts[0] });
    }

    await this.setState({getresultbutton: <button type="button" onClick={() => {this.getjobresult(jid, acc)}}> 顯示處理結果 </button>});

  };

  getjobresult = async (jid, acc) => {
    const { accounts, contract } = this.state;
    const payresult = await contract.methods.getpaymentresult(jid).call();

    var paymentresult = [];

    paymentresult.push("費用處理狀況：",<br></br>);
    if(payresult[0]==1){
      paymentresult.push("費用已完成處理 ");
      paymentresult.push("退還給分享者："+payresult[1]+" ");
      paymentresult.push("支付給儲存者："+payresult[2]);
      if(acc==1){
        await this.setState({releasebutton: <button type="button" onClick={() => {this.releaseCap(jid)}}> 釋出儲存空間 </button>});
      }
    }

    await this.setState({payresultinfo: paymentresult});

  };

  releaseCap = async (jid) => {
    const { accounts, contract } = this.state;
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    var pid = await contract.methods.getJobProject(jid).call();
    var filecid = await contract.methods.getJobhash(jid).call();

    var date = new Date(Date.now());
    var nowyear = date.getFullYear();
    var nowmonth = date.getMonth()+1;
    var nowdate = date.getDate();
    const nownow = Date.parse(nowyear+"/"+nowmonth+"/"+nowdate)/1000;

    await contract.methods.UpdateProjectOwnJob(pid, jid, nownow).send({ from: accounts[0] }); 
    await client.pin.rm(filecid);
  }

  pageset = async (set) => {

    const { accounts, contract, joblist} = this.state;

    await this.setState({ 
        result1:"",
        result2:"",
        result3:"",
        result4:"",
        result5:"",
        button1:"",
        button2:"",
        button3:"",
        button4:"",
        button5:"" });

    let nowpage = this.state.page + set ;
    let len = joblist.length-1;

    if(!joblist[len-nowpage]&&joblist[len-nowpage]!=0){
      nowpage = nowpage-5;
    }
    if (nowpage < 0){
      nowpage = 0;
    }
    let number = (nowpage/5)+1
    this.setState({ page: nowpage });
    this.setState({ pagenum: "第"+ number +"頁" })

    var r1 = [];
    var r2 = [];
    var r3 = [];
    var r4 = [];
    var r5 = [];

    var nowstamp = (Date.now())/1000;

    if(joblist[len-nowpage]){

      const pid = await contract.methods.getJobProject(joblist[len-nowpage]).call();
      const partic = await contract.methods.getParticipant(joblist[len-nowpage]).call();
      const fid = await contract.methods.getFileID(joblist[len-nowpage]).call();
      const fsize = await contract.methods.getFileSize(joblist[len-nowpage]).call();
      const startstamp = await contract.methods.getStorageStart(joblist[len-nowpage]).call();
      const endstamp = await contract.methods.getStorageEnd(joblist[len-nowpage]).call();
      const at = await contract.methods.getAccessTime(joblist[len-nowpage]).call();

      var date1 = new Date(startstamp * 1000);
      var styear1 = date1.getFullYear();
      var stmonth1 = date1.getMonth()+1;
      var stdate1 = date1.getDate();
      const st = styear1+"/"+stmonth1.toString().padStart(2,'0')+"/"+stdate1.toString().padStart(2,'0');

      var date2 = new Date(endstamp * 1000);
      var styear2 = date2.getFullYear();
      var stmonth2 = date2.getMonth()+1;
      var stdate2 = date2.getDate();
      const ed = styear2+"/"+stmonth2.toString().padStart(2,'0')+"/"+stdate2.toString().padStart(2,'0');

      var atdate1 = new Date(at[0] * 1000);
      var at1 = atdate1.getHours();
      var atdate2 = new Date(at[1] * 1000);
      var at2 = atdate2.getHours();
      var atdate3 = new Date(at[2] * 1000);
      var at3 = atdate3.getHours();
      var atdate4 = new Date(at[3] * 1000);
      var at4 = atdate4.getHours();
      if(at1==0 && at1==at2){
        at2 = 24 ;
      }

      r1.push("使用儲存方案編號："+pid,<br></br>);
      r1.push("分享者："+partic[0]+" ");
      r1.push("儲存者："+partic[1],<br></br>);
      r1.push("檔案編號："+fid+" ");
      r1.push("檔案大小："+fsize+" ");
      r1.push("交易建立時間："+st+" ");
      r1.push("檔案儲存時限："+ed+" ");
      r1.push("可取得檔案時段："+at1+"~");
      r1.push(at2+"、");
      r1.push(at3+"~");
      r1.push(at4);

      var accountcheck = 0 ;
      if(partic[1]==accounts[0]){
        accountcheck = 1 ;
      }

      if(endstamp<nowstamp){
        await this.setState({button1: <button type="button" onClick={() => {this.overjob(joblist[len-nowpage], accountcheck)}}> 進行費用處理 </button>});
      }

    }

    if(joblist[len-(nowpage+1)]){

      const pid = await contract.methods.getJobProject(joblist[len-(nowpage+1)]).call();
      const partic = await contract.methods.getParticipant(joblist[len-(nowpage+1)]).call();
      const fid = await contract.methods.getFileID(joblist[len-(nowpage+1)]).call();
      const fsize = await contract.methods.getFileSize(joblist[len-(nowpage+1)]).call();
      const startstamp = await contract.methods.getStorageStart(joblist[len-(nowpage+1)]).call();
      const endstamp = await contract.methods.getStorageEnd(joblist[len-(nowpage+1)]).call();
      const at = await contract.methods.getAccessTime(joblist[len-(nowpage+1)]).call();

      var date1 = new Date(startstamp * 1000);
      var styear1 = date1.getFullYear();
      var stmonth1 = date1.getMonth()+1;
      var stdate1 = date1.getDate();
      const st = styear1+"/"+stmonth1.toString().padStart(2,'0')+"/"+stdate1.toString().padStart(2,'0');

      var date2 = new Date(endstamp * 1000);
      var styear2 = date2.getFullYear();
      var stmonth2 = date2.getMonth()+1;
      var stdate2 = date2.getDate();
      const ed = styear2+"/"+stmonth2.toString().padStart(2,'0')+"/"+stdate2.toString().padStart(2,'0');

      var atdate1 = new Date(at[0] * 1000);
      var at1 = atdate1.getHours();
      var atdate2 = new Date(at[1] * 1000);
      var at2 = atdate2.getHours();
      var atdate3 = new Date(at[2] * 1000);
      var at3 = atdate3.getHours();
      var atdate4 = new Date(at[3] * 1000);
      var at4 = atdate4.getHours();
      if(at1==0 && at1==at2){
        at2 = 24 ;
      }

      r2.push("使用儲存方案編號："+pid,<br></br>);
      r2.push("分享者："+partic[0]+" ");
      r2.push("儲存者："+partic[1],<br></br>);
      r2.push("檔案編號："+fid+" ");
      r2.push("檔案大小："+fsize+" ");
      r2.push("交易建立時間："+st+" ");
      r2.push("檔案儲存時限："+ed+" ");
      r2.push("可取得檔案時段："+at1+"~");
      r2.push(at2+"、");
      r2.push(at3+"~");
      r2.push(at4);

      var accountcheck = 0 ;
      if(partic[1]==accounts[0]){
        accountcheck = 1 ;
      }

      if(endstamp<nowstamp){
        await this.setState({button2: <button type="button" onClick={() => {this.overjob(joblist[len-(nowpage+1)], accountcheck)}}> 進行費用處理 </button>});
       }
    }

    if(joblist[len-(nowpage+2)]){

      const pid = await contract.methods.getJobProject(joblist[len-(nowpage+2)]).call();
      const partic = await contract.methods.getParticipant(joblist[len-(nowpage+2)]).call();
      const fid = await contract.methods.getFileID(joblist[len-(nowpage+2)]).call();
      const fsize = await contract.methods.getFileSize(joblist[len-(nowpage+2)]).call();
      const startstamp = await contract.methods.getStorageStart(joblist[len-(nowpage+2)]).call();
      const endstamp = await contract.methods.getStorageEnd(joblist[len-(nowpage+2)]).call();
      const at = await contract.methods.getAccessTime(joblist[len-(nowpage+2)]).call();

      var date1 = new Date(startstamp * 1000);
      var styear1 = date1.getFullYear();
      var stmonth1 = date1.getMonth()+1;
      var stdate1 = date1.getDate();
      const st = styear1+"/"+stmonth1.toString().padStart(2,'0')+"/"+stdate1.toString().padStart(2,'0');

      var date2 = new Date(endstamp * 1000);
      var styear2 = date2.getFullYear();
      var stmonth2 = date2.getMonth()+1;
      var stdate2 = date2.getDate();
      const ed = styear2+"/"+stmonth2.toString().padStart(2,'0')+"/"+stdate2.toString().padStart(2,'0');

      var atdate1 = new Date(at[0] * 1000);
      var at1 = atdate1.getHours();
      var atdate2 = new Date(at[1] * 1000);
      var at2 = atdate2.getHours();
      var atdate3 = new Date(at[2] * 1000);
      var at3 = atdate3.getHours();
      var atdate4 = new Date(at[3] * 1000);
      var at4 = atdate4.getHours();
      if(at1==0 && at1==at2){
        at2 = 24 ;
      }

      r3.push("使用儲存方案編號："+pid,<br></br>);
      r3.push("分享者："+partic[0]+" ");
      r3.push("儲存者："+partic[1],<br></br>);
      r3.push("檔案編號："+fid+" ");
      r3.push("檔案大小："+fsize+" ");
      r3.push("交易建立時間："+st+" ");
      r3.push("檔案儲存時限："+ed+" ");
      r3.push("可取得檔案時段："+at1+"~");
      r3.push(at2+"、");
      r3.push(at3+"~");
      r3.push(at4);

      var accountcheck = 0 ;
      if(partic[1]==accounts[0]){
        accountcheck = 1 ;
      }

      if(endstamp<nowstamp){
        await this.setState({button3: <button type="button" onClick={() => {this.overjob(joblist[len-(nowpage+2)], accountcheck)}}> 進行費用處理 </button>});
      }

    }

    if(joblist[len-(nowpage+3)]){

      const pid = await contract.methods.getJobProject(joblist[len-(nowpage+3)]).call();
      const partic = await contract.methods.getParticipant(joblist[len-(nowpage+3)]).call();
      const fid = await contract.methods.getFileID(joblist[len-(nowpage+3)]).call();
      const fsize = await contract.methods.getFileSize(joblist[len-(nowpage+3)]).call();
      const startstamp = await contract.methods.getStorageStart(joblist[len-(nowpage+3)]).call();
      const endstamp = await contract.methods.getStorageEnd(joblist[len-(nowpage+3)]).call();
      const at = await contract.methods.getAccessTime(joblist[len-(nowpage+3)]).call();

      var date1 = new Date(startstamp * 1000);
      var styear1 = date1.getFullYear();
      var stmonth1 = date1.getMonth()+1;
      var stdate1 = date1.getDate();
      const st = styear1+"/"+stmonth1.toString().padStart(2,'0')+"/"+stdate1.toString().padStart(2,'0');

      var date2 = new Date(endstamp * 1000);
      var styear2 = date2.getFullYear();
      var stmonth2 = date2.getMonth()+1;
      var stdate2 = date2.getDate();
      const ed = styear2+"/"+stmonth2.toString().padStart(2,'0')+"/"+stdate2.toString().padStart(2,'0');

      var atdate1 = new Date(at[0] * 1000);
      var at1 = atdate1.getHours();
      var atdate2 = new Date(at[1] * 1000);
      var at2 = atdate2.getHours();
      var atdate3 = new Date(at[2] * 1000);
      var at3 = atdate3.getHours();
      var atdate4 = new Date(at[3] * 1000);
      var at4 = atdate4.getHours();
      if(at1==0 && at1==at2){
        at2 = 24 ;
      }

      r4.push("使用儲存方案編號："+pid,<br></br>);
      r4.push("分享者："+partic[0]+" ");
      r4.push("儲存者："+partic[1],<br></br>);
      r4.push("檔案編號："+fid+" ");
      r4.push("檔案大小："+fsize+" ");
      r4.push("交易建立時間："+st+" ");
      r4.push("檔案儲存時限："+ed+" ");
      r4.push("可取得檔案時段："+at1+"~");
      r4.push(at2+"、");
      r4.push(at3+"~");
      r4.push(at4);

      var accountcheck = 0 ;
      if(partic[1]==accounts[0]){
        accountcheck = 1 ;
      }

      if(endstamp<nowstamp){
        await this.setState({button4: <button type="button" onClick={() => {this.overjob(joblist[len-(nowpage+3)], accountcheck)}}> 進行費用處理 </button>});
      }

    }

    if(joblist[len-(nowpage+4)]){

      const pid = await contract.methods.getJobProject(joblist[len-(nowpage+4)]).call();
      const partic = await contract.methods.getParticipant(joblist[len-(nowpage+4)]).call();
      const fid = await contract.methods.getFileID(joblist[len-(nowpage+4)]).call();
      const fsize = await contract.methods.getFileSize(joblist[len-(nowpage+4)]).call();
      const startstamp = await contract.methods.getStorageStart(joblist[len-(nowpage+4)]).call();
      const endstamp = await contract.methods.getStorageEnd(joblist[len-(nowpage+4)]).call();
      const at = await contract.methods.getAccessTime(joblist[len-(nowpage+4)]).call();

      var date1 = new Date(startstamp * 1000);
      var styear1 = date1.getFullYear();
      var stmonth1 = date1.getMonth()+1;
      var stdate1 = date1.getDate();
      const st = styear1+"/"+stmonth1.toString().padStart(2,'0')+"/"+stdate1.toString().padStart(2,'0');

      var date2 = new Date(endstamp * 1000);
      var styear2 = date2.getFullYear();
      var stmonth2 = date2.getMonth()+1;
      var stdate2 = date2.getDate();
      const ed = styear2+"/"+stmonth2.toString().padStart(2,'0')+"/"+stdate2.toString().padStart(2,'0');

      var atdate1 = new Date(at[0] * 1000);
      var at1 = atdate1.getHours();
      var atdate2 = new Date(at[1] * 1000);
      var at2 = atdate2.getHours();
      var atdate3 = new Date(at[2] * 1000);
      var at3 = atdate3.getHours();
      var atdate4 = new Date(at[3] * 1000);
      var at4 = atdate4.getHours();

      if(at1==0 && at1==at2){
        at2 = 24 ;
      }

      r5.push("使用儲存方案編號："+pid,<br></br>);
      r5.push("分享者："+partic[0]+" ");
      r5.push("儲存者："+partic[1],<br></br>);
      r5.push("檔案編號："+fid+" ");
      r5.push("檔案大小："+fsize+" ");
      r5.push("交易建立時間："+st+" ");
      r5.push("檔案儲存時限："+ed+" ");
      r5.push("可取得檔案時段："+at1+"~");
      r5.push(at2+"、");
      r5.push(at3+"~");
      r5.push(at4);

      var accountcheck = 0 ;
      if(partic[1]==accounts[0]){
        accountcheck = 1 ;
      }

      if(endstamp<nowstamp){
        await this.setState({button5: <button type="button" onClick={() => {this.overjob(joblist[len-(nowpage+4)], accountcheck)}}> 進行費用處理 </button>});
      }

    }
  
    await this.setState({ 
      result1: r1,
      result2: r2,
      result3: r3,
      result4: r4,
      result5: r5 
     });

  };

  ctether = async () => {
    const { accounts, contract} = this.state;
    await contract.methods.paytest(1).send({
      from: accounts[0],
      value: "1000000000000000000" // 1 ETH in wei
    });

  }

  ctproject = async () => {
    const { accounts, contract} = this.state;
    let starray = [];
    starray.push(9, 15, 0, 0);

    await contract.methods.ctestproject(accounts[0], starray).send({ from: accounts[0] });

  };

  ctjob = async () => {
    const { accounts, contract} = this.state;

    await contract.methods.ctestjob(accounts[0]).send({ from: accounts[0] });

  };

  ctpayment = async () => {
    const { accounts, contract} = this.state;

    await contract.methods.ctestpayment().send({ from: accounts[0] });

  };

  ctlog = async () => {
    const { accounts, contract} = this.state;

    await contract.methods.ctestlog(accounts[0]).send({ from: accounts[0] });

  };

  ethctest0 = async () => { 

    const { accounts, contract} = this.state;
    const pkey = EthCrypto.publicKeyByPrivateKey(
      '0x532e335b723dc0d0b605f4893d10e565fc802a97991bd3b04e4c9d957ce60e7f'
    );
    await contract.methods.register(accounts[0], pkey).send({ from: accounts[0] });

  };

  ethctest1 = async () => { 

    const { accounts, contract} = this.state;
    /*
    const pkey = EthCrypto.publicKeyByPrivateKey(
      '0x532e335b723dc0d0b605f4893d10e565fc802a97991bd3b04e4c9d957ce60e7f'
    );
    */

/* 壓縮解壓
    const smallkey = EthCrypto.publicKey.compress(
      pkey
    );
    const rekey = EthCrypto.publicKey.decompress(
      smallkey
    );
*/
    const pubk = await contract.methods.getpublickey(accounts[0]).call();
    const secretob = await EthCrypto.encryptWithPublicKey(
      pubk, // publicKey
      '2977q' // message
    );
    const secretword = EthCrypto.cipher.stringify(secretob);
    
    await this.setState({ ethmassage1: pubk, ethmassage2:secretword });
//    await contract.methods.register(accounts[0], secretword).send({ from: accounts[0] });

  };

  ethctest2 = async () => { 

    const { accounts, contract} = this.state;
    const { ethmassage2, ethmassage1} = this.state;

//    const stw = await contract.methods.getpublickey(accounts[0]).call();
    const encob = EthCrypto.cipher.parse(ethmassage2);

//    const pubk = await contract.methods.getpublickey(accounts[0]).call();

    const decword = await EthCrypto.decryptWithPrivateKey(
      '0xa01fb116521e28792c53ce6aad39983ab1fbc460086b7bacf4bbe7d155b66861',
      encob
    );
    
    await this.setState({ ethmassage1: decword, ethmassage2:"pubk" });


  };


  render() {
    if (!this.state.web3) {
      return <div align="center" >Loading Web3, accounts, and contract...(等待過久請重新整理)</div>;
    }
    return (
      <div className="JS11_StorageJob">
        <ul><li><Link to = "/start">返回上一頁</Link></li></ul>
        <h1>查看儲存交易</h1>

        <div>參與的儲存交易</div>
        <div>{this.state.pageswitch} {this.state.pagenum}<p></p></div>
        <div>{this.state.result1}{this.state.button1}<p></p></div>
        <div>{this.state.result2}{this.state.button2}<p></p></div>
        <div>{this.state.result3}{this.state.button3}<p></p></div>
        <div>{this.state.result4}{this.state.button4}<p></p></div>
        <div>{this.state.result5}{this.state.button5}</div>

        <div>{this.state.getresultbutton}</div>
        <div>{this.state.payresultinfo}</div>
        <div>{this.state.releasebutton}</div>

        <div>測試用資料建立</div>
        <div><button type="button" onClick={this.ctether}> 發送ether至smart contract </button></div>
        <div><button type="button" onClick={this.ctproject}> user1建立測試方案 </button></div>
        <div><button type="button" onClick={this.ctjob}> user2建立測試交易 </button></div>
        <div><button type="button" onClick={this.ctpayment}> user2建立測試費用 </button></div>
        <div><button type="button" onClick={this.ctlog}> user3建立測試歷程 </button></div>

      </div>
    );
  }
}

export default JS11_StorageJob;