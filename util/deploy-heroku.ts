import { promisify } from 'util';
import child, { exec } from 'child_process';

import colors from 'colors';
const execute = promisify(exec);

const checkForUncommitedChanges = async () => {
  console.log(colors.bold('▶️▶️ Checking if there are uncommited changes in current working tree...'));
  await execute('git status --porcelain')
    .then((res) => {
      if (res.stdout !== '') {
        console.log(`❗️ There are uncommited changes:\n\n${colors.bold(res.stdout)}`.red);
        console.log(`❗️ Commit the changes before attempting to create submodules.`.red);
        throw 'Working tree not clean';
      }
      console.log('✔ No uncommited changes.\n'.green);
    })
    .catch((err) => {
      console.log(`❗️ Error checking for uncommited changes: ${colors.bold(err.stderr ? err.stderr : err)}`.red);
      throw err;
    });
};

const deployHeroku = async () => {
  await checkForUncommitedChanges().then(async () => {
    console.log('Attempting to deploy to Heroku, please wait...'.yellow.bold);
    // TODO: try to do this thing with events.
    // const deployHeroku = child.spawn('npm run deploy_heroku');
    // deployHeroku.stdout.setEncoding('utf-8');
    // deployHeroku.on('data', (data) => {
    //   console.log(data);
    //   data = data.toString();
    // });
    await execute(`npm run git:deploy_heroku`)
      .then((res) => {
        console.log(res.stdout);
        console.log('✔ Successfully deployed to Heroku.\n'.green);
      })
      .catch((err) => {
        console.log(
          `❗️ Error while attempting to deploy to Heroku: ${colors.bold(err.stderr ? err.stderr : err)}`.red,
        );
        throw err;
      });
  });
};

deployHeroku();
