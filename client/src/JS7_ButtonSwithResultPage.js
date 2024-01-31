
import React from 'react'


function JS7_ButtonSwithResultPage(props) {

   
  async function minus5() {    
    await props.set(-5)


  }

  async function plus5() {    
    await props.set(5)


  }

  return (
    <div className="JS7_ButtonSwithResultPage">


      <div><button type="button" onClick={minus5}> 上一頁 </button> <button type="button" onClick={plus5}> 下一頁 </button></div>


    </div>
  );
}

export default JS7_ButtonSwithResultPage ;