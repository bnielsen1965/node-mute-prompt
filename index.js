'use strict';

const ReadLine = require('readline');
const Writable = require('stream').Writable;

class MutePrompt {

  //////////////////////////////////////////
  // instance methods for stateful prompt //
  //////////////////////////////////////////

  // create stateful instance
  constructor () {
    let { stdout, stdin } = MutePrompt.createInterfaces();
    this.stdout = stdout;
    this.stdin = stdin;
  }

  // destroy stateful instance
  destroy () {
    MutePrompt.stopInterfaces(this.stdin, this.stdout);
    delete this.stdin;
    delete this.stdout;
  }



  //////////////////////////
  // query prompt methods //
  //////////////////////////

  // stateless prompt
  static async prompt (query, muted) {
    let { stdout, stdin } = MutePrompt.createInterfaces();
    let response = await MutePrompt.execQuestion(query, stdin, stdout, muted);
    MutePrompt.stopInterfaces(stdin, stdout);
    return response;
  }

  // stateful prompt
  async question (query, muted) {
    return await MutePrompt.execQuestion(query, this.stdin, this.stdout, muted);
  }

  // execute prompt with question
  static async execQuestion (query, stdin, stdout, muted) {
    if (muted) {
      // show query before muting
      stdout.write(query);
      MutePrompt.muteStdout(stdout);
    }
    let response = await new Promise((resolve, reject) => stdin.question(query, response => resolve(response)));
    if (muted) {
      MutePrompt.unmuteStdout(stdout);
      stdout.write('\n'); // add the muted new line
    }
    return response;
  }



  /////////////////////////////////
  // character interface methods //
  /////////////////////////////////

  // create interfaces
  static createInterfaces () {
    let stdout = MutePrompt.createStdoutInterface();
    MutePrompt.unmuteStdout(stdout);
    let stdin = MutePrompt.createStdinInterface(stdout);
    return { stdout, stdin };
  }

  // clean up stateful and stateless interfaces
  static stopInterfaces (stdin, stdout) {
    stdin.close();
    stdout.end();
  }

  // create the stdin interface for the prompt
  static createStdinInterface (stdout) {
    return ReadLine.createInterface({
      input: process.stdin,
      output: stdout,
      terminal: true
    });
  }

  // create the stdout interface for the prompt
  static createStdoutInterface () {
    return new Writable({
      write: function (chunk, encoding, callback) {
        if (!this.muted) process.stderr.write(chunk, encoding);
        callback();
      }
    });
  }

  // mute stdout output
  static muteStdout (stdout) {
    stdout.muted = true;
  }

  // unmute stdout output
  static unmuteStdout (stdout) {
    stdout.muted = false;
  }

}

module.exports = MutePrompt;
