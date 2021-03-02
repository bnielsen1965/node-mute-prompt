let prompt = require('./index.js');

(async function test() {
  let answers = await askQuestions();

  answers.forEach((answer, i) => {
    console.log(`Answer ${i}: ${answer}`);
  });
})().catch((error) => {
  console.log(error.stack);
  process.exitCode = 1;
});

async function askQuestions() {
  console.log('Four questions with alternating muted prompt...');
  return [
    await prompt("(unmuted) Question 1? "),
    await prompt("(muted)   Question 2? ", true),
    await prompt("(unmuted) Question 3? "),
    await prompt("(muted)   Question 4? ", true)
  ];
}
