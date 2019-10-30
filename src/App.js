import React from 'react';
import { CometChat } from '@cometchat-pro/chat';

import 'react-chatbox-component/dist/style.css';
import './App.css';
import Chat from './components/Chat';

CometChat.init(process.env.REACT_APP_COMETCHAT_APP_ID);

class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount(){
    this.promptUsername();
  }

  handleLogin = username => {
    if(!username){
        alert("Username must not be empty");
        this.promptUsername();
    }
    CometChat.login(username, process.env.REACT_APP_COMETCHAT_API_KEY).then(
      user => {
        alert("Login Successful");
        this.setState({ user: user })
      },
      error => {
        console.log(error);
        alert("Login Failed");
        this.promptUsername();
      }
    );
  };

  promptUsername = () => {
    const username = prompt("Welcome to React chat app powered by CometChat. Login with the username superhero1 or superhero2.");
    this.handleLogin(username);
  }

  render() {
    const {user} = this.state;
    // Render Chat component when user state is not null
    if (user) {
      return <Chat user={user} />;
    } else {
      return false;
    }
  }
}

export default App;
