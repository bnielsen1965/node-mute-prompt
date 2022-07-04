
const MutePrompt = require('./index.js');
const { prompt } = require('./index.js');
const Commands = ['help', 'prompt', 'muted', 'preset', 'credentials', 'quit'];


(async () => {
  help();
  let command;
  console.log('Example prompts, enter help to display help message.');
  do {
    // stateless prompt with command completions
    let answer = await prompt('> ', { completions: Commands, completeEndings: true });
    // separate answer into command and arguments
    let args = answer.split(' ');
    command = args.shift().toLowerCase();
    switch (command) {
      case 'help':
        help();
        break;

      case 'quit':
        // return from function to quit
        return;

      case 'prompt':
        if (args[0] == 'muted') await statelessPromptMuted();
        else if (args[0] == 'preset') await statelessPromptPreset(args[1]);
        else await statelessPrompt();
        break;

      case 'credentials':
        await credentials();
        break;

      case '':
        // do nothing on an empty command
        break;

      default:
        console.log(`Unknown command ${command}. Type help for instructions.`);
    }
  } while (true);
})();


function help () {
  console.log(`
This is the help message. Enter help to show this message.

This example demonstrates the use of stateless and stateful prompt, tab 
completion, and preset answers.

Press tab to complete the input or press tab twice to see completion options.
Commands:
help - displays this help message

quit - quit the example

prompt - test a stateless prompt

prompt muted - test a muted stateless prompt

prompt preset [preset]- test a stateless prompt with a preset answer

credentials - test a stateful prompt with multiple questions
`);
}

// stateless prompt
async function statelessPrompt () {
  let answer = await prompt('Enter current time: ');
  console.log(`Current time is ${answer}.`);
}

// stateless prompt with muted input
async function statelessPromptMuted () {
  let answer = await prompt('Enter secret code: ', { muted: true });
  console.log(`Secret code is ${answer}.`);
}

// stateless prompt with a preset ansower
async function statelessPromptPreset (preset) {
  let answer = await prompt('Enter to accept preset or edit answer: ', { preset });
  console.log(`Preset answer is ${answer}.`);
}

// declare completions variable and array constants for credentials
let completions;
const Names = ['bob', 'mary', 'steve', 'jane'];
const Domains = ['anise', 'botanic', 'circus', 'diamond', 'ethereal', 'forest'];

// prompts for credentials
async function credentials () {
  // create stateful prompts with completer
  let prompts = new MutePrompt({ completer: promptsCompleter });
  // set completions array to the list of user names
  completions = Names;
  let username = await prompts.question('Enter username: ');
  // change the completions array to the list of domains
  completions = Domains;
  let domain = await prompts.question('Enter domain: ');
  // disable tab completion for password entry
  prompts.disableCompleter();
  let password = await prompts.question('Enter password: ', { muted: true });
  // always destroy stateful prompt when finished
  prompts.destroy();
  let credentials = { username, domain, password };
  console.log(`Credentials: ${JSON.stringify(credentials, null, 2)}`);
}

// completer function for credentials
function promptsCompleter (line) {
  // check for completion hits that start with current line content
  let hits = completions.filter((c) => c.startsWith(line));
  // return hits and the line
  return [hits.length ? hits : completions, line];
}