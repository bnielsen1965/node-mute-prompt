'use strict';

const ReadLine = require('readline');
const WritableStream = require('stream').Writable;

// prompt with a question
async function question (query, muted) {
  let stdout = createStdoutInterface();
  let stdin = createStdinInterface(stdout);

  if (muted) {
    // show query before muting
    stdout.write(query);
    stdout.muted = true;
  }
  let response = await new Promise((resolve, reject) => stdin.question(query, response => resolve(response)));
  if (muted) {
    stdout.muted = false;
    stdout.write('\n'); // add the muted new line
  }

  stdin.close();
  stdout.end();

  return response;
}

// create the stdin interface for the prompt
function createStdinInterface (stdout) {
  return ReadLine.createInterface({
    input: process.stdin,
    output: stdout,
    terminal: true
  });
}

// create the stdout interface for the prompt
function createStdoutInterface () {
  return new WritableStream({
    write: function (chunk, encoding, callback) {
      if (!this.muted) process.stdout.write(chunk, encoding);
      callback();
    }
  });
}

module.exports = question;
