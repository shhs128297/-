pragma solidity >=0.4.21 <0.7.0;

contract Identity {

  
	mapping(address => uint) public isRegister;
	mapping(address => string) public UserPublicKey;


	function register(address _user, string memory publickey) public  {
		
		
		require(isRegister[_user] != 1);
			
			isRegister[_user] = 1;
			UserPublicKey[_user] = publickey;


  	}

  	function check(address _user) public view returns (uint) {
		
		uint usercheck = isRegister[_user] ;
		
		return usercheck ;

  	}

	function getpublickey(address _user) public view returns (string memory) {
		
		string memory pubkey = UserPublicKey[_user];
		
		return pubkey ;

  	}

}
