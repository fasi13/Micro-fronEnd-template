const PROXY_CONFIG = [
    {
        context: [
            '/users',
            '/application'
        ],
        target: 'https://toolsservices-qa.awardcenter.com',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;