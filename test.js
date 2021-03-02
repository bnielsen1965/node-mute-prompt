let MutedPrompt = require('./index.js');

askQuestions(new MutedPrompt())
  .then((answers) => {
    answers.forEach((answer, i) => {
      console.log('Answer ' + i + ': ' + answer);
    });
  })
  .catch((error) => {
    console.log(error.stack);
    process.exitCode = 1;
  });

async function askQuestions(prompt) {
  console.log('Four questions with alternating muted prompt...');
  let returnValue = [
    await prompt.question("(unmuted) Question 1? "),
    await prompt.question("(muted)   Question 2? ", true),
    await prompt.question("(unmuted) Question 3? "),
    await prompt.question("(muted)   Question 4? ", true)
  ];
  prompt.close();
  return returnValue;
}
