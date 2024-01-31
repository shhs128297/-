import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import FileCryptoContract from "./contracts/FileCrypto.json";
import AllContract from "./contracts/AllContract.json";
import getWeb3 from "./getWeb3";
import JS7_ButtonSwithResultPage from './JS7_ButtonSwithResultPage';
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";
import { create } from 'ipfs-http-client';
import EthCrypto from 'eth-crypto';


class JS9_FileShareCheck extends Component {
  state = { storageValue: null, 
            web3: null, 
            accounts: null, 
            contract: null, 
            entername:null,
            enterkword: null, 
            enteraddres:null,
            namearray:null,
            keywordarray:null,
            accountarray:null,
            resultarray:null,
            result1:null,
            result2:null,
            result3:null,
            result4:null,
            result5:null,
            getbuton1:null,
            getbuton2:null,
            getbuton3:null,
            getbuton4:null,
            getbuton5:null,
            dlbutton1:null,
            dlbutton2:null,
            dlbutton3:null,
            dlbutton4:null,
            dlbutton5:null,
            selectinfo:null,
            selectarray:null,
            eid:null,
            ename:null,
            euploader:null,
            ekeyword:null,
            etime:null,
            eshare:null,
            page:null,
            pagenum:null,
            pageswitch:null,
            togetlog:null,
            logresult:null,
            ethkey:null,
            keyvalue:"28472B4B6150645367566B5970337336763979244226452948404D6351655468",
            dlinfo:null

          };


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork2 = FileCryptoContract.networks[networkId];
      const instance2 = new web3.eth.Contract(
        FileCryptoContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance2 });
      this.setState({cryptocontract: this.state.contract});

      const deployedNetwork1 = AllContract.networks[networkId];
      const instance1 = new web3.eth.Contract(
        AllContract.abi,
        deployedNetwork1 && deployedNetwork1.address,
      );
      this.setState({ web3, accounts, contract: instance1 }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runInit = async () => {

    const account  = this.state.accounts;

    await this.StartSearch();

  };

  SearchName = async (event) => {

    try {
        this.setState({ entername: event.target.value });
    } catch (error) {
        this.setState({ entername: null });
    }  
 
  };

  SearchKeyword = async (event) => {

    try {
        this.setState({ enterkword: event.target.value });
    } catch (error) {
        this.setState({ enterkword: null });
    }  
 
  };

  SearchUploader = async (event) => {

    try {
        this.setState({ enteraddres: event.target.value });
    } catch (error) {
        this.setState({ enteraddres: null });
    }  
 
  };

  pageset = async (set) => {

    const result = this.state.resultarray;
    this.setState({ 
      dlbutton1: null,
      dlbutton2: null,
      dlbutton3: null,
      dlbutton4: null,
      dlbutton5: null
    });
    let nowpage = this.state.page + set ;
    if (nowpage < 0){
      nowpage = 0;
    }
    if(!result[nowpage]&result[nowpage]!=0){
      nowpage = nowpage-5;
    }
    let number = (nowpage/5)+1
    this.setState({ page: nowpage });
    this.setState({pagenum: "第"+ number +"頁" })

    await this.setState({ 
      result1: result[nowpage],
      result2: result[nowpage+1],
      result3: result[nowpage+2],
      result4: result[nowpage+3],
      result5: result[nowpage+4] 
    });

    await this.setState({ 
        result1: [await this.GetTargetInfo(result[nowpage])],
        result2: [await this.GetTargetInfo(result[nowpage+1])],
        result3: [await this.GetTargetInfo(result[nowpage+2])],
        result4: [await this.GetTargetInfo(result[nowpage+3])],
        result5: [await this.GetTargetInfo(result[nowpage+4])] 
    });

    if(!result[nowpage+5]){
       await this.setState({pagenum: "第"+ number +"頁 已達最終頁" })
     }

    if(result[nowpage]||result[nowpage]==0){
      this.setState({ dlbutton1:<button type="button" onClick={() => {this.FileDownload(result[nowpage])}}> 下載檔案 </button> });
    }
    if(result[nowpage+1]){
      this.setState({ dlbutton2:<button type="button" onClick={() => {this.FileDownload(result[nowpage+1])}}> 下載檔案 </button>});
    }
    if(result[nowpage+2]){
      this.setState({ dlbutton3:<button type="button" onClick={() => {this.FileDownload(result[nowpage+2])}}> 下載檔案 </button>});
    }
    if(result[nowpage+3]){
      this.setState({ dlbutton4:<button type="button" onClick={() => {this.FileDownload(result[nowpage+3])}}> 下載檔案 </button>});
    }
    if(result[nowpage+4]){
      this.setState({ dlbutton5:<button type="button" onClick={() => {this.FileDownload(result[nowpage+4])}}> 下載檔案 </button>});
    }
    

  };

  StartSearch = async () => {
    
    const { accounts, contract } = this.state;
    await this.setState({ page: 0 });
    await this.setState({ pagenum: "第"+ 1 +"頁" });
    await this.setState({            
      result1:null,
      result2:null,
      result3:null,
      result4:null,
      result5:null});

    const address = this.state.enteraddres;

    let startget = [];

    const sharedlist = await contract.methods.getsharedfile(accounts[0]).call();
    const length = sharedlist.length;
    for (let i=0; i<length; i++) {

      const stp = await contract.methods.getsharetype(sharedlist[i]).call();

      if (stp!=0){
        startget.push(sharedlist[i]);
      }   

    }

    await this.setState({ resultarray:startget });

    if (address){
      await this.GetSearchUploaderResult();

    }

    await this.ShowResult();

  };

  GetSearchUploaderResult = async () => {
    const RP = this.state.page ; //Result Page
    const { accounts, contract, resultarray } = this.state;
    let uparray = [];

    const searchupd = await this.state.enteraddres;
    const length = resultarray.length;

    for (let i=0; i<length; i++) {

      var upd = await contract.methods.getaddr(resultarray[i]).call();

      if (upd==searchupd){
        uparray.push(resultarray[i]);
      }   

    }    

    await this.setState({ resultarray:uparray });

  };

  ShowResult = async () => {

    const { accounts, contract, resultarray } = this.state;

    await this.setState({ 
      result1: [await this.GetTargetInfo(resultarray[0])],
      result2: [await this.GetTargetInfo(resultarray[1])],
      result3: [await this.GetTargetInfo(resultarray[2])],
      result4: [await this.GetTargetInfo(resultarray[3])],
      result5: [await this.GetTargetInfo(resultarray[4])] 
     });

    await this.setState({ pageswitch: <JS7_ButtonSwithResultPage set = {this.pageset} /> });


    if(!resultarray[0]&resultarray[0]!=0){
      await this.setState({ pageswitch: "查無搜尋結果" , pagenum: null });
      await this.setState({ selectinfo: null });

    }

    this.setState({ 
      dlbutton1: null, 
      dlbutton2: null, 
      dlbutton3: null, 
      dlbutton4: null, 
      dlbutton5: null
    });

    if(resultarray[0]||resultarray[0]==0){
        this.setState({ dlbutton1:<button type="button" onClick={() => {this.FileDownload(resultarray[0])}}> 下載檔案 </button>});
    }

    if(resultarray[1]){
        this.setState({ dlbutton2:<button type="button" onClick={() => {this.FileDownload(resultarray[1])}}> 下載檔案 </button>});
    }
    if(resultarray[2]){
        this.setState({ dlbutton3:<button type="button" onClick={() => {this.FileDownload(resultarray[2])}}> 下載檔案 </button>});
    }
    if(resultarray[3]){
        this.setState({ dlbutton4:<button type="button" onClick={() => {this.FileDownload(resultarray[3])}}> 下載檔案 </button>});
    }
    if(resultarray[4]){
        this.setState({ dlbutton5:<button type="button" onClick={() => {this.FileDownload(resultarray[4])}}> 下載檔案 </button>});
    }
    
  };

  GetTargetInfo = async (cgid) => {


    try {

        const { accounts, contract } = this.state;
        const getid = cgid;
    
        const ethname = await contract.methods.getname(getid).call();
        const ethuploader = await contract.methods.getaddr(getid).call();
        const ethkeyword = await contract.methods.getkword(getid).call();
        const ethtime = await contract.methods.gettime(getid).call();
      
        const unixTime = ethtime;
        let unix_timestamp = ethtime;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        
        var formattedTime = date.toLocaleDateString("zh-TW") + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    
        this.setState({ eid: getid });
        this.setState({ ename: ethname });
    
        this.setState({ ekeyword: ethkeyword });
        this.setState({ etime: formattedTime });
    
        let info = [];
        info.push("編號："+getid);  
        info.push(" 名稱:"+ethname);
        info.push(" 上傳者:"+ethuploader);  
        info.push(" 關鍵字："+ethkeyword);  
        info.push(" 上傳時間:"+formattedTime);  
    
        return info;

    } catch (error) {
        return null;
    }

  };

  Utf8ArrayToStr = async (array) => {
    
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
      c = array[i++];
      switch(c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx 10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx 10xx xxxx 10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
          break;
        default:
          break;
      }
    }
    return out;
  }

  FileDownload = async (id) => {

        
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    const { accounts, contract, cryptocontract, ethkey } = this.state;
    await contract.methods.setdownloadlog(id, accounts[0]).send({ from: accounts[0] });
    let setlog = 0;
    let dldone = 2;
    await this.setState({ dlinfo: "下載中，請等待" });
    var enckey;
    var shareadd1 = await contract.methods.getshare(id,1).call() ;
    var shareadd2 = await contract.methods.getshare(id,2).call() ;
    var shareadd3 = await contract.methods.getshare(id,3).call() ;
    const cid = await contract.methods.getinfocrypto(accounts[0]).call();
    if(accounts[0]==shareadd1){
      enckey = await cryptocontract.methods.gettype2(cid).call();
    }
    if(accounts[0]==shareadd2){
      enckey = await cryptocontract.methods.gettype3(cid).call();
    }
    if(accounts[0]==shareadd3){
      enckey = await cryptocontract.methods.gettype4(cid).call();
    }
      
        const fileUrl = await contract.methods.getinfohash(accounts[0]).call();
        const dfilename = await contract.methods.getname(id).call();
        var keyvalue1 = await this.state.keyvalue;
        var keyvalue2 = await this.decryptkeydata(enckey);

        const catfile = await client.cat(fileUrl);

        let data = '';

        try{
          for await (const cat of catfile) {    
      
            let strContent = await this.Utf8ArrayToStr(cat);      
            data += await strContent;
            dldone = 1;

            await this.setState({ dlinfo: "點選確認執行Smart Contract後解密" });
            }

        }catch(error){

            await this.setState({ dlinfo: "點選確認執行Smart Contract後解密" });
        }

        try{
          await contract.methods.setDLresult(accounts[0], dldone).send({ from: accounts[0] });
          setlog = 1;
        }catch(error){
          setlog = 0;
        }

        if((dldone == 1)&&(setlog == 1)){
            try{
            var key = sha256(keyvalue1+keyvalue2).toString();       
            var wordArray = CryptoJS.AES.decrypt(data, key);
            var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];             
            var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
            var uInt8Array = new Uint8Array(length), index=0, word, i;
            for (i=0; i<length; i++) {
              word = arrayOfWords[i];
              uInt8Array[index++] = word >> 24;
              uInt8Array[index++] = (word >> 16) & 0xff;
              uInt8Array[index++] = (word >> 8) & 0xff;
              uInt8Array[index++] = word & 0xff;             
            }
            var fileDec = new Blob([uInt8Array]);  
            var a = document.createElement("a");
            var url = window.URL.createObjectURL(fileDec);
            var filename = dfilename;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url); 

            await this.setState({ dlinfo: "檔案解密完成" });
            }catch(error){

            }
        }else if(setlog == 1){
            await this.setState({ dlinfo: "檔案下載失敗" });
        }

  };

  decryptkeydata = async (enckeydata) => { 

    const { accounts, contract, ethkey} = this.state;

    const encob = EthCrypto.cipher.parse(enckeydata);

    const decdata = await EthCrypto.decryptWithPrivateKey(
      ethkey,
      encob
    );
    
    return decdata;


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
      <div className="JS9_FileShareCheck">
        <ul><li><Link to = "/start">返回上一頁</Link></li></ul>
        <h2><Link to = "/filemanage" onClick={() => window.location.href="/filemanage"}>上傳檔案管理 /</Link><Link to = "/sharecheck" onClick={() => window.location.href="/sharecheck"}>/ 受分享檔案清單</Link></h2>
        <h1>受分享檔案清單</h1>

        <div>上傳者搜尋：<input type="text" value={this.state.enteraddres} onChange={this.SearchUploader} /> </div>

        <div><button type="button" onClick={this.StartSearch}> 篩選 </button> </div>
        <div>下載檔案前請輸入私鑰：<input type="text" value={this.state.ethkey} onChange={this.EnterKey} /></div>

        <div>檔案列表：</div>
        <div> {this.state.pageswitch} {this.state.pagenum}</div>
        <div> {this.state.result1}{this.state.dlbutton1} </div>
        <div> {this.state.result2}{this.state.dlbutton2} </div>
        <div> {this.state.result3}{this.state.dlbutton3} </div>
        <div> {this.state.result4}{this.state.dlbutton4} </div>
        <div> {this.state.result5}{this.state.dlbutton5} </div>
        <div> {this.state.dlinfo}<br></br></div>
        

      </div>
    );
  }
}

export default JS9_FileShareCheck;
