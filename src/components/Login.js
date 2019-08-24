import React from 'react';
import { CometChat } from '@cometchat-pro/chat';

import loginIllustration from '../assets/login-illustration.svg';

class Login extends React.Component {

  state = {
    username: '',
    isLoading: false,
  };

  handleLogin = event => {
    event.preventDefault();
    let { username } = this.state;
    if(!username){
        alert("Username must not be empty");
      return;
    }
    this.setState({
      isLoading: true
    })
    CometChat.login(username, process.env.REACT_APP_COMETCHAT_API_KEY).then(
      user => {
        alert("Login Successful");
        this.props.setUser(user);
      },
      error => {
        console.log(error);
        alert("Login Failed");
        this.setState({
          isLoading: false
        })
      }
    );
  };


  render() {
    let {username, isLoading} = this.state;
    let loadingSpinner = isLoading? <span className="fa fa-spin fa-spinner"/>  :'';
    return (
      <div className='login-page'>
        <div className='login'>
          <div className='login-container'>
            <div className='login-form-column'>
              <form>
                <h3 className='login-text-header'>Welcome!</h3>
                <p>
                  Login with the username "superhero1" or "superhero2" to test this React-CometChat application. To create your own user, visit{' '}
                  <a href='https://prodocs.cometchat.com/reference#createuser'>
                    our documentation
                  </a>
                </p>
                <div className='form-wrapper'>
                  <label className='login-label'>Username</label>
                  <input
                    type='text'
                    name='username'
                    id='username'
                    placeholder='Enter your username'
                    value={username}
                    onChange={event => this.setState({ username: event.target.value })}
                    className='form-control'
                    required
                  />
                </div>
                <button className='button-submit' type='submit' onClick={this.handleLogin} disabled={isLoading}>
                  LOG IN {loadingSpinner}
                </button>
              </form>
            </div>
            <div className='login-image-column'>
              <div className='image-holder'>
                <img src={loginIllustration} alt='Login illustration' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
