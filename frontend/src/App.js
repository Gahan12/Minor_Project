import logo from './logo.svg';
import Sidebar from './My Components/Sidebar';
import Home from './My Components/Home';
import Registration from './My Components/Registration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Details from './My Components/Details';
import React, { useEffect, useState } from 'react';
import abi from './Transaction.json';
import { ethers } from "ethers";
import Login from './My Components/login';
import RegistrationForm from './My Components/Register';
import Success from './My Components/Success_data';


function App() {

  const getLoaclitems = () => {
    const name = localStorage.getItem('username');

    if (name) {
      return localStorage.getItem('username');
    }
    else return '';
  }

  const [username, setUsername] = useState(getLoaclitems());

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  const [login, setLogin] = useState(true);

  useEffect(() => {
    if (window.location.pathname == '/login' || window.location.pathname == '/register') {
      setLogin(false);
    }
    else {
      setLogin(true);
    }
  }, []);
  
  const [user, setUser] = useState([]);

  const [owners, setOwners] = useState([]);

  const getUser = async() => {
    let response = await fetch('http://localhost:5000/register', {
      method: "GET"
    });
    const result = await response.json();
    setUser(result);
  }  

  const getOwners = async () => {
    const response = await fetch('http://localhost:5000/owner', {
      method: 'GET',
    });
    const result = await response.json();
    setOwners(result);
  }

  useEffect(() => {
    getUser();
    getOwners();
  }, []);

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract:null
  });

  const connectWallet = async (add) => {
    const contractAddress =add;
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setState({ provider, signer, contract });
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <Router>
        {login && <Sidebar username={username} setUsername={setUsername} /> }
        <Routes>
          <Route path='/' element={<Home owners={owners} />} />
          <Route path='/Registration' element={<Registration username={username} />} />
          <Route path='/Details' element={<Details users={user} state={state} connect={connectWallet} />} />
          <Route path='login' element={<Login user={user} setUsername={setUsername} />} />
          <Route path='/register' element={<RegistrationForm user={user} />} />
          <Route path='/success' element={<Success owners={owners} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
