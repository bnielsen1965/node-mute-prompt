const MutedPrompt = require('./index.js');
const { prompt } = require('./index.js');

// create stateful instance
let muteprompt = new MutedPrompt();
askQuestions(muteprompt)
  .then((answers) => {
    answers.forEach((answer, i) => {
      console.log('Answer ' + i + ': ' + answer);
    });
    // destroy stateful instance
    muteprompt.destroy();
    // stateless unmuted prompt
    return prompt("(unmuted) Stateless Question 1? ");
  })
  .then(answer => {
    console.log(`Stateless answer 1: ${answer}`);
    // stateless muted prompt
    return prompt("(unmuted) Stateless Question 2? ", true);
  })
  .then(answer => {
    console.log(`Stateless answer 2: ${answer}`);
  })
  .catch((error) => {
    console.log(error.stack);
    process.exit(1);
  });


async function askQuestions(qprompt) {
  console.log('Four questions with alternating muted prompt...');
  return [
    await qprompt.question("(unmuted) Question 1? "),
    await qprompt.question("(muted)   Question 2? ", true),
    await qprompt.question("(unmuted) Question 3? "),
    await qprompt.question("(muted)   Question 4? ", true)
  ];
}
