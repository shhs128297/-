import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import FileCryptoContract from "./contracts/FileCrypto.json";
import IdentityContract from "./contracts/Identity.json";
import AllContract from "./contracts/AllContract.json";
import getWeb3 from "./getWeb3";
import JS3_IPFSupload from './JS3_IPFSupload';
import JS7_ButtonSwithResultPage from './JS7_ButtonSwithResultPage';
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";
import { create } from 'ipfs-http-client';
import EthCrypto from 'eth-crypto';


class JS4_FileUpload extends Component {
  state = { storageValue: null, 
            web3: null, 
            accounts: null, 
            contract: null,
            cryptocontract: null,
            identitycontract: null, 
            file: null, 
            filename: null,
            keyvalue:"28472B4B6150645367566B5970337336763979244226452948404D6351655468",
            keysc:null,
            encfile:null,
            encfilename:null,
            decfile:null,
            ipfsfile:null, 
            keyword: "", 
            upload: null,
            hash:null,
            notify:null,
            testname:null,
            testuploader:null,
            testkeyword:null,
            testtime:null,
            testhash:null,
            testshare:null,
            share:"公開",
            sharetype:1,
            sharevalue:null,
            sharetext:null,
            share1:null,
            share2:null,
            share3:null,
            maptesta:null,
            testalength:null,
            testtam:null,
            showtamp:null,
            findproject:null,
            fptitle:null,
            inputendinfo:null,
            inputend:null,
            inputareainfo:null,
            inputarea:null,
            storageinfo:null,
            projectcheck:null,
            findbutton:null,
            areaselect: "歐洲",
            area: 1,
            endplus:null,
            StEnd:null,
            cfsize:null,
            apidArray:[],
            acapArray:[],
            apriceArray:[],
            aservice1Array:[],
            aservice2Array:[],
            aservice3Array:[],
            aservice4Array:[],
            aendArray:[],
            aareaArray:[],
            changeEnd:null,
            changeComfirm:null,
            page:null,
            pagenum:null,
            pageswitch:null,
            result1:null,
            result2:null,
            result3:null,
            result4:null,
            result5:null,
            payment1:null,
            payment2:null,
            payment3:null,
            payment4:null,
            payment5:null,
            getbuton1:null,
            getbuton2:null,
            getbuton3:null,
            getbuton4:null,
            getbuton5:null,
            createpayment:null,
            getpayment:null,
            jobpayment:null,
            paybutton:null,
            ectest1:null,
            ectest2:null
                  
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

      const deployedNetwork3 = IdentityContract.networks[networkId];
      const instance3 = new web3.eth.Contract(
        IdentityContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance3 });
      this.setState({identitycontract: this.state.contract});

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
    let sharearray = [];
    sharearray[0]=accounts[0];

