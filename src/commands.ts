import {exec as _exec} from 'child_process';
import {promisify} from 'util';

const exec = promisify(_exec);

export const getLatestReleaseTag: (tagPrefix: string, fallback: string) => Promise<string> = async (tagPrefix, fallback) => {
  let outputOfGitCommand;

  try {
    outputOfGitCommand = await exec(
      `git tag --format='%(objectname)^{}' | git cat-file --batch-check | awk '$2=="commit" { print $1 }' | git log --stdin --author-date-order --no-walk --decorate --oneline`,
    );
  } catch (error) {
    console.error(error);
    throw Error('Could not get latest tags.');
  }

  console.debug(`Found the following git tags:\n\n${outputOfGitCommand.stdout}`);
  const latestReleaseTag = outputOfGitCommand?.stdout?.match(/tag: (?<tag>v?[0-9]+\.[0-9]+\.[0-9]+)/)?.groups?.['tag'];

  if (latestReleaseTag) {
    return latestReleaseTag;
  } else if (fallback) {
    console.warn(`Could not get latest release release tag. Falling back to '${fallback}'`);
    return fallback;
  } else {
    throw Error('Could not find any matching tag and fallback is not defined!');
  }
};

export const isReleaseCommit: (tagPrefix: string) => Promise<boolean> = async (tagPrefix) => {
  try {
    return (await exec(`git for-each-ref --points-at HEAD refs/tags/${tagPrefix}`)).stdout.length > 0;
  } catch (error) {
    console.error(error);
    throw Error('Could not determine whether the current commit is a release commit!');
  }
};
