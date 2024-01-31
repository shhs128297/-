pragma solidity >=0.4.21 <0.7.0;

import "./StorageJob.sol";

contract PaymentManage is StorageJob {

    struct paymentinfo{
        
        uint JobID;
        address payable [2] Participant;
        uint Payment;

    }

    paymentinfo[] internal paymentinfos;
    mapping (uint => uint) public Jobpayid;
    mapping (uint => uint[3]) public PayResult;
    mapping (uint => uint) public JobDays;

    function preparecreate(uint _jid, uint _nowdate) public  {
        uint _pid = StorageJob.getJobProject(_jid);
        uint _price = StorageProject.getPrice(_pid);
        uint _fsize = StorageJob.getFileSize(_jid);
        address payable [2] memory _Partic = StorageJob.getParticipant(_jid);
        uint256[4] memory _AccessTime = StorageJob.getAccessTime(_jid);
        uint256 _StorageEnd = StorageJob.getStorageEnd(_jid);
        uint256 _JobStart = StorageJob.getStorageStart(_jid);

        createpayinfo(_price, _fsize, _jid, _Partic, _AccessTime, _StorageEnd, _JobStart, _nowdate);

    }

    function createpayinfo(uint _Price, uint _fsize, uint _tid, address payable [2] memory _Participant, uint256[4] memory _AccessTime, uint256 _StorageEnd, uint256 _JobStart, uint _nowdate) public  {

        uint FA1 = _AccessTime[0] - (_StorageEnd - _nowdate - 86400);
        uint FA2 = _AccessTime[1] - (_StorageEnd - _nowdate - 86400);
        uint FA3 = _AccessTime[2] - (_StorageEnd - _nowdate - 86400);
        uint FA4 = _AccessTime[3] - (_StorageEnd - _nowdate - 86400); 

        uint FirstDayT;
        if(_JobStart >= FA1){
            if(_JobStart < FA2){
                FirstDayT = FA2 - _JobStart + (FA4 - FA3);
            }

        } else if(_JobStart >= FA3){
            if(_JobStart < FA4){
                FirstDayT = FA4 - _JobStart;
            }
        }

        uint payment = _fsize * _Price * (FirstDayT + ((_StorageEnd - _nowdate - 86400)/86400) * ((_AccessTime[1] - _AccessTime[0])+(_AccessTime[3] - _AccessTime[2])))/3600;
        uint id = paymentinfos.push(paymentinfo(_tid, _Participant, payment));
        Jobpayid[_tid] = id - 1;
        JobDays[_tid] = ((_StorageEnd - _nowdate - 86400)/86400);
    }

    function Jobpay(uint _pmid, uint _jid, uint _nowdate ) public payable  {
        
        paymentinfo storage target = paymentinfos[_pmid];
        uint payment = target.Payment;        

        require(msg.value==payment);
        StorageJob.establishJob( _jid, _nowdate);

    }

    function paymentcontrol(uint _jid) public {

        paymentinfo storage target = paymentinfos[Jobpayid[_jid]];
        uint[3] memory payresult = PayResult[Jobpayid[_jid]];
        uint pay = target.Payment;
        address payable [2] memory partici = target.Participant;
        uint256 jobend = StorageJob.getStorageEnd(_jid);
        require(jobend < now);

        if(payresult[0]==0){
            uint pay1 = refundcal(_jid);
            uint pay2 = pay - pay1;

            sendpayment(partici[0], pay1);
            sendpayment(partici[1], pay2);
            uint[3] memory newresult = [1, pay1, pay2];

            PayResult[Jobpayid[_jid]] = newresult;

        }
        
    }

    function refundcal(uint _jid) public view  returns (uint) {

        uint fid = StorageJob.getFileID(_jid);
        uint pid = StorageJob.getJobProject(_jid);
        uint256[4] memory at = StorageJob.getAccessTime(_jid);
        uint fsize = StorageJob.getFileSize(_jid);
        uint day = JobDays[_jid];
        uint price = StorageProject.getPrice(pid);
        
        uint hour1 = FileLog.getrefundhour(fid, at[0], at[1], day);
        uint hour2 = 0;
        if(at[2]!=at[3]){
            hour2 = FileLog.getrefundhour(fid, at[2], at[3], day);
        }

        uint refund = (hour1 + hour2) * price * fsize;

        return refund;

    }

    function sendpayment(address payable _getter, uint _pay) public payable  {
        _getter.transfer(_pay);
    }

    function getpaymentresult(uint _tid) public view  returns (uint[3] memory) {        

        return (PayResult[Jobpayid[_tid]]) ;

    }

    function getpayment(uint _jid) public view  returns (uint) {

        return (paymentinfos[Jobpayid[_jid]].Payment);

    }

    function getpmid(uint _jid) public view  returns (uint) {

		    return (Jobpayid[_jid]) ;

  	}

    function paytest(uint _tid) public payable  {
        

        testyn[_tid] = 1;

    }

    mapping (uint => uint) public testyn;

    function paybacktest(address payable _getter) public payable  {
        

        _getter.transfer(1000000000000000000);

    }

    function ctestpayment() public  {

        address payable [2] memory _Partic = StorageJob.getParticipant(0);
        uint id1 = paymentinfos.push(paymentinfo(0, _Partic, 1080));
        uint id2 = paymentinfos.push(paymentinfo(1, _Partic, 1080));
        uint id3 = paymentinfos.push(paymentinfo(2, _Partic, 1080));

        Jobpayid[0] = 0;
        Jobpayid[1] = 1;
        Jobpayid[2] = 2;
        JobDays[0] = 8;
        JobDays[1] = 8;
        JobDays[2] = 8;

    }
 

}