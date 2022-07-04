# mute-prompt

A utility used to generate command line prompts with the ability to mute the 
input to protect sensitive data entry.

In some cases a user prompt at the command line should mute the output from the
keyboard to protect user input, i.e. when entering a password. This module is 
used to generate a command line prompt question that can be muted to hide user 
input.

Prompt text is presented on the stderr interface to enable piping output to
other scripts or files on the command line.


# Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [Stateful vs Stateless](#stateful-vs-stateless)
* [Methods](#methods)
  * [constructor([settings])](#constructor-settings)
    * [Constructor Settings](#constructor-settings-1)
      * [Constructor completions](#constructor-completions)
      * [Constructor completeEndings](#constructor-completeendings)
      * [Constructor completer](#constructor-completer)
    * [Example Constructor](#example-constructor)
  * [question(message, [settings])](#question-message-settings)
    * [Question Settings](#question-settings)
      * [Question muted](#question-muted)
      * [Question preset](#question-preset)
    * [Example Question](#example-question)
  * [prompt(message, [settings])](#prompt-message-settings)
    * [Prompt Settings](#prompt-settings)
      * [Prompt muted](#prompt-muted)
      * [Prompt preset](#prompt-preset)
      * [Prompt completions](#prompt-completions)
      * [Prompt completeEndings](#prompt-completeendings)
      * [Prompt completer](#prompt-completer)
    * [Example prompt](#example-prompt)
* [Piped Output](#piped-output)


# Install

> npm --save install mute-prompt


# Usage

The module is used in terminal applications and imports as a class with static
methods for stateless prompts when only a few questions will be asked or as a 
stateful class instance that can be used for a series or continous user prompts.


## Stateful vs Stateless

When a mute-prompt instance is created it will retain stateful character 
interfaces that are reused for each question. Using a stateful instance is more 
efficient when an application makes multiple repeated user queries.

The static *prompt()* method is stateless and recreates the character interfaces
for each prompt. A stateless prompt is an easier and cleaner application method
when an application only makes a handful of one time queries.


# Methods

The class includes instance methods for stateful operation and static methods 
for stateless operation.


## constructor ([settings])

The constructor is used when creating stateful prompts and accepts an optional 
settings object.


### Constructor Settings

Add optional settings to the constructor to enable additional prompt features.


#### Constructor completions

The completions setting is an array of strings to be used in tab completion. 
When the completions array is defined then the prompt will create a completer 
function for the prompt that will attempt to complete user input when they hit 
the tab key.


#### Constructor completeEndings

If the completions array is defined and the completeEndings boolean is set to 
true then the strings defined in the completions array will be applied to the 
ending word of the user input as well as the beginning word.


#### Constructor completer

A custom tab completion function can be defined with the completer setting in 
the constructor. This completer function will be used for tab completion on all 
prompts.


### Example constructor

The following example creates a stateful prompt with a list of completion 
strings.

```javascript
const MutePrompt = require('mute-prompt');

let prompts = new MutePrompt({ completions: ['Arizona', 'California', 'New Mexico', 'Texas'] });
prompts.question('Enter a southern border state: ')
.then(state => console.log(state));
```


## question (message, [settings])

The question method is used as a stateful prompt and returns a promise that
resolves with the user input. The question method accepts a message string that 
will be presented to the user as a prompt. The second parameter is an optional 
object with settings for this specific question.


### Question Settings

Question settings are optional and will be used for the specific question 
being asked.


#### Question muted

The muted setting is a boolean used to enable a muted input so the user's input 
will not be displayed on the screen.


#### Question preset

The preset setting a string value that will preset the prompt answer when the 
question is displayed. The user can press enter to accept the preset value or 
overwrite the value with a different answer.


### Example question

When calling the question method without a muted parameter the muted value 
defaults to false and user input will be visible as they enter their answer at 
the prompt.
```javascript
// ask question without muted output
prompts.question("Username: ")
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

When asking a user question with a sensitive answer the muted parameter should 
be set to true and the user input will not be visible as they enter their 
answer.
```javascript
// ask question with muted output to protect answer
prompts.question("Password: ", { muted: true })
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

And when a preset answer is provided the user's prompt will be populated with 
the preset where they can hit enter to accept or overwrite with a new answer.
```javascript
// ask question with a preset answer
prompts.question("Color: ", { preset: "BLUE" })
  .then((answer) => {
    console.log('User answered ' + answer);
  });
```

A complete example.
```javascript
const MutePrompt = require('mute-prompt');
let prompts = new MutePrompt();

let username, password;

// ask for username without muting output
prompts.question("Username: ")
  .then((answer) => {
    username = answer;
    // ask for password with output muted
    return prompts.question("Password: ", { muted: true });
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


## prompt (message, [settings])

Thanks [@zypA13510](https://github.com/zypA13510) for the suggestion and input 
for stateless operation.

The prompt method is a stateless prompt and also returns a promise that
resolves with the user input. The prompt method accepts a message string that 
will be presented to the user as a prompt. The second parameter is an optional 
object with settings that will be used in the stateful prompt.


### Prompt Settings

The prompt settings are optional and will only be used in the called prompt.


#### Prompt muted

The muted setting is a boolean used to enable a muted input so the user's input 
will not be displayed on the screen.


#### Prompt preset

The preset setting a string value that will preset the prompt answer when the 
question is displayed. The user can press enter to accept the preset value or 
overwrite the value with a different answer.


#### Prompt completions

The completions setting is an array of strings to be used in tab completion. 
When the completions array is defined then the prompt will create a completer 
function for the prompt that will attempt to complete user input when they hit 
the tab key.


#### Prompt completeEndings

If the completions array is defined and the completeEndings boolean is set to 
true then the strings defined in the completions array will be applied to the 
ending word of the user input as well as the beginning word.


#### Prompt completer

A custom tab completion function can be defined with the completer setting and 
will be used for tab completion on the prompt.


### Example Prompt

When calling the prompt method without a muted parameter the muted value 
defaults to false and user input will be visible as they enter their answer at 
the prompt.
```javascript
// ask prompt without muted output
prompt("Username: ")
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

When prompting a user where the answer is sensitive the muted parameter should 
be set to true and the user input will not be visible as they enter their 
answer.
```javascript
// prompt with muted output to protect answer
prompt("Password: ", { muted: true })
  .then((answer) => {
    console.log('User answered ' + answer);
  })
```

And when a preset answer is provided the user's prompt will be populated with 
the preset where they can hit enter to accept or overwrite with a new answer.
```javascript
// prompt with a preset answer
prompt("Color: ", { preset: "BLUE" })
  .then((answer) => {
    console.log('User answered ' + answer);
  });
```

Complete example.
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


# Piped Output

The stderr interface is used to present the prompt/question message to the user
to allow use of a command line pipe to pass your application's console.log()
output to another script or into a file.

I.E. assuming we have a script named makehash.js that uses mute-prompt to ask a
user for a password that is then hashed and saved in a file named hash.txt...

> node makehash.js > hash.txt

The makehash.js script will execute and present a message in the terminal for
the user and the resulting hash string is output with the console.log() method.
In this case only the hash string will be saved in the hash.txt file.
