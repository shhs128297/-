import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import FileCryptoContract from "./contracts/FileCrypto.json";
import AllContract from "./contracts/AllContract.json";
import getWeb3 from "./getWeb3";
import JS7_ButtonSwithResultPage from './JS7_ButtonSwithResultPage';
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";
import { create } from 'ipfs-http-client';
import "./App.css";
import EthCrypto from 'eth-crypto';

class JS8_FileManage extends Component {
  state = { storageValue: null, 
            web3: null, 
            accounts: null, 
            contract: null,
            cryptocontract: null, 
            entername:null,
            enterkword1: null,
            enterkword2: null,
            enterkword3: null,
            kwordlogic:"AND", 
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
            rmbutton1:null,
            rmbutton2:null,
            rmbutton3:null,
            rmbutton4:null,
            rmbutton5:null,
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
            keyvalue:"28472B4B6150645367566B5970337336763979244226452948404D6351655468",
            ethkey:null,
            reuploadfile:null,
            reuploadinfo:null

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
    await this.setState({ enteraddres: account });
    await this.StartSearch();

  };

  SearchName = async (event) => {

    try {
        this.setState({ entername: event.target.value });
    } catch (error) {
        this.setState({ entername: null });
    }  
 
  };

  SearchKeyword1 = async (event) => {

    try {
        this.setState({ enterkword1: event.target.value });
    } catch (error) {
        this.setState({ enterkword1: null });
    }  
 
  };

  SearchKeyword2 = async (event) => {

    try {
        this.setState({ enterkword2: event.target.value });
    } catch (error) {
        this.setState({ enterkword2: null });
    }  
 
  };

  SearchKeyword3 = async (event) => {

    try {
        this.setState({ enterkword3: event.target.value });
    } catch (error) {
        this.setState({ enterkword3: null });
    }  
 
  };

