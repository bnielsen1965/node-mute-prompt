# mute-prompt

A utility used to generate command line prompts that have the keyboard input
muted.

In some cases a user prompt at the command line should mute the output from the
keyboard to protect user input, i.e. when entering a password. This module is
used to generate a command line prompt question that can be muted to hide user
input.


# install

> npm --save install mute-prompt


# usage

The module is used in terminal applications and imports as a single method to
prompt the user with a question.


## prompt (question, [muted])

The prompt method returns a promise that resolves with the user input. The
prompt method accepts two parameters, a string for the question printed on
screen and an optional boolean to enable the muted input mode.

When calling the question method without a muted parameter the muted value
defaults to false and user input will be visible as they enter their answer at
the prompt.
```javascript
// ask question without muted input
prompt("Username: ")
  .then((answer) => {
    console.log(`User answered ${answer}`);
  });
```

When asking a user question with a sensitive answer the muted parameter should
be set to true and the user input will not be visible as they enter their
answer.
```javascript
// ask question with muted input to protect answer
prompt("Password: ", true)
  .then((answer) => {
    console.log(`User answered ${answer}`);
  });
```


## example

```javascript
const prompt = require('mute-prompt');

let username, password;

(async function login() {
  // ask for username without muting output
  let username = await prompt("Username: ");
    // ask for password with output muted
  let password = await prompt("Password: ", true);
  return {username, password};
})()
  .then((login) => {
    console.log(`Login: ${login.username}/${login.password}`);
  })
  .catch((error) => {
    console.log(error.stack);
    process.exitCode = 1;
  });
```
