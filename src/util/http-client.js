import http from 'http'
import zlib from 'zlib'

const get = (endpoint) => new Promise((resolve, reject) => {
    // you need a proxy to NOAH
    // you can use this https://github.com/xtrycatchx/cors-bypass
    const options = {
        host: 'localhost',
        port: 2000,
        path: `/${endpoint}`,
        method: 'GET',
        headers: {
            'accept-encoding': 'gzip,deflate'
        }
    };

    const req = http.request(options, res => {
        const chunks = [];
        res.on('data', chunk => {
            chunks.push(chunk);
        });

        res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const encoding = res.headers['content-encoding'];
            if (encoding === 'gzip') {
                console.log("supports GZIP")
                zlib.gunzip(buffer, (err, decoded) => {
                    err ? reject(err) : resolve(decoded.toString());
                });
            } else if (encoding === 'deflate') {
                console.log("supports DEFLATE")
                zlib.inflate(buffer, (err, decoded) => {
                    err ? reject(err) : resolve(decoded.toString());
                })
            } else {
                console.log("no compression")
                resolve(buffer.toString());
            }
        })
    })
    req.end()
    req.on('error', e => {
        reject(e)
    })
});

export default get;