  pageset = async (set) => {

    const result = this.state.resultarray;
    this.setState({ 
      getbuton1: null, dlbutton1: null, rmbutton1:null,
      getbuton2: null, dlbutton2: null, rmbutton2:null,
      getbuton3: null, dlbutton3: null, rmbutton3:null,
      getbuton4: null, dlbutton4: null, rmbutton4:null,
      getbuton5: null, dlbutton5: null, rmbutton5:null
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
      this.setState({ getbuton1:<button type="button" onClick={() => {this.GetFileLog(result[nowpage])}}> 取得檔案歷程紀錄 </button> ,
                      dlbutton1:<button type="button" onClick={() => {this.FileDownload(result[nowpage])}}> 下載檔案 </button> ,
                      rmbutton1:<button type="button" onClick={() => {this.FileDelete(result[nowpage])}}> 停止分享檔案 </button>});
    }
    if(result[nowpage+1]){
      this.setState({ getbuton2:<button type="button" onClick={() => {this.GetFileLog(result[nowpage+1])}}> 取得檔案歷程紀錄 </button> ,
                      dlbutton2:<button type="button" onClick={() => {this.FileDownload(result[nowpage+1])}}> 下載檔案 </button> ,
                      rmbutton2:<button type="button" onClick={() => {this.FileDelete(result[nowpage+1])}}> 停止分享檔案 </button> });
    }
    if(result[nowpage+2]){
      this.setState({ getbuton3:<button type="button" onClick={() => {this.GetFileLog(result[nowpage+2])}}> 取得檔案歷程紀錄 </button> , 
                      dlbutton3:<button type="button" onClick={() => {this.FileDownload(result[nowpage+2])}}> 下載檔案 </button> ,
                      rmbutton3:<button type="button" onClick={() => {this.FileDelete(result[nowpage+2])}}> 停止分享檔案 </button>});
    }
    if(result[nowpage+3]){
      this.setState({ getbuton4:<button type="button" onClick={() => {this.GetFileLog(result[nowpage+3])}}> 取得檔案歷程紀錄 </button> , 
                      dlbutton4:<button type="button" onClick={() => {this.FileDownload(result[nowpage+3])}}> 下載檔案 </button> ,
                      rmbutton4:<button type="button" onClick={() => {this.FileDelete(result[nowpage+3])}}> 停止分享檔案 </button>});
    }
    if(result[nowpage+4]){
      this.setState({ getbuton5:<button type="button" onClick={() => {this.GetFileLog(result[nowpage+4])}}> 取得檔案歷程紀錄 </button> , 
                      dlbutton5:<button type="button" onClick={() => {this.FileDownload(result[nowpage+4])}}> 下載檔案 </button> ,
                      rmbutton5:<button type="button" onClick={() => {this.FileDelete(result[nowpage+4])}}> 停止分享檔案 </button>});
    }
    

  };

  StartSearch = async () => {
    
    await this.setState({ page: 0 });
    await this.setState({ pagenum: "第"+ 1 +"頁" });
    await this.setState({            
      result1:null,
      result2:null,
      result3:null,
      result4:null,
      result5:null});
    const name = this.state.entername;
    const keyword1 = this.state.enterkword1;
    const keyword2 = this.state.enterkword2;
    const keyword3 = this.state.enterkword3;
    const address = this.state.enteraddres;
    var nsearch = 0; 
    var ksearch = 0;
    var asearch = 0;

    if (name){
      await this.GetSearchNameResult();
      nsearch = 1 ;
    }
    if (keyword1||keyword2||keyword3){
      await this.GetSearchKeywordResult();
      ksearch = 1 ;
    }
    if (address){
      await this.GetSearchUploaderResult();
      asearch = 1 ;
    }

    await this.ShowResult(nsearch, ksearch, asearch);
  };


  GetSearchNameResult = async () => {
    const RP = this.state.page ; //Result Page
    const { accounts, contract } = this.state;
    let startget = [];

    const ownfilelist = await contract.methods.getownfile(accounts[0]).call();
    const length = ownfilelist.length;
    const searchname = await this.state.entername;

    for (let i=0; i<length; i++) {

      const stp = await contract.methods.getsharetype(ownfilelist[i]).call();
      if(stp!=0){

        const filename = await contract.methods.getname(ownfilelist[i]).call();
        if (searchname.indexOf(filename)!= -1 ){
          startget.push(ownfilelist[i]);
        } 
      }
    }


    await this.setState({ namearray:startget});

  };


  GetSearchKeywordResult = async () => {
    const RP = this.state.page; //Result Page
    const { accounts, contract } = this.state;
    let startget1 = [];
    let startget2 = [];
    let startget3 = [];
    let enter1 = 0 ;
    let enter2 = 0 ;
    let enter3 = 0 ;

    const ownfilelist = await contract.methods.getownfile(accounts[0]).call();
    const length = ownfilelist.length;
    if(this.state.enterkword1){
      enter1 = 1 ;
    }
    if(this.state.enterkword2){
      enter2 = 1 ;      
    }
    if(this.state.enterkword3){
      enter3 = 1 ;      
    }
    const searchkword1 = await this.state.enterkword1 + ",";
    const searchkword2 = await this.state.enterkword2 + ",";
    const searchkword3 = await this.state.enterkword3 + ",";

    for (let i=0; i<length; i++) {

      const stp = await contract.methods.getsharetype(ownfilelist[i]).call();
      if(stp!=0){

        const filekword = await contract.methods.getkword(ownfilelist[i]).call() + ",";
        if (filekword.indexOf(searchkword1)!= -1 ){
          startget1.push(ownfilelist[i]);
        }
        if (filekword.indexOf(searchkword2)!= -1 ){
          startget2.push(ownfilelist[i]);
        }
        if (filekword.indexOf(searchkword3)!= -1 ){
          startget3.push(ownfilelist[i]);
        }
        
      }

    }

    if (enter1 == 0){
      if (enter2 == 0){
        startget1 = startget3;
      }
      else{
        startget1 = startget2;
      }
    }

    if (enter2 == 0){
      if (enter1 == 0){
        startget2 = startget3;
      }
      else{
        startget2 = startget1;
      }
    }

    if (enter3 == 0){
      if (enter1 == 0){
        startget3 = startget2;
      }
      else{
        startget3 = startget1;
      }
    }
    
    const logic = await this.state.kwordlogic;
    if(logic=="AND"){

      var and12 = startget1.filter(function(val) {
        return startget2.indexOf(val) != -1;
      });
    
      var and123 = and12.filter(function(val) {
        return startget3.indexOf(val) != -1;
      });

      await this.setState({ keywordarray:and123}); 

    }

    if(logic=="OR"){

      const or12 = startget1.concat(startget2);
      const or123 = or12.concat(startget3);
      let or = or123.filter(function (element, index, self) {
        return self.indexOf(element) === index;
       });
      await this.setState({ keywordarray:or});

    }

  };


  GetSearchUploaderResult = async () => {
    const RP = this.state.page ; //Result Page
    const { accounts, contract } = this.state;
    let startget = [];

    const ownfilelist = await contract.methods.getownfile(accounts[0]).call();
    const length = ownfilelist.length;
    const searchupd = await this.state.enteraddres;

    for (let i=0; i<length; i++) {

      const stp = await contract.methods.getsharetype(ownfilelist[i]).call();

      if (stp!=0){
        startget.push(ownfilelist[i]);
      }   

    }
 

    await this.setState({ accountarray:startget});
 
  };

  ShowResult = async (nsearch, ksearch, asearch) => {
    var nameresult = this.state.namearray;
    var keywordresult = this.state.keywordarray;
    var accountresult = this.state.accountarray;

    if (nsearch == 0){
      if (ksearch == 0){
        nameresult = accountresult;
      }
      else{
        nameresult = keywordresult;
      }
    }

    if (ksearch == 0){
      if (nsearch == 0){
        keywordresult = accountresult;
      }
      else{
        keywordresult = nameresult;
      }
    }

    if (asearch == 0){
      if (nsearch == 0){
        accountresult = keywordresult;
      }
      else{
        accountresult = nameresult;
      }
    }

    var nk = nameresult.filter(function(val) {
      return keywordresult.indexOf(val) != -1;
    });

    var nka = nk.filter(function(val) {
      return accountresult.indexOf(val) != -1;
    });

    await this.setState({ selectinfo: "選取檔案：" });


    await this.setState({ resultarray:nka });



    await this.setState({ 
      result1: [await this.GetTargetInfo(nka[0])],
      result2: [await this.GetTargetInfo(nka[1])],
      result3: [await this.GetTargetInfo(nka[2])],
      result4: [await this.GetTargetInfo(nka[3])],
      result5: [await this.GetTargetInfo(nka[4])] 
     });

    await this.setState({ pageswitch: <JS7_ButtonSwithResultPage set = {this.pageset} /> });
    let selectarr = [];
    await this.setState({ selectarray: selectarr });
    //await this.ResultButton();

    if(!nka[0]&nka[0]!=0){
      await this.setState({ pageswitch: "查無搜尋結果" , pagenum: null });
      await this.setState({ selectinfo: null });

    }

    this.setState({ 
      getbuton1: null, dlbutton1: null, rmbutton1:null,
      getbuton2: null, dlbutton2: null, rmbutton2:null,
      getbuton3: null, dlbutton3: null, rmbutton3:null,
      getbuton4: null, dlbutton4: null, rmbutton4:null,
      getbuton5: null, dlbutton5: null, rmbutton5:null 
    });

    if(nka[0]||nka[0]==0){
        this.setState({ getbuton1:<button type="button" onClick={() => {this.GetFileLog(nka[0])}}> 取得檔案歷程紀錄 </button> ,
                        dlbutton1:<button type="button" onClick={() => {this.FileDownload(nka[0])}}> 下載檔案 </button> ,
                        rmbutton1:<button type="button" onClick={() => {this.FileDelete(nka[0])}}> 停止分享檔案 </button> });
    }

    if(nka[1]){
        this.setState({ getbuton2:<button type="button" onClick={() => {this.GetFileLog(nka[1])}}> 取得檔案歷程紀錄 </button> ,
                        dlbutton2:<button type="button" onClick={() => {this.FileDownload(nka[1])}}> 下載檔案 </button> ,
                        rmbutton2:<button type="button" onClick={() => {this.FileDelete(nka[1])}}> 停止分享檔案 </button>});
    }
    if(nka[2]){
        this.setState({ getbuton3:<button type="button" onClick={() => {this.GetFileLog(nka[2])}}> 取得檔案歷程紀錄 </button> , 
                        dlbutton3:<button type="button" onClick={() => {this.FileDownload(nka[2])}}> 下載檔案 </button>,
                        rmbutton3:<button type="button" onClick={() => {this.FileDelete(nka[2])}}> 停止分享檔案 </button>});
    }
    if(nka[3]){
        this.setState({ getbuton4:<button type="button" onClick={() => {this.GetFileLog(nka[3])}}> 取得檔案歷程紀錄 </button> , 
                        dlbutton4:<button type="button" onClick={() => {this.FileDownload(nka[3])}}> 下載檔案 </button>,
                        rmbutton4:<button type="button" onClick={() => {this.FileDelete(nka[3])}}> 停止分享檔案 </button>});
    }
    if(nka[4]){
        this.setState({ getbuton5:<button type="button" onClick={() => {this.GetFileLog(nka[4])}}> 取得檔案歷程紀錄 </button> , 
                        dlbutton5:<button type="button" onClick={() => {this.FileDownload(nka[4])}}> 下載檔案 </button>,
                        rmbutton5:<button type="button" onClick={() => {this.FileDelete(nka[4])}}> 停止分享檔案 </button>});
    }
    
  };



  GetTargetInfo = async (cgid) => {


    try {

        const { accounts, contract } = this.state;
        const getid = cgid;
    
        const ethname = await contract.methods.getname(getid).call();
        const ethkeyword = await contract.methods.getkword(getid).call();
        const ethtime = await contract.methods.gettime(getid).call();
        let sharetype = "";
        let sharelist = [];

        const ethsharetype = await contract.methods.getsharetype(getid).call();
        if(ethsharetype==1){
          sharetype = "公開";
        }
        if(ethsharetype==2){
          sharetype = "只限本人";
        }
        if(ethsharetype==3){
          for(let i=1; i<4; i++){
            
            const shareaccount = await contract.methods.getshare(cgid,i).call() ;
            if(shareaccount!=accounts[0]){
              sharelist.push(shareaccount+" ");            
            }   

          }
          sharetype = "指定對象："+ sharelist;

        }
      
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
        this.setState({ eshare: sharetype });
    
        let info = [];
        info.push("編號："+getid);  
        info.push(" 名稱:"+ethname);  
        info.push(" 關鍵字："+ethkeyword);  
        info.push(" 上傳時間:"+formattedTime); 
        info.push(" 分享類型:"+sharetype); 
    
        return info;

    } catch (error) {
        return null;
    }

  };

  GetFileLog = async (fid) => {

    
    const { accounts, contract } = this.state;
 
    let startget = [];
  
    const loglist = await contract.methods.getfileidtolog(fid).call();
    const length = loglist.length;
    for (let i=0; i<length; i++) {
        
        let luser = await contract.methods.getloguser(loglist[i]).call();
        let ltime = await contract.methods.getlogtime(loglist[i]).call();
        let ltype = await contract.methods.getlogtype(loglist[i]).call();
        let lresult = await contract.methods.getdlresult(loglist[i]).call();
        let unix_timestamp = ltime;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
    
        var formattedTime = date.toLocaleDateString("zh-TW") + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        startget.push("帳號:"+luser);
        startget.push("  時間:"+formattedTime);
        if(ltype==1){
          startget.push("  類型:瀏覽",<br></br>);
        }else if(ltype==2){
          startget.push("  類型:下載");
          if(lresult==1){
            startget.push("  下載結果:成功",<br></br>);
          }else if(lresult==2){
            startget.push("  下載結果:失敗",<br></br>);
          }
        }
        
      

    }

    this.setState({ logresult: startget });
    if(!startget[0]){
        this.setState({ logresult: "查無被瀏覽紀錄" });      
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
        const { accounts, contract, cryptocontract } = this.state;
        await contract.methods.setdownloadlog(id, accounts[0]).send({ from: accounts[0] });
        let setlog = 0;
        let dldone = 2;
        const cid = await contract.methods.getinfocrypto(accounts[0]).call();
        const stype = await contract.methods.getsharetype(id).call();
        var keyvalue2;
        if(stype!=1){
          var enckey = await cryptocontract.methods.gettype1(cid).call();
          keyvalue2 = await this.decryptkeydata(enckey);
        }else{
          keyvalue2 = await cryptocontract.methods.gettype1(cid).call();
        }
        await this.setState({ dlinfo: "下載中，請等待" });
          
            const fileUrl = await contract.methods.getinfohash(accounts[0]).call();
            const dfilename = await contract.methods.getname(id).call();
            var keyvalue1 = await this.state.keyvalue;
    
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

  onChangeShare = e => {

    const { accounts, contract } = this.state;

    this.setState({
      kwordlogic: e.target.value
    });

  };

  FileDelete = async (id) => {
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    const { accounts, contract} = this.state;
    try{
      await contract.methods.deletefile(id).send({ from: accounts[0] });
      const filehash = await contract.methods.ownerhash(id).call();
      await client.pin.rm(filehash);

    }catch(error){

    }

  }

  FileSelect = async (e) => {
    
    try {
        const rufile = e.target.files[0];
        await this.setState({ reuploadfile: rufile });

    } catch (error) {
 
        await this.setState({ reuploadfile: null });
        
    }  
  };

  ReUpload = async () => {
    const { reuploadfile} = this.state;
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    var url = "";
    const added = await client.add(reuploadfile,{
      pin: true  
    }) ;
    url = await `${added.path}`;
    if(url!=""){
      await this.setState({ reuploadinfo: "上傳完成" });
    }else{
      await this.setState({ reuploadinfo: "上傳失敗" });
    }
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
      <div className="JS8_FileManage">
        <ul><li><Link to = "/start">返回上一頁</Link></li></ul>
        <h2><Link to = "/filemanage" onClick={() => window.location.href="/filemanage"}>上傳檔案管理 /</Link><Link to = "/sharecheck" onClick={() => window.location.href="/sharecheck"}>/ 受分享檔案清單</Link></h2>
        <h1>上傳檔案管理</h1>
        <div>檔案名稱：<input type="text" value={this.state.entername} onChange={this.SearchName} /></div>
        

        <div>
          關鍵字搜尋：<input type="text" value={this.state.enterkword1} onChange={this.SearchKeyword1} />
          <input type="text" value={this.state.enterkword2} onChange={this.SearchKeyword2} />
          <input type="text" value={this.state.enterkword3} onChange={this.SearchKeyword3} />
          <label>AND</label>
          <input
          type="radio"
          value="AND"
          onChange={this.onChangeShare}
          checked={this.state.kwordlogic === "AND"}
          />
          <label>OR</label>
          <input
          type="radio"
          value="OR"
          onChange={this.onChangeShare}
          checked={this.state.kwordlogic === "OR"}
          />

        </div>
        
        

        <div><button type="button" onClick={this.StartSearch}> 篩選 </button> </div>
        <div>下載指定對象檔案前請輸入私鑰：<input type="text" value={this.state.ethkey} onChange={this.EnterKey} /></div>

        <div>檔案列表：</div>
        <div> {this.state.pageswitch} {this.state.pagenum}</div>
        <div> {this.state.result1}<br></br>{this.state.getbuton1}{this.state.dlbutton1}{this.state.rmbutton1} </div>
        <div> {this.state.result2}<br></br>{this.state.getbuton2}{this.state.dlbutton2}{this.state.rmbutton2} </div>
        <div> {this.state.result3}<br></br>{this.state.getbuton3}{this.state.dlbutton3}{this.state.rmbutton3} </div>
        <div> {this.state.result4}<br></br>{this.state.getbuton4}{this.state.dlbutton4}{this.state.rmbutton4} </div>
        <div> {this.state.result5}<br></br>{this.state.getbuton5}{this.state.dlbutton5}{this.state.rmbutton5} </div>
        <div> {this.state.dlinfo}<br></br></div>
        
        <div align="center">
            <h1> 檔案歷程紀錄  </h1>

            <div>{this.state.logresult}</div>

            
        </div>



      </div>

    );
  }
}

export default JS8_FileManage;
