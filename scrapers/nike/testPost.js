const http = require('http');

const data = '';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request('http://example.com/api/data', options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify(data));
req.end();
