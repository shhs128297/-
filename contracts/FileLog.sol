pragma solidity >=0.4.21 <0.7.0;

import "./FileInfo.sol";

contract FileLog is FileInfo {


    struct loginfo{
        
        uint LogFileId;
        address LogUser;
        uint256 LogTime;
        uint LogType;  
        uint DLResult; 
        
    }

    loginfo[] internal loginfos;

    mapping (uint => uint[]) public fileidtolog;
    mapping (address => uint) public loginfonow;
    mapping (address => uint) public DLRcheck;

    function setlog(uint[] memory _LogFileId, address _LogUser) public  {
        
        uint256 _LogTime = now;
        for (uint i= 0;i<5;i++){
          if(_LogFileId[i]==1){
            uint itid = loginfos.push(loginfo(_LogFileId[i+5], _LogUser, _LogTime, 1, 0)) - 1;

            uint[] storage loglist = fileidtolog[_LogFileId[i+5]];
            loglist.push(itid);
            fileidtolog[_LogFileId[i+5]] = loglist;
          }
        }
        
    } 

    function setdownloadlog(uint _LogFileId, address _LogUser) public  {
        
        uint256 _LogTime = now;
        uint itid = loginfos.push(loginfo(_LogFileId, _LogUser, _LogTime, 2, 1)) - 1;

        uint[] storage loglist = fileidtolog[_LogFileId];
        loglist.push(itid);
        fileidtolog[_LogFileId] = loglist;

        loginfonow[_LogUser] = itid;
        DLRcheck[_LogUser] = 1;
         
        
    }

    function setDLresult(address _LogUser, uint _DLResult) public {

      require(DLRcheck[_LogUser] == 1);
      uint lid = loginfonow[_LogUser];
      loginfo storage target = loginfos[lid];
      target.DLResult = _DLResult;
      DLRcheck[_LogUser] = 0;

    }

    function getinfohash(address _LogUser) public view  returns (string memory) {

      uint lid = loginfonow[_LogUser];
      uint fid = loginfos[lid].LogFileId;

      string memory h = FileInfo.gethash(fid);
    
		  return h ;

    }

    function getinfocrypto(address _LogUser) public view  returns (uint) {

      uint lid = loginfonow[_LogUser];
      uint fid = loginfos[lid].LogFileId;

      uint c = FileInfo.getcrypto(fid);
    
		  return c ;

    }  

    function loglength() public view  returns (uint) {

		  return (loginfos.length) ;

  	}  
    
  

    function getlogid(uint _logid) public view  returns (uint){
        
      return (loginfos[_logid].LogFileId);
        
    }  

    function getloguser(uint _logid) public view  returns (address){
        
      return (loginfos[_logid].LogUser);
        
    }

    function getlogtime(uint _logid) public view  returns (uint256){
        
      return (loginfos[_logid].LogTime);
        
    }

    function getlogtype(uint _logid) public view  returns (uint256){
        
      return (loginfos[_logid].LogType);
        
    }

    function getdlresult(uint _logid) public view  returns (uint){
        
      return (loginfos[_logid].DLResult);
        
    }

    function getfileidtolog(uint _fid) public view  returns (uint[] memory){
        
      return fileidtolog[_fid];
        
    }

    function getrefundhour(uint _fid, uint256 _t1, uint256 _t2, uint _day) public view  returns (uint){
      
      uint[] storage loglist = fileidtolog[_fid];
      uint256 st1 = _t1 - (86400*_day);
      uint256 st2 = _t2 - (86400*_day);

      uint rfhour = 0;
      
      for(uint i=0 ; i<loglist.length ; i++){
        if(loginfos[loglist[i]].DLResult==2){
          uint rh1 = 0;
          uint rh2 = 0;
          uint th = 0;

          for(uint j=0; j< _day+1; j++ ){
              if(loginfos[loglist[i]].LogTime >= (st1+86400*j) && loginfos[loglist[i]].LogTime <= (st2+86400*j)){

                rh1 = 0;
                rh2 = (st2-st1)/3600;

                for(uint h=1; h<rh2+1; h++){
                    if(loginfos[loglist[i]].LogTime < (st1+86400*j)+3600*h){
                      th = h-1 ;
                      h = rh2+1;
                    }

                }

                if( i != 0 && loginfos[loglist[i-1]].DLResult==1){
                  for(uint k=1; k<rh2+1; k++){
                    if(loginfos[loglist[i-1]].LogTime >= (st1+86400*j) && loginfos[loglist[i-1]].LogTime < (st1+86400*j)+3600*k){
                      rh1 = k-1 ;
                      if (th == k-1){
                        rh1 = 0;
                        rh2 = 0;
                      }
                      k = rh2+1;
                    }

                  }
                }

                for(uint m=1;m<loglist.length-i;m++){
                  if(loginfos[loglist[i+m]].LogTime <= (st2+86400*j)){
                    if(loginfos[loglist[i+m]].DLResult==2){
                      i = i+1;
                      m = m-1;
                    }

                    if(loginfos[loglist[i+m]].DLResult==1){
                      for(uint n=1; n<rh2+1; n++){
                        if(loginfos[loglist[i+m]].LogTime < (st1+86400*j)+3600*n){
                          rh2 = n-1 ;
                          m = loglist.length;
                          if (th == n-1){
                            rh1 = 0;
                            rh2 = 0;
                          }
                          n = rh2+1;
                        }
                      }
                    }
                  }else{
                      m = loglist.length;
                  }

                }

                j = _day+1;
              }

          }

          rfhour = rfhour + rh2 - rh1;
        }

      }

      return rfhour;
        
    }

    function ctestlog(address payable _user3) public  {

      uint id5 = loginfos.push(loginfo(0, _user3, 1662271200, 2, 1)) - 1;
      uint id6 = loginfos.push(loginfo(0, _user3, 1662273000, 2, 2)) - 1;
      uint id7 = loginfos.push(loginfo(0, _user3, 1662350400, 2, 1)) - 1;
      uint id8 = loginfos.push(loginfo(0, _user3, 1662354000, 2, 2)) - 1;
      uint id9 = loginfos.push(loginfo(0, _user3, 1662433200, 2, 2)) - 1;

      fileidtolog[0] = [0, 1];
      fileidtolog[1] = [2, 3];
      fileidtolog[2] = [4];

    }
  

}