    //1，預設公開分享
    this.setState({ sharetype: 1 , sharevalue: sharearray });

  };

  pageset = async (set) => {

    const { accounts, contract, StEnd,
      apidArray, 
      acapArray,
      apriceArray,
      aservice1Array,
      aservice2Array,
      aservice3Array,
      aservice4Array,
      aendArray,
      aareaArray} = this.state;

    await this.setState({ 
        result1:"",
        result2:"",
        result3:"",
        result4:"",
        result5:"",
        payment1:"",
        payment2:"",
        payment3:"",
        payment4:"",
        payment5:"",
        getbuton1:"",
        getbuton2:"",
        getbuton3:"",
        getbuton4:"",
        getbuton5:"" });

    let nowpage = this.state.page + set ;

    if(!apidArray[nowpage]&apidArray[nowpage]!=0){
      nowpage = nowpage-5;
    }
    if (nowpage < 0){
      nowpage = 0;
    }
    let number = (nowpage/5)+1
    this.setState({ page: nowpage });
    this.setState({pagenum: "第"+ number +"頁" })

    var r1 = [];
    var r2 = [];
    var r3 = [];
    var r4 = [];
    var r5 = [];
    var p1 = "";
    var p2 = "";
    var p3 = "";
    var p4 = "";
    var p5 = "";

    if(apidArray[nowpage]){
      r1.push("儲存方案編號："+apidArray[nowpage]+" ");
      r1.push("剩餘容量："+acapArray[nowpage]+" ");
      r1.push("計費標準："+apriceArray[nowpage]+" ");
      r1.push("服務時段1："+aservice1Array[nowpage]+"~");
      r1.push(aservice2Array[nowpage]+" ");
      r1.push("服務時段2："+aservice3Array[nowpage]+"~");
      r1.push(aservice4Array[nowpage]+" ");
      r1.push("服務終止時限："+aendArray[nowpage]+" ");
      var pay1 = await this.billing(apidArray[nowpage],1);
      p1 = "應付費用(wei):"+pay1;
    }

    if(apidArray[nowpage+1]){
      r2.push("儲存方案編號："+apidArray[nowpage+1]+" ");
      r2.push("剩餘容量："+acapArray[nowpage+1]+" ");
      r2.push("計費標準："+apriceArray[nowpage+1]+" ");
      r2.push("服務時段1："+aservice1Array[nowpage+1]+"~");
      r2.push(aservice2Array[nowpage+1]+" ");
      r2.push("服務時段2："+aservice3Array[nowpage+1]+"~");
      r2.push(aservice4Array[nowpage+1]+" ");
      r2.push("服務終止時限："+aendArray[nowpage+1]+" ");
      var pay2 = await this.billing(apidArray[nowpage+1],2);
      p2 = "應付費用(wei):"+pay2;
    }

    if(apidArray[nowpage+2]){
      r3.push("儲存方案編號："+apidArray[nowpage+2]+" ");
      r3.push("剩餘容量："+acapArray[nowpage+2]+" ");
      r3.push("計費標準："+apriceArray[nowpage+2]+" ");
      r3.push("服務時段1："+aservice1Array[nowpage+2]+"~");
      r3.push(aservice2Array[nowpage+2]+" ");
      r3.push("服務時段2："+aservice3Array[nowpage+2]+"~");
      r3.push(aservice4Array[nowpage+2]+" ");
      r3.push("服務終止時限："+aendArray[nowpage+2]+" ");
      var pay3 = await this.billing(apidArray[nowpage+2],3);
      p3 = "應付費用(wei):"+pay3;
    }

    if(apidArray[nowpage+3]){
      r4.push("儲存方案編號："+apidArray[nowpage+3]+" ");
      r4.push("剩餘容量："+acapArray[nowpage+3]+" ");
      r4.push("計費標準："+apriceArray[nowpage+3]+" ");
      r4.push("服務時段1："+aservice1Array[nowpage+3]+"~");
      r4.push(aservice2Array[nowpage+3]+" ");
      r4.push("服務時段2："+aservice3Array[nowpage+3]+"~");
      r4.push(aservice4Array[nowpage+3]+" ");
      r4.push("服務終止時限："+aendArray[nowpage+3]+" ");
      var pay4 = await this.billing(apidArray[nowpage+3],4);
      p4 = "應付費用(wei):"+pay4;
    }

    if(apidArray[nowpage+4]){
      r5.push("儲存方案編號："+apidArray[nowpage+4]+" ");
      r5.push("剩餘容量："+acapArray[nowpage+4]+" ");
      r5.push("計費標準："+apriceArray[nowpage+4]+" ");
      r5.push("服務時段1："+aservice1Array[nowpage+4]+"~");
      r5.push(aservice2Array[nowpage+4]+" ");
      r5.push("服務時段2："+aservice3Array[nowpage+4]+"~");
      r5.push(aservice4Array[nowpage+4]+" ");
      r5.push("服務終止時限："+aendArray[nowpage+4]+" ");
      var pay5 = await this.billing(apidArray[nowpage+4],5);
      p5 = "應付費用(wei):"+pay5;
    }
  
    await this.setState({ 
      result1: r1,
      result2: r2,
      result3: r3,
      result4: r4,
      result5: r5 
     });

     var endt1 = StEnd.replace("/","");
     var endt2 = endt1.replace("/","");
     const endtime = parseInt(endt2,10);
     if(aendArray[nowpage]&&(endtime<aendArray[nowpage])){
      await this.setState({getbuton1: <button type="button" onClick={() => {this.SelectProject(apidArray[nowpage])}}> 選擇此方案 </button>});
     }
     if(aendArray[nowpage+1]&&(endtime<aendArray[nowpage+1])){
      await this.setState({getbuton2: <button type="button" onClick={() => {this.SelectProject(apidArray[nowpage+1])}}> 選擇此方案 </button>});
     }
     if(aendArray[nowpage+2]&&(endtime<aendArray[nowpage+2])){
      await this.setState({getbuton3: <button type="button" onClick={() => {this.SelectProject(apidArray[nowpage+2])}}> 選擇此方案 </button>});
     }
     if(aendArray[nowpage+3]&&(endtime<aendArray[nowpage+3])){
      await this.setState({getbuton4: <button type="button" onClick={() => {this.SelectProject(apidArray[nowpage+3])}}> 選擇此方案 </button>});
     }
     if(aendArray[nowpage+4]&&(endtime<aendArray[nowpage+4])){
      await this.setState({getbuton5: <button type="button" onClick={() => {this.SelectProject(apidArray[nowpage+4])}}> 選擇此方案 </button>});
     }

  };

  billing = async (pid, no) => {

    const { accounts, contract, StEnd, cfsize } = this.state;
    var date = new Date(Date.now());
    var hours = date.getHours();

    var nowyear = date.getFullYear();
    var nowmonth = date.getMonth()+1;
    var nowdate = date.getDate();
    const nownow = Date.parse(nowyear+"/"+nowmonth+"/"+nowdate)/1000;
    const endend = Date.parse(StEnd)/1000;
    let stime = await contract.methods.getServiceTime(pid).call();
    let price = await contract.methods.getPrice(pid).call(); 
    let d1hour = 0;
    if(hours >= stime[0]){
      if(hours < stime[1]){
        d1hour = stime[1] - hours + (stime[3] - stime[2]);
      }

    } else if(hours >= stime[2]){
      if(hours < stime[3]){
        d1hour = stime[1] - hours;
      }

    }
    let t1hour = stime[1] - stime[0];
    let t2hour = stime[3] - stime[2];
    let stday = (endend - nownow)/86400;
    let allhour = ( stday - 1) * (t1hour+t2hour);
    let bill = price * cfsize * (d1hour + allhour);

    let paymentb = "應支付費用："+bill;

    if(no==1){
      await this.setState({ payment1: paymentb });
    }
    if(no==2){
      await this.setState({ payment2: paymentb });
    }
    if(no==3){
      await this.setState({ payment3: paymentb });
    }
    if(no==4){
      await this.setState({ payment4: paymentb });
    }
    if(no==5){
      await this.setState({ payment5: paymentb });
    }
  
  };

  SelectProject = async (pid) => {
    const { accounts, contract, StEnd, cfsize, cfhash} = this.state;

    const endend = Date.parse(StEnd)/1000;
    var date = new Date(Date.now());
    var nowyear = date.getFullYear();
    var nowmonth = date.getMonth()+1;
    var nowdate = date.getDate();
    const nownow = Date.parse(nowyear+"/"+nowmonth+"/"+nowdate)/1000;
    var hours = date.getHours();
    var JobStart = nownow + (hours*3600);
    const fid = await contract.methods.getidnow(accounts[0]).call();

    await contract.methods.createJob(pid, fid, cfsize, cfhash, JobStart, endend, accounts[0]).send({ from: accounts[0] });
    await this.setState({ createpayment: <button type="button" onClick={() => {this.CreatePay()}}> 建立費用資訊 </button> });

  };

  CreatePay = async () => {

    const { accounts, contract} = this.state;
    const jid = await contract.methods.getjobid(accounts[0]).call();

    var date = new Date(Date.now());
    var nowyear = date.getFullYear();
    var nowmonth = date.getMonth()+1;
    var nowdate = date.getDate();
    const nownow = Date.parse(nowyear+"/"+nowmonth+"/"+nowdate)/1000;
    await contract.methods.preparecreate(jid, nownow).send({ from: accounts[0] });
    await this.setState({ getpayment: <button type="button" onClick={() => {this.GetPay(jid)}}> 取得應支付費用 </button> });

  }

  GetPay = async (jid) => {
    const { accounts, contract} = this.state;
    const pmid = await contract.methods.getpmid(jid).call();
    const waitpay = await contract.methods.getpayment(jid).call();
    await this.setState({ jobpayment: waitpay });
    await this.setState({ paybutton:<button type="button" onClick={() => {this.PayEther(pmid, jid)}}> 確認支付 </button> });

  };

  PayEther = async (pmid, jid) => {
    const { accounts, contract, jobpayment} = this.state;
    var date = new Date(Date.now());
    var nowyear = date.getFullYear();
    var nowmonth = date.getMonth()+1;
    var nowdate = date.getDate();
    const nownow = Date.parse(nowyear+"/"+nowmonth+"/"+nowdate)/1000;

    await contract.methods.Jobpay(pmid, jid, nownow).send({
      from: accounts[0],
      value: jobpayment // 1 ETH in wei
    });
  };

  EncryptReady = async () => {

    const { accounts, cryptocontract, identitycontract, sharetype } = this.state;
    
    if(this.state.keysc){

      const encfilename = await this.state.filename+".enc";
      await this.setState({ encfilename: encfilename });

      if(sharetype==1){

        const keysc = await this.state.keysc;
        await cryptocontract.methods.settype1(accounts[0], keysc ).send({ from: accounts[0] });         

        await this.setState({ upload: <JS3_IPFSupload encname = {this.state.encfilename} seturl = {this.GetHash} Complete = {this.CompleteInfo}/> });
      }else{

        const pubk1 = await identitycontract.methods.getpublickey(accounts[0]).call();
        var keydata1 = await this.encryptkeydata(pubk1);
//        await this.setState({ectest1:pubk1})
        var keydata2 = "";
        var keydata3 = "";
        var keydata4 = "";
        if(this.state.share1){
          const pubk2 = await identitycontract.methods.getpublickey(this.state.share1).call();
//          await this.setState({ectest2:pubk2})
          keydata2 = await this.encryptkeydata(pubk2);       
        }

        if(this.state.share2){
          const pubk3 = await identitycontract.methods.getpublickey(this.state.share2).call();
          keydata3 = await this.encryptkeydata(pubk3); 
        }

        if(this.state.share3){
          const pubk4 = await identitycontract.methods.getpublickey(this.state.share3).call();
          keydata4 = await this.encryptkeydata(pubk4);     
        }

        await cryptocontract.methods.settype2(accounts[0], keydata1, keydata2, keydata3, keydata4).send({ from: accounts[0] });         

        await this.setState({ upload: <JS3_IPFSupload encname = {this.state.encfilename} seturl = {this.GetHash} Complete = {this.CompleteInfo}/> });

      }
       
    }
    else{
        const ul = "請先加密檔案"; 
        this.setState({ upload: ul }); 
    }
  };

  encryptkeydata = async (pubkey) => { 

    const { keysc} = this.state;
    const secretob = await EthCrypto.encryptWithPublicKey(
      pubkey, // publicKey
      keysc // message
    );
    const secretdata = EthCrypto.cipher.stringify(secretob);
    
    return secretdata;
//    await contract.methods.register(accounts[0], secretword).send({ from: accounts[0] });

  };

  CompleteInfo = async (filehash, filekb) => {

        try {
            const { accounts, contract, cryptocontract } = this.state;
            const fhash = filehash;
            const fsize = filekb;
            const cid = await cryptocontract.methods.getcid(accounts[0]).call();

            const fname = this.state.filename; 
            const kword = this.state.keyword;
            const sharetype = this.state.sharetype;
            let share = this.state.sharevalue;
    
            //3，指定分享對象
            if(sharetype!=1){
                
                share[1]=this.state.share1;
                share[2]=this.state.share2;
                share[3]=this.state.share3;     
                
                //空的對象分配為上傳者
                if(!this.state.share1){
                  share[1] = accounts[0];      
                }
                if(!this.state.share2){
                  share[2] = accounts[0];       
                }
                if(!this.state.share3){
                  share[3] = accounts[0];      
                }
              
            }

            await contract.methods.createinfo(fname, accounts[0], kword, fsize, fhash, sharetype, share, cid).send({ from: accounts[0] });            

    
            this.setState({ notify: "Smart Contract已建立檔案資訊" }); 
            this.setState({ cfsize: fsize }); 
            this.setState({ cfhash: fhash }); 
            this.setState({findproject:<button type="button" onClick={() => {this.StartFindProject()}}> 開始仲介服務 </button>})

        } catch (error) {

            this.setState({ notify: "檔案未上傳，請先上傳" }); 

        } 
             
        

  };

  DownloadTest = async () => {

    const { accounts, contract} = this.state;

    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    const idnow = await contract.methods.getidnow(accounts[0]).call();

    await contract.methods.setdownloadlog(idnow, accounts[0]).send({ from: accounts[0] });
    var dlc = 0 ;
      
    const fileUrl = await contract.methods.getinfohash(accounts[0]).call();

    const catfile = await client.cat(fileUrl);
    try{
          for await (const cat of catfile) {    
              dlc = 1;
            }

    }catch(error){

    }
    return dlc ;              
  };

  StartFindProject = async () => {

    const dltest = await this.DownloadTest();

    if(dltest == 1){
      await this.setState({encfilename: "", encfile: "", upload: "", notify: "",
      storageinfo: "", inputend: "", inputarea: "", findbutton: "", projectcheck:"", changeEnd:"", changeComfirm:""});
  
      this.setState({ fptitle: <h1>仲介服務</h1>});
      this.setState({ inputend: <div>輸入儲存時限(YYYY/MM/DD)：<input type="text" value={this.state.StEnd} onChange={this.EnterEnd} /></div> });
      this.setState({ inputarea: <div>地區選擇：
        <label>歐洲</label>
        <input
          type="radio"
          value="歐洲"
          onChange={this.areaChange}
          checked={this.state.areaselect === "歐洲"}
        />
        <label>亞洲</label>
        <input
          type="radio"
          value="亞洲"
          onChange={this.areaChange}
          checked={this.state.areaselect === "亞洲"}
        />
        <label>美洲</label>
        <input
          type="radio"
          value="美洲"
          onChange={this.areaChange}
          checked={this.state.areaselect === "美洲"}
        />
        <label>非洲</label>
        <input
          type="radio"
          value="非洲"
          onChange={this.areaChange}
          checked={this.state.areaselect === "非洲"}
        />
        <label>大洋洲</label>
        <input
          type="radio"
          value="大洋洲"
          onChange={this.areaChange}
          checked={this.state.areaselect === "大洋洲"}
        />      
       </div>})
      this.setState({projectcheck: <button type="button" onClick={() => {this.Readyfindproject()}}> 確認 </button>});
    }
  };

  Readyfindproject = async () => {

    let stinfo = [];
    const stend = this.state.StEnd;
    const starea1 = this.state.area;
    const starea2 = this.state.areaselect;

    var date = new Date(Date.now());
    var nowyear = date.getFullYear();
    var nowmonth = date.getMonth()+1;
    var nowdate = date.getDate();
    const nownow = Date.parse(nowyear+"/"+nowmonth+"/"+nowdate)/1000;
    const endend = Date.parse(stend)/1000;
    let stday = (endend - nownow)/86400;

    stinfo.push("儲存時限:"+stend,<p></p>);
    stinfo.push("天數:"+stday,<p></p>);
    stinfo.push("地區:"+starea1+starea2,<p></p>);
    await this.setState({ storageinfo: stinfo });
    await this.setState({findbutton: <button type="button" onClick={() => {this.searchproject()}}> 查詢儲存方案 </button>}); 

    await this.setState({            
      apidArray:[],
      acapArray:[],
      apriceArray:[],
      aservice1Array:[],
      aservice2Array:[],
      aservice3Array:[],
      aservice4Array:[],
      aendArray:[],
      aareaArray:[]});

  };

  searchproject = async () => {
    const { accounts, contract, cfsize, StEnd, area} = this.state;

    var endt1 = StEnd.replace("/","");
    var endt2 = endt1.replace("/","");
    const endtime = parseInt(endt2,10);
    var date = new Date(Date.now());
    var hours = date.getHours();

    const availlength = await contract.methods.Availablelength().call();

    for (let i=0; i<availlength; i++) {

      try {
        var availarray = [];
        availarray = await contract.methods.getAvailable(i, cfsize, endtime, area, hours).call();

        var a1 = this.state.apidArray;
        var a2 = this.state.acapArray;
        var a3 = this.state.apriceArray;
        var a4 = this.state.aservice1Array;
        var a5 = this.state.aservice2Array;
        var a6 = this.state.aservice3Array;
        var a7 = this.state.aservice4Array;
        var a8 = this.state.aendArray;
        var a9 = this.state.aareaArray;

        await a1.push(availarray[0]);
        await a2.push(availarray[1]);
        await a3.push(availarray[2]);
        await a4.push(availarray[3][0]);
        await a5.push(availarray[3][1]);
        await a6.push(availarray[3][2]);
        await a7.push(availarray[3][3]);
        await a8.push(availarray[4]);
        await a9.push(availarray[5]);

        await this.setState({          
          apidArray: a1,
          acapArray: a2,
          apriceArray: a3,
          aservice1Array: a4,
          aservice2Array: a5,
          aservice3Array: a6,
          aservice4Array: a7,
          aendArray: a8,
          aareaArray: a9
        }); 

      } catch (error) {

      } 

    }

    await this.setState({ page: 0 });
    await this.setState({ pagenum: "第"+ 1 +"頁" });
    await this.setState({ pageswitch: <JS7_ButtonSwithResultPage set = {this.pageset} /> });
    await this.setState({ 
      result1:"",
      result2:"",
      result3:"",
      result4:"",
      result5:"",
      payment1:"",
      payment2:"",
      payment3:"",
      payment4:"",
      payment5:"",
      getbuton1:"",
      getbuton2:"",
      getbuton3:"",
      getbuton4:"",
      getbuton5:"" });

    await this.ShowAvailable();

  };

  ShowAvailable = async () => {

    await this.setState({ storageinfo: "", inputend: "", inputarea: "", findbutton: "", projectcheck:""});
    await this.setState({ changeEnd: <div>調整儲存時限天數：<input type="number" value={this.state.endplus} onChange={this.EnterEnd2} /></div> });
    await this.setState({ changeComfirm: <button type="button" onClick={() => {this.EndChange()}}> 確定 </button>});

    const { accounts, contract, StEnd,
      apidArray, 
      acapArray,
      apriceArray,
      aservice1Array,
      aservice2Array,
      aservice3Array,
      aservice4Array,
      aendArray,
      aareaArray} = this.state;

    var r1 = [];
    var r2 = [];
    var r3 = [];
    var r4 = [];
    var r5 = [];
    var p1 = "";
    var p2 = "";
    var p3 = "";
    var p4 = "";
    var p5 = "";
    if(apidArray[0]){
      r1.push("儲存方案編號："+apidArray[0]+" ");
      r1.push("剩餘容量："+acapArray[0]+" ");
      r1.push("計費標準："+apriceArray[0]+" ");
      r1.push("服務時段1："+aservice1Array[0]+"~");
      r1.push(aservice2Array[0]+" ");
      r1.push("服務時段2："+aservice3Array[0]+"~");
      r1.push(aservice4Array[0]+" ");
      r1.push("服務終止時限："+aendArray[0]+" ");
      var pay1 = await this.billing(apidArray[0],1);
      p1 = "應付費用(wei):"+pay1;
    }

    if(apidArray[1]){
      r2.push("儲存方案編號："+apidArray[1]+" ");
      r2.push("剩餘容量："+acapArray[1]+" ");
      r2.push("計費標準："+apriceArray[1]+" ");
      r2.push("服務時段1："+aservice1Array[1]+"~");
      r2.push(aservice2Array[1]+" ");
      r2.push("服務時段2："+aservice3Array[1]+"~");
      r2.push(aservice4Array[1]+" ");
      r2.push("服務終止時限："+aendArray[1]+" ");
      var pay2 = await this.billing(apidArray[1],2);
      p2 = "應付費用(wei):"+pay2;
    }

    if(apidArray[2]){
      r3.push("儲存方案編號："+apidArray[2]+" ");
      r3.push("剩餘容量："+acapArray[2]+" ");
      r3.push("計費標準："+apriceArray[2]+" ");
      r3.push("服務時段1："+aservice1Array[2]+"~");
      r3.push(aservice2Array[2]+" ");
      r3.push("服務時段2："+aservice3Array[2]+"~");
      r3.push(aservice4Array[2]+" ");
      r3.push("服務終止時限："+aendArray[2]+" ");
      var pay3 = await this.billing(apidArray[2],3);
      p3 = "應付費用(wei):"+pay3;
    }

  
    if(apidArray[3]){
      r4.push("儲存方案編號："+apidArray[3]+" ");
      r4.push("剩餘容量："+acapArray[3]+" ");
      r4.push("計費標準："+apriceArray[3]+" ");
      r4.push("服務時段1："+aservice1Array[3]+"~");
      r4.push(aservice2Array[3]+" ");
      r4.push("服務時段2："+aservice3Array[3]+"~");
      r4.push(aservice4Array[3]+" ");
      r4.push("服務終止時限："+aendArray[3]+" ");
      var pay4 = await this.billing(apidArray[3],4);
      p4 = "應付費用(wei):"+pay4;
    }

    if(apidArray[4]){
      r5.push("儲存方案編號："+apidArray[4]+" ");
      r5.push("剩餘容量："+acapArray[4]+" ");
      r5.push("計費標準："+apriceArray[4]+" ");
      r5.push("服務時段1："+aservice1Array[4]+"~");
      r5.push(aservice2Array[4]+" ");
      r5.push("服務時段2："+aservice3Array[4]+"~");
      r5.push(aservice4Array[4]+" ");
      r5.push("服務終止時限："+aendArray[4]+" ");
      var pay5 = await this.billing(apidArray[4],5);
      p5 = "應付費用(wei):"+pay5;
    }

    await this.setState({ 
      result1: r1,
      result2: r2,
      result3: r3,
      result4: r4,
      result5: r5 
     });

    var endt1 = StEnd.replace("/","");
    var endt2 = endt1.replace("/","");
     const endtime = parseInt(endt2,10);
     if(aendArray[0]&&(endtime<aendArray[0])){
      await this.setState({getbuton1: <button type="button" onClick={() => {this.SelectProject(apidArray[0])}}> 選擇此方案 </button>});
     }
     if(aendArray[1]&&(endtime<aendArray[1])){
      await this.setState({getbuton2: <button type="button" onClick={() => {this.SelectProject(apidArray[1])}}> 選擇此方案 </button>});
     }
     if(aendArray[2]&&(endtime<aendArray[2])){
      await this.setState({getbuton3: <button type="button" onClick={() => {this.SelectProject(apidArray[2])}}> 選擇此方案 </button>});
     }
     if(aendArray[3]&&(endtime<aendArray[3])){
      await this.setState({getbuton4: <button type="button" onClick={() => {this.SelectProject(apidArray[3])}}> 選擇此方案 </button>});
     }
     if(aendArray[4]&&(endtime<aendArray[4])){
      await this.setState({getbuton5: <button type="button" onClick={() => {this.SelectProject(apidArray[4])}}> 選擇此方案 </button>});
     }


  };

  EndChange = async () => {
    const { endplus, StEnd } = this.state;
    var endint = parseInt(endplus,10);
    const endstamp = Date.parse(StEnd)/1000;
    var newstamp = endstamp + (endint * 86400);
    var date = new Date(newstamp * 1000);
    var endyear = date.getFullYear();
    var endmonth = date.getMonth()+1;
    var enddate = date.getDate();
    const newend = endyear+"/"+endmonth.toString().padStart(2,'0')+"/"+enddate.toString().padStart(2,'0');

    await this.setState({StEnd: newend});
    await this.pageset(0);
  

  }   

  FileSelect = async (e) => {
    
    try {
        const filer = e.target.files[0];
        const filen = e.target.files[0].name;
        this.setState({ filename: filen });
        this.setState({ file: filer });

    } catch (error) {
        console.log('Error uploading file: ', error)
        this.setState({ filename: null });
        this.setState({ file: null });
    }  
  };

  EnterKeyword = async (event) => {

    try {
        this.setState({ keyword: event.target.value });
    } catch (error) {
        this.setState({ keyword: "" });
    }  
 
  };

  GetHash = (filehash) => {
    this.setState({ hash:filehash });
  };

  onChangeShare = e => {

    const { accounts, contract } = this.state;

    this.setState({
      share: e.target.value
    });
    if(e.target.value=="公開"){
      this.setState({sharetype: 1});
    }
    if(e.target.value=="只限本人"){
      this.setState({sharetype: 2});
    }
    if(e.target.value=="指定對象"){
      this.setState({sharetype: 3});

    }

  };

  SetShare1 = async (event) => {

    const { accounts, contract } = this.state;

    try {
        this.setState({ share1: event.target.value });
    } catch (error) {
        this.setState({ share1: accounts[0] });
    }  
 
  };
  SetShare2 = async (event) => {

    const { accounts, contract } = this.state;

    try {
        this.setState({ share2: event.target.value });
    } catch (error) {
        this.setState({ share2: accounts[0] });
    }  
 
  };
  SetShare3 = async (event) => {

    const { accounts, contract } = this.state;

    try {
        this.setState({ share3: event.target.value });
    } catch (error) {
        this.setState({ share3: accounts[0] });
    }  
 
  };




  EncryptFile = async () => {

    console.time('加密時間');
    var file = this.state.file;
    var keyvalue1 = this.state.keyvalue;

    let reader = new FileReader
    reader.readAsArrayBuffer(file);
    const scope = this;
    reader.onload = await function() {
      var wordArray = CryptoJS.lib.WordArray.create(reader.result);
      var keyvalue2 = sha256(wordArray).toString();
      var key = sha256(keyvalue1+keyvalue2).toString();
      scope.setState({ keysc: keyvalue2 });
      var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

      var fileEnc = new Blob([encrypted]);                                    // Create blob from string

      var a = document.createElement("a");
      var url = window.URL.createObjectURL(fileEnc);
      var filename = file.name + ".enc";
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      console.timeEnd('加密時間');
    }


  };

  DecryptFile = async () => {
    var file = this.state.file;
    var keyvalue1 = this.state.keyvalue;
    var keyvalue2 = this.state.decfile;

    let reader = new FileReader
    reader.readAsText(file);
    const scope = this;
    reader.onload = function() {

      
      var key = sha256(keyvalue1+keyvalue2).toString();
      
    var decrypted = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(reader.result, key)).toString("base64");
    scope.setState({ encfile: decrypted });
    }

  };

  dataURLtoFile = async (dataurl, filename) => {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
  };


  EnterEnd = async (event) => {

    try {
        this.setState({ StEnd: event.target.value });
    } catch (error) {
        this.setState({ StEnd: "" });
    }
 
  };

  EnterEnd2 = async (event) => {

    try {
        this.setState({ endplus: event.target.value });
    } catch (error) {
        this.setState({ endplus: "" });
    }
 
  };

  areaChange = async (e) => {

    const { accounts, contract } = this.state;

    await this.setState({
        areaselect: e.target.value
    });
    if(e.target.value=="歐洲"){
      await this.setState({area: 1});
    }
    if(e.target.value=="亞洲"){
      await this.setState({area: 2});
    }
    if(e.target.value=="美洲"){
      await this.setState({area: 3});
    }
    if(e.target.value=="非洲"){
      await this.setState({area: 4});
    }
    if(e.target.value=="大洋洲"){
      await this.setState({area: 5});
    }
       
    await this.setState({ inputarea: <div>地區選擇：
      <label>歐洲</label>
      <input
        type="radio"
        value="歐洲"
        onChange={this.areaChange}
        checked={this.state.areaselect === "歐洲"}
      />
      <label>亞洲</label>
      <input
        type="radio"
        value="亞洲"
        onChange={this.areaChange}
        checked={this.state.areaselect === "亞洲"}
      />
      <label>美洲</label>
      <input
        type="radio"
        value="美洲"
        onChange={this.areaChange}
        checked={this.state.areaselect === "美洲"}
      />
      <label>非洲</label>
      <input
        type="radio"
        value="非洲"
        onChange={this.areaChange}
        checked={this.state.areaselect === "非洲"}
      />
      <label>大洋洲</label>
      <input
        type="radio"
        value="大洋洲"
        onChange={this.areaChange}
        checked={this.state.areaselect === "大洋洲"}
      />      
     </div>});

  };

  

  render() {
    if (!this.state.web3) {
      return <div align="center" >Loading Web3, accounts, and contract...(等待過久請重新整理)</div>;
    }
    return (
      <div className="JS4_FileUpload">
        <ul><li><Link to = "/start">返回上一頁</Link></li></ul>
        <h1>檔案上傳準備</h1>

        <p>選擇檔案及填寫關鍵字</p>
  
        
        <input type = "file" onChange = {this.FileSelect} /> 
        <div>輸入關鍵字：<input type="text" value={this.state.keyword} onChange={this.EnterKeyword} /></div>
        <div>分享控制：
        <label>公開</label>
        <input
          type="radio"
          value="公開"
          onChange={this.onChangeShare}
          checked={this.state.share === "公開"}
        />
        <label>只限本人</label>
        <input
          type="radio"
          value="只限本人"
          onChange={this.onChangeShare}
          checked={this.state.share === "只限本人"}
        />
        <label>指定對象</label>
        <input
          type="radio"
          value="指定對象"
          onChange={this.onChangeShare}
          checked={this.state.share === "指定對象"}
        />
        <input type="text" value={this.state.share1} onChange={this.SetShare1} />
        <input type="text" value={this.state.share2} onChange={this.SetShare2} />
        <input type="text" value={this.state.share3} onChange={this.SetShare3} />
        </div>
       

        <p></p>

        <div>檔案名稱：{this.state.filename} </div>
        <div>上傳者：{this.state.accounts} </div>
        <div>關鍵字：{this.state.keyword} </div>
        <div><button type="button" onClick={this.EncryptFile}> 加密檔案 </button> </div>
        <div><button type="button" onClick={this.EncryptReady}> 確認 </button>加密完成後請按確認 </div> 

        <div>{this.state.encfilename}</div>
        <div>{this.state.encfile}</div>       
 
        <div>{this.state.upload} </div>
        <div>{this.state.notify}</div>
        <div>{this.state.findproject}</div>

        <div>{this.state.fptitle}</div>
        <div>{this.state.inputend}</div>
        <div>{this.state.inputarea}</div>
        <div>{this.state.projectcheck}</div>
        <div>{this.state.storageinfo}</div>
        <div>{this.state.findbutton}</div>
        <div>{this.state.changeEnd}{this.state.changeComfirm}{this.state.StEnd}</div>

        <div> {this.state.pageswitch} {this.state.pagenum}</div>
        <div>{this.state.result1}{this.state.payment1}{this.state.getbuton1}</div>
        <div>{this.state.result2}{this.state.payment2}{this.state.getbuton2}</div>
        <div>{this.state.result3}{this.state.payment3}{this.state.getbuton3}</div>
        <div>{this.state.result4}{this.state.payment4}{this.state.getbuton4}</div>
        <div>{this.state.result5}{this.state.payment5}{this.state.getbuton5}</div>

        <div>{this.state.createpayment}</div>
        <div>{this.state.getpayment}</div>
        <div>{this.state.jobpayment}</div>
        <div>{this.state.paybutton}</div>
        
      </div>
    );
  }
}

export default JS4_FileUpload;
