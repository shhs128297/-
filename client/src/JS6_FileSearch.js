import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import FileCryptoContract from "./contracts/FileCrypto.json";
import AllContract from "./contracts/AllContract.json";
import getWeb3 from "./getWeb3";
import JS7_ButtonSwithResultPage from './JS7_ButtonSwithResultPage';
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";
import { create } from 'ipfs-http-client'

class JS6_FileSearch extends Component {
  state = { storageValue: null, 
            web3: null, 
            accounts: null, 
            contract: null, 
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
            rkword1:null,
            rkword2:null,
            rkword3:null,
            rkword4:null,
            rkword5:null,
            getbuton1:null,
            getbuton2:null,
            getbuton3:null,
            getbuton4:null,
            getbuton5:null,
            selectinfo:null,
            selectarray:null,
            eid:null,
            ename:null,
            euploader:null,
            ekeyword:null,
            etime:null,
            page:null,
            pagenum:null,
            pageswitch:null,
            togetlog:null,
            logresult:null,
            s1: false,
            s2: false,
            s3: false,
            s4: false,
            s5: false,
            resultinfo1:null,
            resultinfo2:null,
            resultinfo3:null,
            resultinfo4:null,
            resultinfo5:null,
            keyvalue:"28472B4B6150645367566B5970337336763979244226452948404D6351655468",
            tt:null,
            dlc1:null,
            dlc2:null,
            dlc3:null,
            dlinfo:null,
            t98:null

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
    const { accounts, contract } = this.state;


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

  SearchUploader = async (event) => {

    try {
        this.setState({ enteraddres: event.target.value });
    } catch (error) {
        this.setState({ enteraddres: null });
    }  
 
  };

  SearchNowAccount = async () => {

    const account  = this.state.accounts;
    this.setState({ enteraddres: account });

 
  };

  pageset = async (set) => {

    const result = this.state.resultarray;
    const { accounts, contract } = this.state;

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


    if(!result[nowpage+5]){
       await this.setState({pagenum: "第"+ number +"頁 已達最終頁" })
     }
    
     try{
      const kword1 = await contract.methods.getkword(parseInt(result[nowpage], 10)).call();
      this.setState({rkword1:" 關鍵字：" + kword1 });
    }catch(error){
      this.setState({rkword1:null});
    } 

    try{
      const kword2 = await contract.methods.getkword(parseInt(result[nowpage+1], 10)).call();
      this.setState({rkword2:" 關鍵字：" + kword2 });
    }catch(error){
      this.setState({rkword2:null});
    } 

    try{
      const kword3 = await contract.methods.getkword(parseInt(result[nowpage+2], 10)).call();
      this.setState({rkword3:" 關鍵字：" + kword3 });
    }catch(error){
      this.setState({rkword3:null});
    } 

    try{
      const kword4 = await contract.methods.getkword(parseInt(result[nowpage+3], 10)).call();
      this.setState({rkword4:" 關鍵字：" + kword4 });
    }catch(error){
      this.setState({rkword4:null});
    } 

    try{
      const kword5 = await contract.methods.getkword(parseInt(result[nowpage+4], 10)).call();
      this.setState({rkword5:" 關鍵字：" + kword5 });
    }catch(error){
      this.setState({rkword5:null});
    } 
    
    

  };

  StartSearch = async () => {
    
    console.time('查詢時間');

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

    const length = await contract.methods.flength().call();
    const searchname = await this.state.entername;

    for (let i=0; i<length; i++) {

      const sharetype = await contract.methods.getsharetype(i).call();
      if(sharetype==1){

        const filename = await contract.methods.getname(i).call();
        if (searchname.indexOf(filename)!= -1 ){
          startget.push(i);
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

    const length = await contract.methods.flength().call();
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

      const sharetype = await contract.methods.getsharetype(i).call();
      if(sharetype==1){

        const filekword = await contract.methods.getkword(i).call() + ",";
        if (filekword.indexOf(searchkword1)!= -1 ){
          startget1.push(i);
        }
        if (filekword.indexOf(searchkword2)!= -1 ){
          startget2.push(i);
        }
        if (filekword.indexOf(searchkword3)!= -1 ){
          startget3.push(i);
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

    const length = await contract.methods.flength().call();
    const searchupd = await this.state.enteraddres;

    
    for (let i=0; i<length; i++) {

      const sharetype = await contract.methods.getsharetype(i).call();
      if(sharetype==1){

        const fileupd = await contract.methods.getaddr(i).call();

        if (fileupd == searchupd){
          startget.push(i);
        } 

      }

    };     
 
    await this.setState({ accountarray:startget});
 
  };

  ShowResult = async (nsearch, ksearch, asearch) => {
    const { accounts, contract } = this.state;
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
      result1: nka[0],
      result2: nka[1],
      result3: nka[2],
      result4: nka[3],
      result5: nka[4] 
     });

    await this.setState({ pageswitch: <JS7_ButtonSwithResultPage set = {this.pageset} /> });
    let selectarr = [];
    await this.setState({ selectarray: selectarr });


    if(!nka[0]&nka[0]!=0){
      await this.setState({ pageswitch: "查無搜尋結果" , pagenum: null });
      await this.setState({ selectinfo: null });

    }

    const parsed = parseInt(nka[0], 10);

    try{
      const kword1 = await contract.methods.getkword(parseInt(nka[0], 10)).call();
      this.setState({rkword1:" 關鍵字：" + kword1 });
    }catch(error){
      this.setState({rkword1:null});
    } 

    try{
      const kword2 = await contract.methods.getkword(parseInt(nka[1], 10)).call();
      this.setState({rkword2:" 關鍵字：" + kword2 });
    }catch(error){
      this.setState({rkword2:null});
    } 

    try{
      const kword3 = await contract.methods.getkword(parseInt(nka[2], 10)).call();
      this.setState({rkword3:" 關鍵字：" + kword3 });
    }catch(error){
      this.setState({rkword3:null});
    } 

    try{
      const kword4 = await contract.methods.getkword(parseInt(nka[3], 10)).call();
      this.setState({rkword4:" 關鍵字：" + kword4 });
    }catch(error){
      this.setState({rkword4:null});
    } 

    try{
      const kword5 = await contract.methods.getkword(parseInt(nka[4], 10)).call();
      this.setState({rkword5:" 關鍵字：" + kword5 });
    }catch(error){
      this.setState({rkword5:null});
    } 

    console.timeEnd('查詢時間');
    
  };

  GetTargetInfo = async (cgid) => {

    const { accounts, contract } = this.state;
    const getid = cgid;
    let finfo = [];

    const ethname = await contract.methods.getname(getid).call();
    const ethuploader = await contract.methods.getaddr(getid).call();
    const ethkeyword = await contract.methods.getkword(getid).call();
    const ethtime = await contract.methods.gettime(getid).call();
    const ethkb = await contract.methods.getsize(getid).call();
  
    const unixTime = ethtime;
    let unix_timestamp = ethtime;
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    
    var formattedTime = date.toLocaleDateString("zh-TW") + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

           
    finfo.push("檔案編號:"+getid,<br></br>);
    finfo.push("檔案名稱:"+ethname,<br></br>);
    finfo.push("檔案大小(KB):"+ethkb,<br></br>);
    finfo.push("上傳者:"+ethuploader,<br></br>);
    finfo.push("關鍵字:"+ethkeyword,<br></br>);
    finfo.push("上傳時間:"+formattedTime,<p></p>);

    if(!this.state.resultinfo1){
      this.setState({ resultinfo1: finfo, getbuton1:<button type="button" onClick={() => {this.FileDownload(getid)}}> 下載檔案 </button> });
    }else{
      if(!this.state.resultinfo2){
        this.setState({ resultinfo2: finfo, getbuton2:<button type="button" onClick={() => {this.FileDownload(getid)}}> 下載檔案 </button>  });
      }else{
        if(!this.state.resultinfo3){
          this.setState({ resultinfo3: finfo, getbuton3:<button type="button" onClick={() => {this.FileDownload(getid)}}> 下載檔案 </button>  });
        }else{
          if(!this.state.resultinfo4){
            this.setState({ resultinfo4: finfo, getbuton4:<button type="button" onClick={() => {this.FileDownload(getid)}}> 下載檔案 </button>  });
          }else{
            if(!this.state.resultinfo5){
              this.setState({ resultinfo5: finfo, getbuton5:<button type="button" onClick={() => {this.FileDownload(getid)}}> 下載檔案 </button>  });
            }else{              
              const r2 = this.state.resultinfo2;
              const r3 = this.state.resultinfo3;
              const r4 = this.state.resultinfo4;
              const r5 = this.state.resultinfo5;
              this.setState({ resultinfo1:r2,
                              resultinfo2:r3,
                              resultinfo3:r4,
                              resultinfo4:r5,
                              resultinfo5:finfo,
                              getbuton5:<button type="button" onClick={() => {this.FileDownload(getid)}}> 下載檔案 </button>                              
               });
            }

          }
        }
      }
    }
 

  };

  GetSelectInfo = async () => {
    const { accounts, contract } = this.state;
    const { s1, s2, s3, s4, s5, result1, result2, result3, result4, result5 } = this.state;
    let idarray = [0,0,0,0,0,0,0,0,0,0];
    let setlog = 0;
    if(s1&&(result1||result1==0)){
      idarray[0] = 1;
      idarray[5] = result1;
    }
    if(s2&&result2){
      idarray[1] = 1;
      idarray[6] = result2;
    }
    if(s3&&result3){
      idarray[2] = 1;
      idarray[7] = result3;
    }
    if(s4&&result4){
      idarray[3] = 1;
      idarray[8] = result4;
    }
    if(s5&&result5){
      idarray[4] = 1;
      idarray[9] = result5;
    }

    try{
      await contract.methods.setlog(idarray, accounts[0]).send({ from: accounts[0] });
      setlog = 1;
    }catch(error){
      setlog = 0;
    }

      if(s1&&setlog==1){
        try{
          await this.GetTargetInfo(result1)
        }catch(error){
          this.setState({s1:false});
        } 
      }
  
      if(s2&&setlog==1){
        try{
          await this.GetTargetInfo(result2)
        }catch(error){
          this.setState({s2:false});
        } 
         
      }
  
      if(s3&&setlog==1){
        try{
          await this.GetTargetInfo(result3)
        }catch(error){
          this.setState({s3:false});
        }  
      }
  
      if(s4&&setlog==1){
        try{
          await this.GetTargetInfo(result4)
        }catch(error){
          this.setState({s4:false});
        }  
      }
  
      if(s5&&setlog==1){
        try{
          await this.GetTargetInfo(result5)
        }catch(error){
          this.setState({s5:false});
        }  
      }
    
      this.setState({tt:idarray});

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
    await this.setState({ dlinfo: "下載中，請等待" });
      
        const fileUrl = await contract.methods.getinfohash(accounts[0]).call();
        const dfilename = await contract.methods.getname(id).call();
        const cid = await contract.methods.getinfocrypto(accounts[0]).call();
        var keyvalue1 = await this.state.keyvalue;
        var keyvalue2 = await cryptocontract.methods.gettype1(cid).call();

        const catfile = await client.cat(fileUrl);

        let data = '';

        try{
          for await (const cat of catfile) {    
      
            let strContent = await this.Utf8ArrayToStr(cat);      
            data += await strContent;
            dldone = 1;
            await this.setState({ dlc2: data });
            await this.setState({ dlinfo: "點選確認執行Smart Contract後解密" });
            }

        }catch(error){
            await this.setState({ dlc2: "Q" });
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

            await this.setState({ dlc3: uInt8Array });
            await this.setState({ dlinfo: "檔案解密完成" });
            }catch(error){

            }
        }else if(setlog == 1){
            await this.setState({ dlc3: "dlfailed" });
            await this.setState({ dlinfo: "檔案下載失敗" });
        }
              
    };

  handleChange =  (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  }

  onChangeShare = e => {

    const { accounts, contract } = this.state;

    this.setState({
      kwordlogic: e.target.value
    });

  };

  
  render() {
    if (!this.state.web3) {
      return <div align="center" >Loading Web3, accounts, and contract...(等待過久請重新整理)</div>;
    }
    return (
      <div className="JS6_FileSearch">        
        <ul><li><Link to = "/start">返回上一頁</Link></li></ul>        
        <h1>檔案查詢</h1>
        <div>檔案名稱搜尋：<input type="text" value={this.state.entername} onChange={this.SearchName} /></div>
        

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
        

        <div>上傳者搜尋：<input type="text" value={this.state.enteraddres} onChange={this.SearchUploader} /> <button type="button" onClick={this.SearchNowAccount}> 使用現在帳號 </button></div>
        

        <div><button type="button" onClick={this.StartSearch}> 搜尋 </button> </div>

        <div>結果(吻合的檔案編號)：</div>
        <div> {this.state.pageswitch} {this.state.pagenum}</div>        
        
        <div><input type="checkbox" name="s1" checked={this.state.s1} onChange={this.handleChange}/>{this.state.result1}{this.state.rkword1} </div> 
        <div><input type="checkbox" name="s2" checked={this.state.s2} onChange={this.handleChange}/>{this.state.result2}{this.state.rkword2} </div>
        <div><input type="checkbox" name="s3" checked={this.state.s3} onChange={this.handleChange}/>{this.state.result3}{this.state.rkword3} </div>
        <div><input type="checkbox" name="s4" checked={this.state.s4} onChange={this.handleChange}/>{this.state.result4}{this.state.rkword4} </div>
        <div><input type="checkbox" name="s5" checked={this.state.s5} onChange={this.handleChange}/>{this.state.result5}{this.state.rkword5} </div>
        <div><button type="button" onClick={this.GetSelectInfo}> 取得勾選的檔案資訊 </button> </div>      

        <div align="center">
            <h1> 檔案資訊  </h1>
            <div>下載狀況：{this.state.dlinfo}</div>

            <div>{this.state.resultinfo1}{this.state.getbuton1}</div>
            <div>{this.state.resultinfo2}{this.state.getbuton2}</div>
            <div>{this.state.resultinfo3}{this.state.getbuton3}</div>
            <div>{this.state.resultinfo4}{this.state.getbuton4}</div>
            <div>{this.state.resultinfo5}{this.state.getbuton5}</div>


            
        </div>




      </div>
    );
  }
}

export default JS6_FileSearch;
