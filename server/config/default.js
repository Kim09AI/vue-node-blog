module.exports = {
    port: 3000,
    session: {
        secret: 'vue_node_blog',
        key: 'vue_node_blog',
        maxAge: 2592000000,
    },
    mongodb: 'mongodb://localhost:27017/vue_node_blog',
    'client_id': 'e6659c401d71d105072e',
    'client_secret': 'e85a5e6bf359d6ec05d693056d8fa58279c05d25',
    'scope': ['user'],
    homeUrl: 'http://localhost:8080'
}
