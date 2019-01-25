import { withAuth } from '@okta/okta-react';
import React, { Component } from 'react';
import { Header, Icon, Message } from 'semantic-ui-react';

import config from './.samples.config';

export default withAuth(class UserAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      user: {},
      failed: null
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {

    try {
      const userObj = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        login: this.state.email,
        password: this.state.password
      }

      const baseUrl = config.resourceServer.usersUrl;
      const accessToken = await this.props.auth.getAccessToken();

      /* global fetch */
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userObj)
      });

      if (response.status !== 200) {
        this.setState({ failed: true });
        return;
      }

      const user = await response.json();

      /* eslint-disable no-console */
      console.log(user);

      this.setState({ user });
      let path = '/Users';
      this.props.history.push(path);
    } catch (error) {
      this.setState({ failed: true });
      /* eslint-disable no-console */
      console.error(error);
      event.preventDefault();
    }

  }


  render() {
    return (
      <form>
        <h2>Profile</h2>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text"
            name="firstName"
            id="firstName"
            value={this.state.firstName}
            onChange={this.handleInputChange} />
        </div>
        <br></br>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type="text"
            name="lastName"
            id="lastName"
            value={this.state.lastName}
            onChange={this.handleInputChange} />
        </div>
        <br></br>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={this.handleInputChange} />
        </div>
        <br></br>

        <div>
          <label htmlFor="email">Password</label>
          <input type="password"
            name="password"
            id="password"
            value={this.state.password}
            onChange={this.handleInputChange} />
        </div>
        <br></br>
        <input type="button" value="Submit" onClick={this.handleSubmit} />
      </form>
    );
  }

});
