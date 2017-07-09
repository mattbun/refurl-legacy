'use strict';

const boom = require('boom');
const fs = require('fs');
const path = require('path');

const db = require('./database');
const config = require('./config');

function pageHandler(request, reply) {
  let link = db.getLink(request.params.key);

  if (!link) {
    return reply(boom.notFound());
  } else if (link.length) {  // If there are multiple, go with the first
    link = link[0];
  }

  reply.view('download', {
    key: link.key,
    name: link.name,
    path: link.path,
    isDir: fs.lstatSync(path.join(config.rootPath, link.path)).isDirectory(),
  });
}

function downloadHandler(request, reply) {
  let link = db.getLink(request.params.key);

  if (!link) {
    return reply(boom.notFound());
  } else if (link.length) {  // If there are multiple, go with the first
    link = link[0];
  }

  const fullPath = path.join(config.rootPath, link.path);

  if (fs.lstatSync(fullPath).isDirectory()) {
    // TODO do something for a directory
  } else {
    reply.file(path.join(config.rootPath, link.path), {
      confine: false,
      mode: 'attachment'
    });
  }
}

module.exports = {
  downloadHandler,
  pageHandler,
};