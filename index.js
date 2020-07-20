const core = require('@actions/core');
const github = require('@actions/github');

function parseRepo(input) {
  const info = input.split('/');
  if (info.length !== 2) {
    throw new Error('invalid repo info');
  }
  return { owner: info[0], repo: info[1] }
}

async function run() {
  try {
    const token = core.getInput('token');
    const { owner, repo } = parseRepo(core.getInput('etl-repo'));

    console.log(`Target repo: ${owner}/${repo}`);
    const octokit = github.getOctokit(token);
    const issue = await octokit.issues.create({
      owner,
      repo,
      title: 'New migration update from: ...',
      body: 'there is a new migration update from: ... @benjamin99'
    });

    console.log('create issue: ' + issue.url + ' successfully');
    
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
  } catch (error) {
    console.log('error: ', error);
    core.setFailed(error.message);
  }
}

run();
