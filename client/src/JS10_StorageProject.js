import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import AllContract from "./contracts/AllContract.json";
import FileInfoContract from "./contracts/FileInfo.json";
import getWeb3 from "./getWeb3";
import JS7_ButtonSwithResultPage from './JS7_ButtonSwithResultPage';
import { create } from 'ipfs-http-client';
import DateTimePicker from 'react-datetime-picker';
import { date } from "check-types";
import { variableDeclaration } from "@babel/types";


class JS10_StorageProject extends Component {
  state = { storageValue: null, 
            web3: null, 
            accounts: null, 
            contract: null,
            Projectvalue: "常態",
            Projecttype: 1,
            capacity: null,
            price: null,
            serveprice: null,
            saveprice: null,
            Projectover: null,
            nowhour: null,
            servetime1: "",
            servetime2: "",
            servetime3: "",
            servetime4: "",
            servetimeinfo: null,
            endyear: null,
            endmonth: null,
            endday: null,
            ownProject: null,
            testarray1: null,
            testarray2: null,
            testcid: null,
            testtime: null,
            confirmcheck: null,
            createbutton: null,
            createinfo: null,
            areaselect: "歐洲",
            area: 1,
            storageEnd: null,
            filesize: 0,
            day: null,
            bill: null,
            bbtest: null,
            paylogg: null,
            split1:null,
            split2:null,
            csvt:null,
            joblist:null,
            jobinfo:null,
            startjobbutton:null,
            nowProject:null,
            r4:null,
            jobcount:0,
            avtt:null


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

    const account  = this.state.accounts;
    var date = new Date(Date.now());
    var hours = date.getHours();
    this.setState({ nowhour: hours,
      servetime1: "x", 
      servetime2: "x",
      servetime3: "x",
      servetime4: "x"});

  };

  firstJob = async (projectID) => {

    const { accounts, contract} = this.state;
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    const pid = projectID;
    const scope = this;
    let checkJobid = [];
    let listcheck = 1 ;

    checkJobid = await contract.methods.getProjectOwnJobID(pid).call();
    for(let i=1;i<=checkJobid.length;i++){
      let jid = checkJobid[i-1];
      const filecid = await contract.methods.getJobhash(jid).call();
      await client.pin.add(filecid) ;

    }
    if(checkJobid.length != 0){
      var joblistfile = new Blob([checkJobid]); 
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(joblistfile);
      a.href = url;
      a.download = "joblist.txt";
      a.click();
      window.URL.revokeObjectURL(url); 

    }

    var clock = setInterval(standb,300000);
    async function standb() {

      let newownJobid = [];

      newownJobid = await contract.methods.getProjectOwnJobID(pid).call();

      for(let i=1;i<=newownJobid.length;i++){
        var pincheck = 0;
        for(let j=1;j<=checkJobid.length;j++){
          if(checkJobid[j-1] == newownJobid[i-1]){
            pincheck = 1;
            j = checkJobid.length+1;
          }
        }
        if(pincheck == 0){
          var newcid = await contract.methods.getJobhash(newownJobid[i-1]).call();
          listcheck = 0;
          const cid = await client.pin.add(newcid) ;
          await scope.setState({testcid: cid.toString()});

        } 

      }

        checkJobid = newownJobid;   
        if(listcheck == 0){
          var joblistfile = new Blob([checkJobid]);
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(joblistfile);
          a.href = url;
          a.download = "joblist.txt";
          a.click();
          window.URL.revokeObjectURL(url);
          listcheck = 1 ; 
        }
      
      var jc = scope.state.jobcount;
      jc = jc + 1;
      await scope.setState({jobcount: jc});
      await scope.setState({jobinfo: "已進行"+jc+"次受委託交易列表更新 最新取得檔案hash："});
    }      

  };

