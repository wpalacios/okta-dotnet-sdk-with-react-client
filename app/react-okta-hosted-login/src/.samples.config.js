export default {
    oidc: {
        clientId: '0oaj293esduQgF7Vf0h7',
        issuer: 'https://dev-384718.oktapreview.com/oauth2/default',
        redirectUri: 'http://localhost:8080/implicit/callback',
        scope: 'openid profile email',
    },
    resourceServer: {
        messagesUrl: 'http://localhost:62707/api/messages',
        usersUrl: 'http://localhost:62707/api/users',
    },
};