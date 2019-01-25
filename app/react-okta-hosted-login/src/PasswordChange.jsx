import React, { Component } from 'react';
import withAuth from '@okta/okta-react/dist/withAuth';
import { Button, Form, Message } from 'semantic-ui-react';

import config from './.samples.config';

export default withAuth(class PasswordChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: null,
            newPassword: null,
            passwordConfirm: null,
            failed: null,
            error: null,
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

    async handleSubmit() {
        const currentPassword = this.state.currentPassword;
        const newPassword = this.state.newPassword;
        const passwordConfirm = this.state.passwordConfirm;

        if (passwordConfirm !== newPassword) {
            this.setState({ failed: true });
            this.setState({ error: 'New Password and Password Confirmation do not match!' })
            return;
        }

        const user = await this.props.auth.getUser();
        const accessToken = await this.props.auth.getAccessToken();
        const baseUrl = config.resourceServer.usersUrl;
        const changePasswordUrl = `${baseUrl}/${user.sub}/password`;
        const credentials = { currentPassword, newPassword };

        /* global fetch */
        const response = await fetch(changePasswordUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(credentials)
        });

        if (response.status !== 200) {
            this.setState({ failed: true });
            return;
        }

        let path = '/Details';
        this.props.history.push(path);
    }

    render() {
        return (
            <div>
                {
                    this.state.failed === true &&
                    <Message error header={this.state.error} />
                }

                <Form>
                    <Form.Field>
                        <label>Current Password</label>
                        <input type="password"
                            placeholder='Current Password'
                            name="currentPassword"
                            id="currentPassword"
                            value={this.state.currentPassword}
                            onChange={this.handleInputChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>New Password</label>
                        <input type="password"
                            placeholder='New Password'
                            name="newPassword"
                            id="newPassword"
                            value={this.state.newPassword}
                            onChange={this.handleInputChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm New Password</label>
                        <input type="password"
                            placeholder='Confirm New Password'
                            name="passwordConfirm"
                            id="passwordConfirm"
                            value={this.state.passwordConfirm}
                            onChange={this.handleInputChange} />
                    </Form.Field>
                    <Button type='submit' onClick={() => { this.handleSubmit() }}>Submit</Button>
                </Form>
            </div>
        );
    }
});