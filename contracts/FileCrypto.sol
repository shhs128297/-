pragma solidity >=0.4.21 <0.7.0;

contract FileCrypto  {


    struct cryptoinfo{
        
        uint CryptoType;
        string[4] KeyData;
        
    }

    cryptoinfo[] public cryptoinfos;
    mapping (address => uint) public cryptoidnow;

    function settype1(address _uploader, string memory _KeyData1 ) public  {

//        uint cid = cryptoinfos.push(cryptoinfo(1, _KeyData1,"","","")) - 1;
        string[4] memory kd = [_KeyData1,"","",""] ;
        uint cid = cryptoinfos.push(cryptoinfo(1, kd)) - 1;
        cryptoidnow[_uploader] = cid;        
        
    }

    function settype2(address _uploader, string memory _KeyData1, string memory _KeyData2, string memory _KeyData3, string memory _KeyData4 ) public  {
        
        string[4] memory kd = [_KeyData1, _KeyData2, _KeyData3, _KeyData4] ;
        uint cid = cryptoinfos.push(cryptoinfo(2, kd)) - 1;
        cryptoidnow[_uploader] = cid;       
        
    }

    function getcid(address _uploader) public view  returns (uint) {

        return (cryptoidnow[_uploader]);       
        
    }

    function gettype1(uint _cryptoid) public view  returns (string memory){
    
        return (cryptoinfos[_cryptoid].KeyData[0]);
        
    }

    function gettype2(uint _cryptoid) public view  returns (string memory){
    
        return (cryptoinfos[_cryptoid].KeyData[1]);
        
    }

    function gettype3(uint _cryptoid) public view  returns (string memory){
    
        return (cryptoinfos[_cryptoid].KeyData[2]);
        
    }

    function gettype4(uint _cryptoid) public view  returns (string memory){
    
        return (cryptoinfos[_cryptoid].KeyData[3]);
        
    }



}