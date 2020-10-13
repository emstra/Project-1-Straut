const http = require('http');
const url = require('url');
const query = require('querystring');
const jsonHandler = require('./jsonResponses');
const htmlHandler = require('./htmlResponses');

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      // console.dir("Here");
      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl, params) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    // console.dir(params.search);
    jsonHandler.getUsers(request, response, params);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  // console.dir(params);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
    // console.dir('posting');
  } else {
    handleGet(request, response, parsedUrl, params);
    // console.dir(`getting${parsedUrl.pathname}`);
  }
};

const port = process.env.PORT || process.env.NODE_PORT || 3000;

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
