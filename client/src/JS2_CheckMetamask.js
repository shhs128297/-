import React, { useState } from 'react';

function JS2_CheckMetamask(){
  
  const ethereum = window.ethereum;
  const [addr, setAddr] = useState('');

  if(ethereum){
    ethereum.on('accountsChanged', function (accounts) {
      setAddr(accounts[0]);
    })
  }

  return(
    <div>
      <h1> 切換帳號 </h1>
      {ethereum && <p>重新整理以使用帳號: {addr}</p>}
      {!ethereum && <p>請使用chrome啟動metamask</p>}
    </div>
  );
}

export default JS2_CheckMetamask ;