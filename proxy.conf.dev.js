const PROXY_CONFIG = [
    {
        context: [
            '/users',
            '/application'
        ],
        target: 'https://toolsservices-qa.awardcenter.com',
        // target: '172.16.1.124:51367',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;