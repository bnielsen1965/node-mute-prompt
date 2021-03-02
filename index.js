'use strict';

const ReadLine = require('readline');
const Writable = require('stream').Writable;

class MutePrompt {
  constructor () {
    this.stdout = this.createStdoutInterface();
    this.unmuteStdout();
    this.stdin = this.createStdinInterface(this.stdout);
  }

  // prompt with a question
  async question (query, muted) {
    if (muted) {
      // show query before muting
      this.stdout.write(query);
      this.muteStdout();
    }
    let response = await new Promise((resolve, reject) => this.stdin.question(query, response => resolve(response)));
    if (muted) {
      this.unmuteStdout();
      this.stdout.write('\n'); // add the muted new line
    }
    return response;
  }

  // create the stdin interface for the prompt
  createStdinInterface (stdout) {
    return ReadLine.createInterface({
      input: process.stdin,
      output: stdout,
      terminal: true
    });
  }

  // create the stdout interface for the prompt
  createStdoutInterface () {
    return new Writable({
      write: function (chunk, encoding, callback) {
        if (!this.muted) process.stdout.write(chunk, encoding);
        callback();
      }
    });
  }

  // mute stdout output
  muteStdout () {
    this.stdout.muted = true;
  }

  // unmute stdout output
  unmuteStdout () {
    this.stdout.muted = false;
  }

  close () {
    this.stdin.close();
    this.stdin = null;
    this.stdout.end();
    this.stdout = null;
  }
}

module.exports = MutePrompt;
