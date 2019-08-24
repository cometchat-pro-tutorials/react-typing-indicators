import React from 'react';
import { CometChat } from '@cometchat-pro/chat';

import 'react-chatbox-component/dist/style.css';
import './App.css';
import Login from './components/Login';
import Chat from './components/Chat';

CometChat.init(process.env.REACT_APP_COMETCHAT_APP_ID);

class App extends React.Component {
  state = {
    user: null,
  };

  setUser = user => {
    this.setState({ user: user })
  }

  render() {
    const {user} = this.state;
    // Render Chat component when user state is not null
    if (user) {
      return <Chat user={user} />;
    } else {
      return <Login setUser={this.setUser} />;
    }
  }
}

export default App;
