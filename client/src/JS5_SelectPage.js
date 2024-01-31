import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

function JS5_SelectPage(){
  


  return(
    <div align="center">
      <li><Link to = "/fileupload" onClick={() => window.location.href="/fileupload"}>檔案上傳</Link></li>
      <li><Link to = "/filesearch" onClick={() => window.location.href="/filesearch"}>檔案查詢</Link></li>
      <li><Link to = "/filemanage" onClick={() => window.location.href="/filemanage"}>檔案管理</Link></li>
      <li><Link to = "/storageProject" onClick={() => window.location.href="/storageProject"}>建立、履行服務</Link></li>
      <li><Link to = "/storageJob" onClick={() => window.location.href="/storageJob"}>終止儲存服務</Link></li>

    </div>
  );
}

export default JS5_SelectPage ;