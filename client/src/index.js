import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import JS2_CheckMetamask from './JS2_CheckMetamask';
import JS4_FileUpload from './JS4_FileUpload';
import JS5_SelectPage from './JS5_SelectPage';
import JS6_FileSearch from './JS6_FileSearch';
import JS8_FileManage from './JS8_FileManage';
import JS9_FileShareCheck from './JS9_FileShareCheck';
import JS10_StorageProject from './JS10_StorageProject';
import JS11_StorageJob from './JS11_StorageJob';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

const main = () => (
    <div>
        <JS2_CheckMetamask/>
        <App/>
    </div>
)

ReactDOM.render(

<BrowserRouter>
    <div>
    <ul>
        <li><Link to = "/" onClick={() => window.location.href="/"}>返回登入頁面</Link></li>
    </ul>
        <Switch>
            <Route exact path = "/" component = {main} />
            <Route  path = "/start" component = {JS5_SelectPage} />
            <Route  path = "/fileupload" component = {JS4_FileUpload} />
            <Route  path = "/filesearch" component = {JS6_FileSearch} />
            <Route  path = "/filemanage" component = {JS8_FileManage} />
            <Route  path = "/sharecheck" component = {JS9_FileShareCheck} />
            <Route  path = "/storageProject" component = {JS10_StorageProject} />
            <Route  path = "/storageJob" component = {JS11_StorageJob} />
        </Switch> 
        </div>
</BrowserRouter>
, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//
serviceWorker.unregister();
