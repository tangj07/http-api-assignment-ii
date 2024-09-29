const http = require('http');
const url = require('url');
const query = require('querystring');
const html = require('./htmlResponses.js');
const jsonResponses = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': html.getIndex,
    '/style.css': html.getCSS,
    '/getUsers': jsonResponses.getUsers,
    notFound: jsonResponses.notFound,
  },
  HEAD: {
    '/getUsers': jsonResponses.getUsersMeta,
    notFound: jsonResponses.notFound,
  },
};

const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addUser') {
    parseBody(request, response, jsonResponses.addUser);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }
  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response);
  }
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
  return urlStruct[request.method].notFound(request, response);
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  // console.log(`Listening on 127.0.0.1:${port}`);
});
