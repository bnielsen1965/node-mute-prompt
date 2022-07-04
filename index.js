'use strict';

const ReadLine = require('readline');
const Writable = require('stream').Writable;

class MutePrompt {

  //////////////////////////////////////////
  // instance methods for stateful prompt //
  //////////////////////////////////////////

  // create stateful instance
  constructor (settings) {
    let { stdout, stdin } = MutePrompt.createInterfaces(settings);
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
  static async prompt (query, settings) {
    let { stdout, stdin } = MutePrompt.createInterfaces(settings);
    let response = await MutePrompt.execQuestion(query, stdin, stdout, settings);
    MutePrompt.stopInterfaces(stdin, stdout);
    return response;
  }

  // stateful prompt
  async question (query, settings = {}) {
    return await MutePrompt.execQuestion(query, this.stdin, this.stdout, settings);
  }

  // disable stateful completer
  disableCompleter () {
    this.stdin.isCompletionEnabled = false;
  }

  // enable stateful completer
  enableCompleter () {
    this.stdin.isCompletionEnabled = true;
  }

  // execute prompt with question
  static async execQuestion (query, stdin, stdout, settings = {}) {
    if (settings.muted) {
      // show query before muting
      stdout.write(query);
      MutePrompt.muteStdout(stdout);
    }
    let response = await new Promise((resolve, reject) => {
      stdin.question(query, response => resolve(response));
      if (settings.preset) stdin.write(settings.preset);
    });
    if (settings.muted) {
      MutePrompt.unmuteStdout(stdout);
      stdout.write('\n'); // add the muted new line
    }
    return response;
  }



  /////////////////////////////////
  // character interface methods //
  /////////////////////////////////

  // create interfaces
  static createInterfaces (settings = {}) {
    let stdout = MutePrompt.createStdoutInterface();
    MutePrompt.unmuteStdout(stdout);
    let stdin = MutePrompt.createStdinInterface(stdout, settings);
    return { stdout, stdin };
  }

  // clean up stateful and stateless interfaces
  static stopInterfaces (stdin, stdout) {
    stdin.close();
    stdout.end();
  }

  // create the stdin interface for the prompt
  static createStdinInterface (stdout, settings) {
    let options = {
      input: process.stdin,
      output: stdout,
      terminal: true
    };
    if (settings.completer) options.completer = settings.completer;
    else if (settings.completions) options.completer = MutePrompt.createCompleter(settings);
    return ReadLine.createInterface(options);
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

  // create completer function for use in readline stdin interface
  static createCompleter (settings) {
    return (line) => {
      // check for completion hits that start with current line content
      let hits = settings.completions.filter((c) => c.startsWith(line));
      if (settings.completeEndings) {
        let words = line.split(' ');
        if (words.length > 1) {
          // check last word in line for match to completions
          let last = words.pop();
          let pattern = new RegExp(`^${last}`);
          settings.completions.map(c => {
            pattern.lastIndex = 0;
            if (pattern.test(c)) hits.push(`${words.join(' ')} ${c}`);
          });
        }
      }
      // Show all completions if none found
      return [hits.length ? hits : settings.completions, line];
    }
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
