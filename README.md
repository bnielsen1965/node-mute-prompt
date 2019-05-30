# mute-prompt

A utility used to generate command line prompts that have the keyboard input muted.

In some cases a user prompt at the command line should mute the output from the
keyboard to protect user input, i.e. when entering a password. This module is used
to generate a command line prompt question that can be muted to hide user input.


# install

> npm --save install mute-prompt


# usage

```javascript
const MutePrompt = require('mute-prompt');
let prompt = new MutePrompt();

let username, password;

// ask for username without muting output
prompt.question("Username: ")
  .then((answer) => {
    username = answer;
    return prompt.question("(muted) Question 2? ", true);
  })
  .then((answer) => {
    console.log('Answer 2:', answer);
    return prompt.question("(unmuted) Question 3? ");
  })
  .then((answer) => {
    console.log('Answer 3:', answer);
    return prompt.question("(muted) Question 4? ", true);
  })
  .then((answer) => {
    console.log('Answer 4:', answer);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error.stack);
    process.exit(1);
  });
```
