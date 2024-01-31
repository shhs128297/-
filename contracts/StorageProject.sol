pragma solidity >=0.4.21 <0.7.0;

import "./FileLog.sol";

contract StorageProject is FileLog {

    struct Project{
        
        uint ProjectType;
        address payable ProjectOwnerID;
        uint Capacity;
        uint RemainCap;
        uint Price;
        uint[] ServiceTime;
        uint ServiceEnd;
        uint256 EndStamp;
        uint Area;
        
    }

    struct AvailableProject{
        
        uint ProjectID;
        uint RemainCap;
        uint Price;
        uint[] ServiceTime;
        uint ServiceEnd;
        uint Area;

    }

    Project[] internal Projects;
    AvailableProject[] internal AvailableProjects;
    mapping (address => uint[]) public OwnProjectID;

    function createProject(uint _ProjectType, address payable _ProjectOwnerID, uint _Capacity, uint _Price, uint[] memory _ServiceTime, uint _ServiceEnd, uint256 _EndStamp, uint _Area ) public  {

        uint[] storage ownproject = OwnProjectID[_ProjectOwnerID];
        if(ownproject.length > 0){
            Project storage target = Projects[ownproject[ownproject.length-1]];
            require(target.EndStamp < now );

        }
        require(_Capacity > 0);
        if(_ProjectType != 1){
            require(_ServiceTime[1] >= _ServiceTime[0]);
            require(_ServiceTime[3] >= _ServiceTime[2]);
        } 
        uint _RemainCap = _Capacity;

        uint id = Projects.push(Project(_ProjectType, _ProjectOwnerID, _Capacity, _RemainCap, _Price, _ServiceTime, _ServiceEnd, _EndStamp, _Area )) - 1;
        ownproject.push(id);
        OwnProjectID[_ProjectOwnerID] = ownproject;
        AvailableProjects.push(AvailableProject(id, _RemainCap, _Price, _ServiceTime, _ServiceEnd, _Area));

    }

    function updateProject(uint _pid, uint _usecap, uint _plusminus, uint _nowdate) internal  {


        Project storage target = Projects[_pid];
        uint cap = target.RemainCap;
        uint capcheck = 0; 
        if(cap < 1){
            capcheck = 1;
        }
        if(_plusminus == 1){
            cap = cap - _usecap;
            if(cap < 1){
                capcheck = 2;
            }
        }else{
            cap = cap + _usecap;
        }

        target.RemainCap = cap;
        if(capcheck == 1){
            AvailableProjects.push(AvailableProject(_pid, target.RemainCap, target.Price, target.ServiceTime, target.ServiceEnd, target.Area));
        }

        for(uint i = 0; i < AvailableProjects.length;){

            AvailableProject storage target2 = AvailableProjects[i];
            uint256 PEND = Projects[target2.ProjectID].EndStamp;
            uint j = 0;

            if(target2.ProjectID == _pid){
                target2.RemainCap = cap;
                if(capcheck == 2){
                    for (uint k = i; k<AvailableProjects.length-1; k++){
                        AvailableProjects[k] = AvailableProjects[k+1];
                    }
                    delete AvailableProjects[AvailableProjects.length-1];
                    AvailableProjects.length--;
                    j = 1;
                }

            }

            if(PEND < now){
                    for (uint k = i; k<AvailableProjects.length-1; k++){
                        AvailableProjects[k] = AvailableProjects[k+1];
                    }
                    delete AvailableProjects[AvailableProjects.length-1];
                    AvailableProjects.length--;
                    j = 1;
            }

            i = i + 1 - j;
        }
        
        

    }

    function getownProject(address _owner) public  returns (uint[] memory){
        return OwnProjectID[_owner];
    }

    function getProjectType(uint _pid) public view  returns (uint) {
    
    
		return (Projects[_pid].ProjectType) ;

  	}
    
    function getCap(uint _pid) public view  returns (uint) {
       
		return (Projects[_pid].Capacity) ;

  	}

    function getRemianCap(uint _pid) public view  returns (uint) {
    
		return (Projects[_pid].RemainCap) ;

  	}

    function getPrice(uint _pid) public view  returns (uint) {
    
		return (Projects[_pid].Price) ;

  	}

    function getProjectOwner(uint _pid) public view  returns (address payable ) {
    
		return (Projects[_pid].ProjectOwnerID) ;

  	}

    function getServiceTime(uint _pid) public view  returns (uint[] memory) {
    
		return (Projects[_pid].ServiceTime) ;

  	}

    function getServiceEnd(uint _pid) public view  returns (uint) {
    
		return (Projects[_pid].ServiceEnd) ;

  	}

    function getEndStamp(uint _pid) public view  returns (uint) {
    
		return (Projects[_pid].EndStamp) ;

  	}

    function getAvailable(uint _indexID, uint _FileSize, uint _StorageEnd, uint _Area, uint _HourNow) public view  returns (uint, uint, uint, uint[] memory, uint, uint) {
        
        AvailableProject storage target = AvailableProjects[_indexID];

        require(target.RemainCap >= _FileSize);
        require(target.ServiceEnd >= _StorageEnd);
        require(target.Area == _Area);
        uint servicecheck = 0;
        if((_HourNow >= target.ServiceTime[0])&&(_HourNow <= target.ServiceTime[1])){
            servicecheck = 1;
        }
        if((_HourNow >= target.ServiceTime[2])&&(_HourNow <= target.ServiceTime[3])){
            servicecheck = 1;
        }

        require(servicecheck == 1);

		return (target.ProjectID, target.RemainCap, target.Price, target.ServiceTime, target.ServiceEnd, target.Area ) ;

  	}

    function Availablelength() public view  returns (uint) {

		    return (AvailableProjects.length) ;

  	}

    function ctestproject(address payable _user1, uint[] memory _testat) public  {
        
        uint id = Projects.push(Project(2, _user1, 1000, 970, 2, _testat, 20220920, 1663603200 ,1)) - 1;
        OwnProjectID[_user1] = [id];

    }


}
