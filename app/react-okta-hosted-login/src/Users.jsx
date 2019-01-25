import { withAuth } from '@okta/okta-react';
import React, { Component } from 'react';
import { Header, Icon, Message, Table, Button } from 'semantic-ui-react';

import config from './.samples.config';

export default withAuth(class Users extends Component {
    constructor(props) {
        super(props);
        this.state = { users: null, failed: null, failedActivation: null }
        this.handleAdd = this.handleAdd.bind(this);
        this.handleActivation = this.handleActivation.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    handleAdd() {
        let path = '/UserAdd';
        this.props.history.push(path);
    }

    async handleActivation(userId) {
        const baseUrl = config.resourceServer.usersUrl;
        const accessToken = await this.props.auth.getAccessToken();
        const activationUrl = `${baseUrl}/${userId}/activation`;

        const response = await fetch(activationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        if (response.status !== 200) {
            this.setState({ failedActivation: true });
            return;
        }

        const data = await response.json();
        const users = this.state.users;
        const index = users.findIndex(u => u.id === data.user.id);
        if (index !== -1) {
            users[index].status.value = "ACTIVE";
            this.setState({ users });
        }
    }

    async handleDelete(userId) {
        const baseUrl = config.resourceServer.usersUrl;
        const accessToken = await this.props.auth.getAccessToken();
        const deactivationUrl = `${baseUrl}/${userId}/deactivation`;

        const response = await fetch(deactivationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        if (response.status !== 200) {
            this.setState({ failedActivation: true });
            return;
        }

        const data = await response.json();
        const users = this.state.users;
        const index = users.findIndex(u => u.id === data.user.id);
        if (index !== -1) {
            users[index].status.value = "ACTIVE";
            this.setState({ users });
        }
    }

    // TODO: Implement edit method
    async handleEdit(user) {
        return;
    }

    async getUsers() {
        try {
            const accessToken = await this.props.auth.getAccessToken();

            const response = await fetch(config.resourceServer.usersUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status !== 200) {
                this.setState({ failed: true });
                return;
            }

            const users = await response.json();

            console.log(typeof (users));
            console.log(users);

            this.setState({ users });

        } catch (err) {
            this.setState({ failed: true });
            /* eslint-disable no-console */
            console.error(err);
        }
    }

    render() {
        return (
            <div>
                <Header as="h1"><Icon name="users" /> Users</Header>
                <Button.Group>
                    <Button onClick={this.handleAdd}>Add User</Button>
                </Button.Group>
                {
                    this.state.failed === true &&
                    <Message error header="Failed to fetch users." />
                }
                {
                    this.state.failedActivation === true &&
                    <Message error header="An error ocurred trying to activate the user." />
                }
                {this.state.users && !this.state.failed &&
                    <Table celled selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.users.map(user =>
                                <Table.Row id={user.id} key={user.id}>
                                    <Table.Cell>{`${user.profile.firstName} ${user.profile.lastName}`}</Table.Cell>
                                    <Table.Cell>{user.profile.email}</Table.Cell>
                                    <Table.Cell textAlign='center'>
                                        {user.status.value === 'ACTIVE' ? (
                                            <Icon color="green" name="checkmark" />
                                        ) : (
                                            user.status.value
                                        )}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {user.status.value === 'ACTIVE' ? (
                                            <Button icon='trash' value="deactivate" onClick={() => { this.handleDelete(user.id) }} />
                                        ) : (
                                                <Button icon='checkmark' onClick={() => { this.handleActivation(user.id) }} />
                                            )}
                                        <Button icon='edit' onClick={() => { this.handleEdit(user) }} />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                }
            </div>
        );
    }
});