pragma solidity >=0.4.21 <0.7.0;

import "./StorageProject.sol";

contract StorageJob is StorageProject  {

     struct Job{
        
        uint ProjectID;
        address payable [2] Participant;
        uint FileID;
        uint FileSize;
        string hash;
        uint256 StorageStart;
        uint256 StorageEnd;
        uint256[4] AccessTime;
        uint Established;
    }

    Job[] internal Jobs;
    mapping (address => uint) public Jobidnow;
    mapping (address => uint[]) public OwnJobID;
    mapping (uint => uint[]) public ProjectOwnJobID;

    function createJob(uint _ProjectID, uint _FileID, uint _FileSize, string memory _hash, uint256 _StorageStart, uint256 _StorageEnd, address payable _Jobowner) public  {


        uint comfirm = Jobcomfirm(_ProjectID, _FileSize, _StorageEnd);
        require(comfirm==1);
        
        uint[4] memory AccessTime = CalAT(_ProjectID, _StorageEnd); 

        address payable projectowner = StorageProject.getProjectOwner(_ProjectID);
        address payable [2] memory Participant = [_Jobowner, projectowner];

        uint id = Jobs.push(Job(_ProjectID, Participant, _FileID, _FileSize, _hash, _StorageStart, _StorageEnd, AccessTime, 0)) - 1;
        Jobidnow[_Jobowner] = id;

        uint[] storage ownjob = OwnJobID[_Jobowner];
        ownjob.push(id);
        OwnJobID[_Jobowner] = ownjob;


    }

    function Jobcomfirm(uint _ProjectID, uint _FileSize, uint256 _StorageEnd) public view  returns (uint){

        uint nowcap = StorageProject.getCap(_ProjectID);
        uint check = 1;
        if(nowcap < _FileSize){     
            check = 0;
        }
        uint sttime = StorageProject.getEndStamp(_ProjectID);
        if(sttime < _StorageEnd){     
            check = 0;
        }

        return check;

    }

    function CalAT(uint _ProjectID, uint256 _StorageEnd) public view  returns (uint[4] memory){

        uint[] memory service = StorageProject.getServiceTime(_ProjectID);
        uint a1 = (_StorageEnd - 86400) + (service[0]*3600);
        uint a2 = (_StorageEnd - 86400) + (service[1]*3600);
        uint a3 = (_StorageEnd - 86400) + (service[2]*3600);
        uint a4 = (_StorageEnd - 86400) + (service[3]*3600);
        uint[4] memory _AccessTime = [a1, a2, a3, a4]; 
        return _AccessTime;
    }

    function establishJob(uint _tid, uint _datetime)  internal  {
        
        Job storage target = Jobs[_tid];
        target.Established = 1;
        uint pid = target.ProjectID;

        uint[] storage joblist = ProjectOwnJobID[pid];
        joblist.push(_tid);
        ProjectOwnJobID[pid] = joblist;

        uint[] storage ownjob = OwnJobID[target.Participant[1]];
        ownjob.push(_tid);
        OwnJobID[target.Participant[1]] = ownjob;

        StorageProject.updateProject(pid, target.FileSize, 1 , _datetime);

    }

    function UpdateProjectOwnJob(uint _pid, uint _jid, uint _datetime)  public  {

      uint fsize = getFileSize(_jid);
      uint[] storage joblist = ProjectOwnJobID[_pid];
      uint check = 0 ;
      for(uint i=0 ; i<joblist.length ;i++){
        if(joblist[i]==_jid){
          for (uint j = i; j<joblist.length-1; j++){
            joblist[j] = joblist[j+1];
          }
          delete joblist[joblist.length-1];
          joblist.length--;
          check = 1;
        }
      }
      if(check == 1){
        ProjectOwnJobID[_pid] = joblist;
        StorageProject.updateProject(_pid, fsize, 2, _datetime);
      }     
    }

    function getJobProject(uint _tid) public view  returns (uint) {
    
    
		return (Jobs[_tid].ProjectID) ;

  	}

    function getFileID(uint _tid) public view  returns (uint) {
    
    
		return (Jobs[_tid].FileID) ;

  	}

    function getFileSize(uint _tid) public view  returns (uint) {
    
    
		return (Jobs[_tid].FileSize) ;

  	}

    function getJobhash(uint _tid) public view  returns (string memory) {
    
    
		return (Jobs[_tid].hash) ;

  	}

    function getStorageStart(uint _tid) public view  returns (uint256) {
    
		return (Jobs[_tid].StorageStart) ;

  	}

    function getStorageEnd(uint _tid) public view  returns (uint256) {
    
		return (Jobs[_tid].StorageEnd) ;

  	}

    function getAccessTime(uint _tid) public view  returns (uint256[4] memory) {
    
		return (Jobs[_tid].AccessTime) ;

  	}

    function getParticipant(uint _tid) public view  returns (address payable [2] memory) {
    
		return (Jobs[_tid].Participant) ;

  	}



    function getEstablished(uint _tid) public view  returns (uint) {
    
		return (Jobs[_tid].Established) ;

  	}

    function getProjectOwnJobID(uint _pid) public view  returns (uint[] memory) {
       
		return ProjectOwnJobID[_pid];

  	}

    function getOwnJobID(address _owner) public view  returns (uint[] memory) {
       
		return OwnJobID[_owner];

  	}

    function getjobid(address _owner) public view  returns (uint) {

		    return (Jobidnow[_owner]) ;

  	}

    function ctestjob(address payable _user2) public  {

        address payable _user1 = StorageProject.getProjectOwner(0);
        uint256 A1 = 1662685200 ;
        uint256 A2 = 1662706800 ;
        uint256 A34 = 1662652800 ;
        uint256[4] memory ATA = [A1, A2, A34, A34];

        uint id1 = Jobs.push(Job(0, [_user2, _user1], 0, 10, "QmbAUd65kT5LtEiqpe6uxmicX4KH5qHxs5jnCQbccG27mH", 1661994000, 1662739200, ATA, 1)) - 1;
        uint id2 = Jobs.push(Job(0, [_user2, _user1], 1, 10, "QmbAUd65kT5LtEiqpe6uxmicX4KH5qHxs5jnCQbccG27mH", 1661994000, 1662739200, ATA, 1)) - 1;
        uint id3 = Jobs.push(Job(0, [_user2, _user1], 2, 10, "QmbAUd65kT5LtEiqpe6uxmicX4KH5qHxs5jnCQbccG27mH", 1661994000, 1662739200, ATA, 1)) - 1;

        OwnJobID[_user1] = [0,1,2];
        OwnJobID[_user2] = [0,1,2];
        ProjectOwnJobID[0] = [0,1,2];


    }

    

}
