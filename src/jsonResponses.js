// const { Console } = require('console');
const query = require('querystring');
// Note this object is purely in memory
const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};



const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  // no content to send, just headers!
  response.writeHead(status, headers);
  response.end();
};



const getUsers = (request, response) => {
  // create a parent object to hold the users object
  // we could add a message, status code etc ... to this parent object
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};



const getUsersMeta = (request, response) => {
  // would also be nice to calculate file size, last-modified date etc ...
  // and send that too
  respondJSONMeta(request, response, 200);
};

// const updateUser = (request, response, parsedUrl) => {
//   const newUser = {
//     createdAt: Date.now(),
//   };

//   users[newUser.createdAt] = newUser; // never do this in the real world!
//   // 201 status code == "created"
//   return respondJSON(request, response, 201, newUser);
// };



const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'need name, author, body, and instructions',
  };

  if (!body.name || !body.author || !body.serves || !body.instruction) {
    responseJSON.id = 'missingParams';

    // console.log(body.name + ', ' + body.author + ', ' + body.serves + ', ' + body.nameii);
    return respondJSON(request, response, 400, responseJSON); // 400=bad request
  }

  // we got recipie
  let responseCode = 201; // "created"
  if (users[body.name]) { // recipe exists
    responseCode = 204; // updating, so "no content"
  } else {
    users[body.name] = {}; // make a new user
  }

  // update or initialize values, as the case may be
  users[body.name].name = body.name;
  users[body.name].author = body.author;
  users[body.name].serves = body.serves;
  users[body.name].instruction = body.instruction;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode); // this is for 204, a "no content" header
};



const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser
};
