import http from 'http'

const get = (endpoint) => new Promise((resolve, reject) => {
    // you need a proxy to NOAH
    // you can use this https://github.com/xtrycatchx/cors-bypass
    const options = {
        host: 'localhost',
        port: 2000,
        path: `/${endpoint}`,
        method: 'GET'
    };

    const req = http.request(options, res => {
        let body = [];
        res.on('data', chunk => {
            body.push(chunk)
        })
        res.on('end', () => {
            resolve(body.join(''))
        })
    })

    //req.write(body)
    req.end()
    req.on('error', e => {
        reject(e)
    })
});

export default get;
