
import React, { useState } from 'react'
import { create } from 'ipfs-http-client'

const client = create('/ip4/127.0.0.1/tcp/5001')

function JS3_IPFSupload(props) {
  const [file, updateFile] = useState(``);
  const [fileUrl, updateFileUrl] = useState(``);
  const [fileKB, updateFileKB] = useState(``);
  const [info, updateInfo] = useState(``);
  const encfname = props.encname ;

  const [filet, updateFileT] = useState(``);

  async function UploadtoIPFS() {
    
    try {
      const added = await client.add(file,{
        pin: true  
      }) ;
      const url = await `${added.path}`;
      await updateFileUrl(url);
      await CompleteInfo(url);

    



    } catch (error) {
      console.log('Error uploading file: ', error);
    }  
  };

  async function CompleteInfo(Url) {    

      await props.seturl(Url);
      await props.Complete(Url, fileKB);

  };

  async function FileInput(e) {
    
    try {
        const filer = e.target.files[0];
        const filen = e.target.files[0].name;
        const filez =  e.target.files[0].size;
        const filekb = Math.floor((filez/1000)+1);
        if(filen==encfname){
          await updateFile(filer);
          await updateFileKB(filekb);
          await updateInfo("");
        }
        else{
          await updateInfo("請選擇先前加密檔案");
        }

        

    } catch (error) {
        console.log('Error uploading file: ', error)
        await updateFile("");
    }  
  };
  
 

  return (
    <div className="JS3_IPFSupload">
      <h1>上傳檔案至IPFS</h1>
      <input type = "file" onChange = {FileInput} accept=".enc"/> 
      <div>請選擇{encfname}</div>
      <div>{info}</div>
      <div>檔案大小：{fileKB}KB</div>
      <div><button type="button" onClick={UploadtoIPFS}> 上傳檔案 </button> </div>
      <div>上傳完成的檔案位址：{fileUrl} </div>
      <p></p>
      <div>{filet}</div>


    </div>
  );
}

export default JS3_IPFSupload ;