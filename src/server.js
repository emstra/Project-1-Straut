const http = require('http');
const url = require('url');
const query = require('querystring');
const jsonHandler = require('./jsonResponses');
const htmlHandler = require('./htmlResponses');

// const urlStruct = {
//   GET: {
//     '/': htmlHandler.getIndex,
//     '/style.css': htmlHandler.getCSS,
//     '/getUsers': jsonHandler.getUsers,
//     // '/updateUser'   :   jsonHandler.updateUser,
//     notFound: jsonHandler.notFound,
//   },
//   HEAD: {
//     '/getUsers': jsonHandler.getUsersMeta,
//     notFound: jsonHandler.notFoundMeta,
//   },
//   POST: {
//     '/addUser': jsonHandler.updateUser,
//   },
// };

// const onRequest = (request, response) => {
//   const parsedUrl = url.parse(request.url);

//   console.dir(parsedUrl.pathname);
//   console.dir(request.method);

//   // not perfect and will fail if HTTP method is not 'GET' or 'HEAD'
//   if (urlStruct[request.method][parsedUrl.pathname]) {
//     urlStruct[request.method][parsedUrl.pathname](request, response, parsedUrl);
//   } else {
//     urlStruct[request.method].notFound(request, response);
//   }
// };

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];
    
    // https://nodejs.org/api/http.html
    request.on('error', (err) => {
      console.dir(error);
      response.statusCode = 400;
      response.end();
    });
    
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    
    

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      //console.dir("Here");
      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if(request.method === "POST"){
     handlePost(request, response, parsedUrl);
  }else{
    handleGet(request, response, parsedUrl);
  }

};



const port = process.env.PORT || process.env.NODE_PORT || 3000;

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