  startJob = async () => {

    const { accounts, contract, joblist} = this.state;
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});

    const scope = this;

    let ownProjectid = [];
    ownProjectid =  await contract.methods.getownProject(accounts[0]).call();
    let pid = ownProjectid[ownProjectid.length-1];
    await scope.setState({jobinfo: "履行服務中..."});

    let reader = new FileReader
    reader.readAsText(joblist);   

    reader.onload = function() {
      const jobstring = reader.result;
      const jobarray = jobstring.split(',');

      let checkJobid = jobarray;
      let listcheck = 1 ;

      var clock = setInterval(standb,300000);
      async function standb() {

        let newownJobid = [];

        newownJobid = await contract.methods.getProjectOwnJobID(pid).call();

        for(let i=1;i<=newownJobid.length;i++){
          let pincheck = 0;
          for(let j=1;j<=checkJobid.length;j++){
            if(checkJobid[j-1] == newownJobid[i-1]){
              pincheck = 1;
              j = checkJobid.length+1;
            }
          }
          if(pincheck == 0){
            var newcid = await contract.methods.getJobhash(newownJobid[i-1]).call();
            listcheck = 0;
            const cid = await client.pin.add(newcid) ;
            await scope.setState({testcid: cid.toString()});

          } 

        }

        checkJobid = newownJobid;   
        if(listcheck == 0){
          var joblistfile = new Blob([checkJobid]); 
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(joblistfile);
          a.href = url;
          a.download = "joblist.text";
          a.click();
          window.URL.revokeObjectURL(url);
          listcheck = 1 ; 
        }

        var jc = scope.state.jobcount;
        jc = jc + 1;
        await scope.setState({jobcount: jc});
        await scope.setState({jobinfo: "已進行"+jc+"次受委託交易列表更新 最新取得檔案hash："});

      }   

    }   

  };

  testJob = async () => {

    const { accounts, contract} = this.state;
    const client = create({ host: 'localhost', port: '5001', protocol: 'http' , timeout: 10000});
    const scope = this;
    let ownProjectid = [];
    ownProjectid = await contract.methods.getownProject(accounts[0]).call();
    let checkProject = ownProjectid[ownProjectid.length-1];

    var clock = setInterval(standb,10000);
    async function standb() {

      let newownProjectid = [];
      newownProjectid = await contract.methods.getownProject(accounts[0]).call();
      await scope.setState({testcid: "No new data"});
      if(checkProject != newownProjectid[newownProjectid.length-1]){
  
        checkProject = newownProjectid[newownProjectid.length-1];
        const cid = await client.pin.add("QmWf94M1snGuzdHqkFYogWDh9AnCCLsbDXYu3XP2Ek9rE6") ;
        await scope.setState({testcid: cid.toString()});

      } 

      if(checkProject==4){
        await clearInterval(clock);
      }

    }      

  };

  onChangeShare = e => {

    const { accounts, contract } = this.state;

    this.setState({
        Projectvalue: e.target.value
    });
    if(e.target.value=="常態"){
      this.setState({Projecttype: 1, 
        servetime1: "x",
        servetime2: "x",
        servetime3: "x",
        servetime4: "x"});
    }
    if(e.target.value=="分時"){
      this.setState({Projecttype: 2, 
        servetime1: this.state.nowhour,
        servetime2: "",
        servetime3: "",
        servetime4: ""});
    }

  };

  EnterCapacity = async (event) => {

    try {
        this.setState({ capacity: event.target.value });
    } catch (error) {
        this.setState({ capacity: "" });
    }  
 
  };

  EnterPrice = async (event) => {

    try {
        this.setState({ price: event.target.value });
    } catch (error) {
        this.setState({ price: "" });
    }  
 
  };

  EnterServeprice = async (event) => {

    try {
        this.setState({ serveprice: event.target.value });
    } catch (error) {
        this.setState({ serveprice: "" });
    }  
 
  };

  EnterSaveprice = async (event) => {

    try {
        this.setState({ saveprice: event.target.value });
    } catch (error) {
        this.setState({ saveprice: "" });
    }  
 
  };

  EnterProjectover = async (event) => {

    try {
        this.setState({ Projectover: event.target.value });
    } catch (error) {
        this.setState({ Projectover: "" });
    }  
 
  };

  EnterServetime2 = async (event) => {

    try {
        if(this.state.Projecttype == 2){
          this.setState({ servetime2: event.target.value });
        }
    } catch (error) {
        this.setState({ servetime2: "" });
    }  
 
  };

  EnterServetime3 = async (event) => {

    try {
        if(this.state.Projecttype == 2){
          this.setState({ servetime3: event.target.value });
        }
    } catch (error) {
        this.setState({ servetime3: "" });
    }  
 
  };

  EnterServetime4 = async (event) => {

    try {
        if(this.state.Projecttype == 2){
          this.setState({ servetime4: event.target.value });         
        }
    } catch (error) {
        this.setState({ servetime4: "" });
    }  
 
  };

  Enterendyear = async (event) => {

    try {
        this.setState({ endyear: event.target.value });
    } catch (error) {
        this.setState({ endyear: "" });
    }  
 
  };

  Enterendmonth = async (event) => {

    try {
        this.setState({ endmonth: event.target.value });
    } catch (error) {
        this.setState({ endmonth: "" });
    }  
 
  };

  Enterendday = async (event) => {

    try {
        this.setState({ endday: event.target.value });
    } catch (error) {
        this.setState({ endday: "" });
    }  
 
  };

  areaChange = e => {

    const { accounts, contract } = this.state;

    this.setState({
        areaselect: e.target.value
    });
    if(e.target.value=="歐洲"){
      this.setState({area: 1});
    }
    if(e.target.value=="亞洲"){
      this.setState({area: 2});
    }
    if(e.target.value=="美洲"){
      this.setState({area: 3});
    }
    if(e.target.value=="非洲"){
      this.setState({area: 4});
    }
    if(e.target.value=="大洋洲"){
      this.setState({area: 5});
    }

  };

  ConfirmProject = async () => {

    const { accounts, contract, Projecttype, capacity, price, servetime1, servetime2, servetime3, servetime4, endyear, endmonth, endday, area, areaselect  } = this.state;
    let type = "常態"
    let confirmcap = "";
    let confirmprice = "";
    let confirmservetime = "";
    let confirmendtime = "";
    let confirminfo = [];
    let finalcheck = 0;
    var st1 = servetime1;
    var st2 = servetime2;
    var st3 = servetime3;
    var st4 = servetime4;
    var cg1;
    var cg2;
    let stcheck = 0;

    if(!endyear||!endmonth||!endday){
      confirmendtime = "(數值有誤，請修改)";
      finalcheck = 1;
    }
    const end = endyear+"/"+endmonth+"/"+endday;
    const endstamp = Date.parse(end);
    var datenow = new Date(Date.now());
    
    if(Projecttype == 2){
      type = "分時";
    }
    if(capacity < 1){
      confirmcap = "(數值有誤，請修改)";
      finalcheck = 1;
    }
    if(price < 1){
      confirmprice = "(數值有誤，請修改)";
      finalcheck = 1;
    }
    if(Projecttype == 2){
      if(parseInt(st1) >= parseInt(st2)){
        confirmservetime = "(數值有誤，請修改1)";
        finalcheck = 1;
      }
      if((parseInt(st3) >= parseInt(st4))&&(st3)&&(st4)){
        confirmservetime = "(數值有誤，請修改2)";
        finalcheck = 1;
      }
      if((st3 == "")||(st4 == "")){
        stcheck = 1;
      }
      if(parseInt(st2) > parseInt(st3)){
        cg1 = st3;
        cg2 = st4;
        st3 = st1;
        st4 = st2;
        st1 = cg1;
        st2 = cg2;
        if(st1 >= st3){
          confirmservetime = "(數值有誤，請修改3)";
          finalcheck = 1;
        }
      }
 

    }
    if(endstamp < datenow){
      confirmendtime = "(數值有誤，請修改)";
      finalcheck = 1;
    }
    confirminfo.push("儲存方案預覽:",<p></p>);
    confirminfo.push("儲存類型:"+type,<p></p>);
    confirminfo.push("容量:"+capacity+"KB"+confirmcap,<p></p>);
    confirminfo.push("計費標準:"+price+"KB/小時"+confirmprice,<p></p>);
    if(Projecttype==1){
      confirminfo.push("服務時段:24小時",<p></p>);
      await this.setState({ servetime1: 0 , servetime2: 24 , servetime3: 0 , servetime4: 0});
    }else if(stcheck == 1){
      confirminfo.push("服務時段:"+st1+"~"+st2+"時"+confirmservetime,<p></p>);
      await this.setState({ servetime1: st1 , servetime2: st2 , servetime3: 0 , servetime4: 0});      
    }else {
      confirminfo.push("服務時段:"+st1+"~"+st2+"時、"+st3+"~"+st4+"時"+confirmservetime,<p></p>);
      await this.setState({ servetime1: st1 , servetime2: st2 , servetime3: st3 , servetime4: st4}); 
    }
    confirminfo.push("服務終止:"+end+confirmendtime,<p></p>);
    confirminfo.push("地區:"+area+areaselect,<p></p>);

    await this.setState({ confirmcheck: confirminfo });
    if(finalcheck == 0){
      await this.setState({ createbutton: <button type="button" onClick={() => {this.CreateProject()}}> 確認送出 </button> });
    }
  };

  CreateProject = async () => {

    const { accounts, contract, Projecttype, capacity, price, servetime1, servetime2, servetime3, servetime4, endyear, endmonth, endday, area  } = this.state;
    let servetimearray = [];
    const scope = this;
    servetimearray.push(servetime1, servetime2, servetime3, servetime4);
    const endtime = parseInt(endyear+endmonth+endday,10);
    const end = endyear+"/"+endmonth+"/"+endday;
    const endstamp = Date.parse(end)/1000;
    try {
      await contract.methods.createProject(Projecttype, accounts[0], capacity, price, servetimearray, endtime, endstamp, area).send({ from: accounts[0] });
      await this.setState({jobinfo: "履行服務中..."});
    } catch (error) {
      this.setState({ createinfo: "無法建立儲存方案，請確認是否有進行中的儲存方案。" });
    }  

    var clock = setTimeout(standb,10000);
    async function standb() {

      let ownProjectids = [];
      ownProjectids = await contract.methods.getownProject(accounts[0]).call();
      await scope.firstJob(ownProjectids[ownProjectids.length-1]);

      
    }
  };

  GetProject = async () => {

    const { accounts, contract} = this.state;
    let ownProjectid = [];
    ownProjectid = await contract.methods.getownProject(accounts[0]).call();
    let Projectarray = [];
    for( let i = 0 ; i < ownProjectid.length ; i++ ) {

      let ethProjecttype = await contract.methods.getProjectType(ownProjectid[i]).call();
      let type = "常態";
      if(ethProjecttype==2){
        type = "分時";
      }
      let ethallcap = await contract.methods.getCap(ownProjectid[i]).call();
      let ethnowcap = await contract.methods.getRemianCap(ownProjectid[i]).call();
      let ethprice = await contract.methods.getPrice(ownProjectid[i]).call();
      let ethProjectowner = await contract.methods.getProjectOwner(ownProjectid[i]).call();
      let ethonlinetime = await contract.methods.getServiceTime(ownProjectid[i]).call();
      let ethstoragetime = await contract.methods.getServiceEnd(ownProjectid[i]).call();

      Projectarray.push("方案建立者:"+ethProjectowner);
      Projectarray.push("  方案類型:"+type,<p></p>);
      Projectarray.push("容量:"+ethallcap);
      Projectarray.push("  剩餘容量:"+ethnowcap,<p></p>);
      Projectarray.push("計費方式(每KB小時)"+ethprice,<p></p>);
      Projectarray.push("服務時段:"+ethonlinetime,<p></p>);
      Projectarray.push("服務終止時段:"+ethstoragetime,<p></p>,<p></p>);

    }

    this.setState({ ownProject: Projectarray });
    if(!Projectarray[0]){
        this.setState({ ownProject: "查無儲存方案" });      
    }

    
  };

  GetLastProject = async () => {

    const { accounts, contract} = this.state;
    let ownProjectid = [];
    ownProjectid = await contract.methods.getownProject(accounts[0]).call();
    let Projectarray = [];
    let i = ownProjectid[ownProjectid.length-1];

    let ethProjecttype = await contract.methods.getProjectType(i).call();
    let type = "常態";
    if(ethProjecttype==2){
      type = "分時";
    }
    let ethallcap = await contract.methods.getCap(i).call();
    let ethnowcap = await contract.methods.getRemianCap(i).call();
    let ethprice = await contract.methods.getPrice(i).call();
    let ethProjectowner = await contract.methods.getProjectOwner(i).call();
    let ethonlinetime = await contract.methods.getServiceTime(i).call();
    let ethstoragetime = await contract.methods.getServiceEnd(i).call();

    Projectarray.push(<br></br>);
    Projectarray.push("方案建立者:"+ethProjectowner);
    Projectarray.push("  方案類型:"+type,<br></br>);
    Projectarray.push("容量:"+ethallcap);
    Projectarray.push("  剩餘容量:"+ethnowcap,<br></br>);
    Projectarray.push("計費方式(每KB小時)"+ethprice,<br></br>);
    Projectarray.push("服務時段:"+ethonlinetime,<br></br>);
    Projectarray.push("服務終止時段:"+ethstoragetime,<br></br>,<br></br>);
    Projectarray.push("履行此儲存方案服務");
    await this.setState({ nowProject: Projectarray });
    await this.setState({ startjobbutton: <button type="button" onClick={() => {this.startJob()}}> 確認 </button> });

    

    if(!Projectarray[0]){
        this.setState({ nowProject: "查無儲存方案" });      
    }

    
  }

  timein = async (event) => {

    try {
        this.setState({ testtime: event.target.value });
    } catch (error) {
        this.setState({ testtime: new date() });

    }  
 
  };

  FileSelect = async (e) => {
    
    try {
        const filer = e.target.files[0];
        await this.setState({ csvt: filer });

    } catch (error) {
        console.log('Error uploading file: ', error)
        this.setState({ csvt: null });
        
    }  
  };

  JobFileSelect = async (e) => {
    
    try {
        const jobfile = e.target.files[0];
        await this.setState({ joblist: jobfile });

    } catch (error) {

        await this.setState({ joblist: null });
        
    }  
  };
 
  
  render() {
    if (!this.state.web3) {
      return <div align="center" >Loading Web3, accounts, and contract...(等待過久請重新整理)</div>;
    }
    return (
        <div className="JS10_StorageProject">
         <ul><li><Link to = "/start">返回上一頁</Link></li></ul>
         <h1>建立儲存方案</h1>
         <div>類型選擇：
          <label>常態</label>
          <input
            type="radio"
            value="常態"
            onChange={this.onChangeShare}
            checked={this.state.Projectvalue === "常態"}
          />
          <label>分時</label>
          <input
            type="radio"
            value="分時"
            onChange={this.onChangeShare}
            checked={this.state.Projectvalue === "分時"}
          />
         </div>
         <div>容量(單位KB)：<input type="number" value={this.state.capacity} onChange={this.EnterCapacity} /></div>
         <div>計費標準(wei，每KB小時)：<input type="number" value={this.state.kbprice} onChange={this.EnterPrice} /></div>
         <div>
          服務時段(僅分時可設定)： 時段1({this.state.servetime1}  ~ 
          <input type="number" value={this.state.servetime2} onChange={this.EnterServetime2} /> )
          (時段2
          <input type="number" value={this.state.servetime3} onChange={this.EnterServetime3} /> ~
          <input type="number" value={this.state.servetime4} onChange={this.EnterServetime4} /> )
          </div>
         <div>服務終止日期(YYYY/MM/DD 0時)：
          <input type="number" value={this.state.endyear} onChange={this.Enterendyear} />/
          <input type="number" value={this.state.endmonth} onChange={this.Enterendmonth} />/
          <input type="number" value={this.state.endday} onChange={this.Enterendday} />
         </div>

         <div>地區選擇：
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
          
         </div>
         <div><button type="button" onClick={this.ConfirmProject}> 完成 </button></div>
         <div>{this.state.confirmcheck}</div>
         <div>{this.state.createbutton}</div>
         <div>{this.state.createinfo}</div>

         <div><button type="button" onClick={this.GetProject}> 查詢自己的儲存方案 </button> </div>
         <div>{this.state.ownProject}</div>

         <h1>履行服務</h1>
         <div>服務履行狀況：{this.state.jobinfo}{this.state.testcid}</div>
         <div>選擇joblist準備履行服務<input type = "file" onChange = {this.JobFileSelect} /> </div>
         <div><button type="button" onClick={this.GetLastProject}> 日常履行服務 </button>{this.state.nowProject}{this.state.startjobbutton}</div>
        

        </div>
    );
  }
}

export default JS10_StorageProject;
