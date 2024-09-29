const users = {};

const respondJSON = (request, response, status, obj) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  if (request.method !== 'HEAD' || status !== 204) {
    response.write(JSON.stringify(obj));
  }
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const getUsers = (request, response) => {
  const _respondJSON = {
    users,
  };
  return respondJSON(request, response, 200, _respondJSON);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 204;
  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }
  users[body.name].name = body.name;
  users[body.name].age = body.age;
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getUsers,
  addUser,
  getUsersMeta,
  notFound,
};
