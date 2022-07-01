# mute-prompt

A utility used to generate command line prompts that have the keyboard input muted.

In some cases a user prompt at the command line should mute the output from the
keyboard to protect user input, i.e. when entering a password. This module is used
to generate a command line prompt question that can be muted to hide user input.

Prompt text is presented on the stderr interface to enable piping output to
other scripts or files on the command line.


# install

> npm --save install mute-prompt


# usage

The module is used in terminal applications and imports as a class with static
methods that allow stateless use when processing a few prompts or as an stateful
instance when many or continuous prompts will are required.


## stateful vs stateless

When a mute-prompt instance is created it will retain stateful character interfaces
that are reused for each question. Using a stateful instance is more efficient
when an application makes multiple repeated user queries.

The static *prompt()* method is stateless and recreates the character interfaces
for each prompt. A stateless prompt is an easier and cleaner application method
when an application only makes a handful of one time queries.


## question (message, [muted], [preset])

The question method is used as a stateful prompt and returns a promise that
resolves with the user input. The question method accepts a message string that 
will be presented to the user as a prompt. The second parameter is an optional 
boolean used to enable a muted input so the user's input will not be displayed 
on the screen. And the third parameter is an optional preset value that will be 
presented at the prompt for the user to accept or overwrite.

When calling the question method without a muted parameter the muted value defaults
to false and user input will be visible as they enter their answer at the prompt.
```javascript
// ask question without muted output
prompts.question("Username: ")
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

When asking a user question with a sensitive answer the muted parameter should be
set to true and the user input will not be visible as they enter their answer.
```javascript
// ask question with muted output to protect answer
prompts.question("Password: ", true)
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

And when a preset answer is provided the user's prompt will be populated with 
the preset where they can hit enter to accept or overwrite with a new answer.
```javascript
// ask question with a preset answer
prompts.question("Color: ", null, "BLUE")
  .then((answer) => {
    console.log('User answered ' + answer);
  });
```


### stateful question() example

```javascript
const MutePrompt = require('mute-prompt');
let prompts = new MutePrompt();

let username, password;

// ask for username without muting output
prompts.question("Username: ")
  .then((answer) => {
    username = answer;
    // ask for password with output muted
    return prompts.question("Password: ", true);
  })
  .then((answer) => {
    password = answer;
    console.log('Username/Password: ', username + '/' + password);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error.stack);
    process.exit(1);
  });
```


## prompt (message, [muted], [preset])

Thanks [@zypA13510](https://github.com/zypA13510) for the suggestion and input 
for stateless operation.

The prompt method is a stateless prompt and also returns a promise that
resolves with the user input. The prompt method accepts a message string that 
will be presented to the user as a prompt. The second parameter is an optional 
boolean used to enable a muted input so the user's input will not be displayed 
on the screen. And the third parameter is an optional preset value that will be 
presented at the prompt for the user to accept or overwrite.

When calling the question method without a muted parameter the muted value defaults
to false and user input will be visible as they enter their answer at the prompt.
```javascript
// ask question without muted output
prompt("Username: ")
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

When asking a user question with a sensitive answer the muted parameter should be
set to true and the user input will not be visible as they enter their answer.
```javascript
// ask question with muted output to protect answer
prompt("Password: ", true)
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

And when a preset answer is provided the user's prompt will be populated with 
the preset where they can hit enter to accept or overwrite with a new answer.
```javascript
// ask question with a preset answer
prompt("Color: ", null, "BLUE")
  .then((answer) => {
    console.log('User answered ' + answer);
  });
```


### stateless prompt() example

```javascript
const { prompt } = require('mute-prompt');

let username, password;

// ask for username without muting output
prompt("Username: ")
  .then((answer) => {
    username = answer;
    // ask for password with output muted
    return prompt("Password: ", true);
  })
  .then((answer) => {
    password = answer;
    console.log('Username/Password: ', username + '/' + password);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error.stack);
    process.exit(1);
  });
```


## pipe output

The stderr interface is used to present the prompt/question message to the user
to allow use of a command line pipe to pass your application's console.log()
output to another script or into a file.

I.E. assuming we have a script named makehash.js that uses mute-prompt to ask a
user for a password that is then hashed and saved in a file named hash.txt...

> node makehash.js > hash.txt

The makehash.js script will execute and present a message in the terminal for
the user and the resulting hash string is output with the console.log() method.
In this case only the hash string will be saved in the hash.txt file.
