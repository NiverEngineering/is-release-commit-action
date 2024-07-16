import {exec as _exec} from 'child_process';
import {extractVersionPartsFrom} from './version-part-extractor';
import * as core from '@actions/core';

// Added this manual implementation since the promisify version was not mockable...
const exec = async (command: string) =>
  new Promise<{stdout: string; stderr: string}>((resolve, reject) =>
    _exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve({stdout, stderr});
    }),
  );

export const getLatestReleaseTag: (tagPrefix: string, fallback?: string) => Promise<string> = async (tagPrefix, fallback) => {
  let outputOfGitCommand;

  try {
    outputOfGitCommand = await exec(
      `git tag --format='%(objectname)^{}' | git cat-file --batch-check | awk '$2=="commit" { print $1 }' | git log --stdin --author-date-order --no-walk --decorate --oneline`,
    );
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
    }
    throw Error('Could not get latest tags.');
  }

  core.startGroup('Found the following git tags');
  core.info(`${outputOfGitCommand.stdout}`);
  core.endGroup();

  const latestReleaseTag = outputOfGitCommand?.stdout?.match(
    new RegExp(`tag: (?<tag>${tagPrefix ? tagPrefix : ''}[0-9]+\.[0-9]+\.[0-9]+)`),
  )?.groups?.['tag'];

  if (latestReleaseTag) {
    return latestReleaseTag;
  } else if (fallback && fallback.match(/v?[0-9]+\.[0-9]+\.[0-9]+/)) {
    core.warning(`Could not get latest release release tag. Falling back to '${fallback}'`);
    return fallback;
  } else {
    throw Error(
      `Could not find any matching tag and fallback is either not defined or invalid! Fallback Value: ${typeof fallback === 'string' ? `"${fallback}"` : fallback}`,
    );
  }
};

export const isReleaseCommit: (tagPrefix: string) => Promise<boolean> = async (tagPrefix) => {
  try {
    return (await exec(`git for-each-ref --points-at HEAD refs/tags/${tagPrefix}`)).stdout.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
    }

    throw Error('Could not determine whether the current commit is a release commit!');
  }
};

export const getNextSemanticVersion: (baseTag: string) => Promise<string> = async (baseTag) => {
  let {major, minor, bugfix} = Object.entries(extractVersionPartsFrom(baseTag))
    .map<[string, number]>(([identifier, version]) => [identifier, Number.parseInt(version)])
    .reduce(
      (all, [identifier, version]) => ({
        ...all,
        [identifier]: version,
      }),
      {},
    ) as {major: number; minor: number; bugfix: number};

  let outputOfGitCommand;

  try {
    outputOfGitCommand = await exec(`git log ${baseTag}..HEAD --pretty=format:%B`);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
    }

    throw Error(`Could not get messages since git tag "${baseTag}".`);
  }

  const commitMessagesAndBody = outputOfGitCommand.stdout;
  core.startGroup('Found the following messages since tag "${baseTag}"');
  core.info(`${commitMessagesAndBody}`);
  core.endGroup();

  if (!commitMessagesAndBody?.trim().length) {
    // No commits since last release -> Leave the version unchanged
  } else if (commitMessagesAndBody.match(/!:|BREAKING CHANGE:/)) {
    major++;
    minor = 0;
    bugfix = 0;
  } else if (commitMessagesAndBody.match(/feat(?:\(.*\))?:/)) {
    minor++;
    bugfix = 0;
  } else {
    bugfix++;
  }

  return `${major}.${minor}.${bugfix}`;
};
