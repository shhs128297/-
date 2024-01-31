pragma solidity >=0.4.21 <0.7.0;


contract FileInfo {
    
    struct file{
        
        string name;
        address uploader;
        string keyword;
        uint256 time;
        uint filesize;
        string hash;
        uint sharetype;
        address[] shareaddress;
        uint cryptoid;

    }
    
    file[] internal files;
    
    mapping (address => uint[]) public ownerfile;
    mapping (address => uint[]) public sharedfile;
    mapping (address => uint) public fileidnow;

    
    function createinfo(string memory _name, address _uploader, string memory _keyword, uint _filesize, string memory _hash, uint _sharetype, address[] memory _shareaddress, uint _cryptoid) public  {
        
        uint256 _time = now;
        uint id = files.push(file(_name, _uploader, _keyword, _time, _filesize, _hash, _sharetype, _shareaddress, _cryptoid)) - 1;

        uint[] storage filelist = ownerfile[_uploader];
        filelist.push(id);
        ownerfile[_uploader] = filelist;
        if(_sharetype==3){
          if(_uploader!=_shareaddress[1]){
          uint[] storage slist1 = sharedfile[_shareaddress[1]];
          slist1.push(id);
          sharedfile[_shareaddress[1]] = slist1;
          }


          if(_uploader!=_shareaddress[2]){
          uint[] storage slist2 = sharedfile[_shareaddress[2]];
          slist2.push(id);
          sharedfile[_shareaddress[2]] = slist2;
          }


          if(_uploader!=_shareaddress[3]){
          uint[] storage slist3 = sharedfile[_shareaddress[3]];
          slist3.push(id);
          sharedfile[_shareaddress[3]] = slist3;
          }

        }

        fileidnow[_uploader] = id;
        
    }

    function deletefile(uint _fid)  public  {
        
        file storage target = files[_fid];
        require(msg.sender==target.uploader);
        delete files[_fid];
        target.sharetype = 0;

    }
    
    function getname(uint _id) public view  returns (string memory) {
    
		  return (files[_id].name) ;

  	}

    function getkword(uint _id) public view  returns (string memory) {
    
		  return (files[_id].keyword) ;

  	}

    function getaddr(uint _id) public view  returns (address) {
    
		  return (files[_id].uploader) ;

  	}
    
    function gettime(uint _id) public view  returns (uint256) {
    
		  return (files[_id].time) ;

  	}

    function getsize(uint _id) public view  returns (uint) {
    
		  return (files[_id].filesize) ;

  	}

    function gethash(uint _id) internal view  returns (string memory) {

		  return (files[_id].hash) ;

  	}

    function ownerhash(uint _id) public view  returns (string memory) {
      require(msg.sender==files[_id].uploader);
		  return (files[_id].hash) ;

  	}

    function getsharetype(uint _id) public view returns(uint){

        return (files[_id].sharetype);
    }

    function getshare(uint _id, uint _index) public view returns(address){

        file storage target = files[_id];
        address sa = target.shareaddress[_index];

        return sa;
    }

    function getcrypto(uint _id) public view returns(uint){

        return (files[_id].cryptoid);
    }

    function flength() public view  returns (uint) {

		    return (files.length) ;

  	}

    function getownfile(address _owner) public view  returns (uint[] memory) {

		    return (ownerfile[_owner]) ;

  	}

    function getsharedfile(address _owner) public view  returns (uint[] memory) {

		    return (sharedfile[_owner]) ;

  	}

    function getidnow(address _owner) public view  returns (uint) {

		    return (fileidnow[_owner]) ;

  	}
 
    
}