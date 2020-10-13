// const { Console } = require('console');
// Note this object is purely in memory
// Recipies from - https://www.allrecipes.com/recipe/221261/peanut-butter-banana-smoothie/
//               -
const users = {
  BananaPeanutButterSmoothie: {
    name: 'Banana Peanut Butter Smoothie',
    author: 'Becca',
    serves: '4',
    ingredients: '2 Bananas, 2 cups milk, 1/2 cup peanut butter, 2 tablespoons honey, 2 cups ice cubes',
    instruction: 'Put items in blender, blend until smooth',
  },

  Applesauce: {
    name: 'Applesauce',
    author: 'Sarah',
    serves: '4',
    ingredients: '4 apples, 3/4 cups water, 1/4 cup white sugar, 1/2 teaspoon cinnamon',
    instruction: 'Put items in saucepan, cook at medium heat for 15 to 20 minutes, until apples are soft. Allow to cool, then mush with a fork',
  },

};

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

const getUsers = (request, response, params) => {
  // create a parent object to hold the users object
  // we could add a message, status code etc ... to this parent object
  let userResp = {};
  let responseJSON = {};

  if (params.search === null || params.search === undefined) {
    // console.dir('HERE II');
    userResp = users;
    responseJSON = {
      userResp,
    };
  } else {
    Object.keys(users).forEach((key) => {
      if (users[key].name === params.search) {
        // userResp = {key : users[key] };
        userResp[key] = users[key];
        // console.dir('HEREIII');
      }
    });

    responseJSON = {
      userResp,
    };
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
  // would also be nice to calculate file size, last-modified date etc ...
  // and send that too
  respondJSONMeta(request, response, 200);
};

const addUser = (request, response, body) => {
  // adds user to the List
  const responseJSON = {
    message: 'need name, author, body, and instructions',
  };

  if (!body.name || !body.author || !body.serves || !body.ingredients || !body.instruction) {
    responseJSON.id = 'missingParams';

    // console.dir(body.name + ', ' + body.author + ', ' + body.serves + ', ' + body.instruction);
    return respondJSON(request, response, 400, responseJSON); // 400=bad request
  }

  // we got recipe
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
  users[body.name].ingredients = body.ingredients;
  users[body.name].instruction = body.instruction;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // console.dir(users);

  return respondJSON(request, response, responseCode, responseJSON);
  // this is for 204, a "no content" header
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
  addUser,
};
