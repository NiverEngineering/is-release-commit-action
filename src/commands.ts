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

export const getLatestReleaseTag: (
  tagPrefix: string,
  fallback?: string,
) => Promise<{
  tag: string;
  isFallback: boolean;
}> = async (tagPrefix, fallback) => {
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
    new RegExp(`tag: (?<tag>${tagPrefix ? tagPrefix : ''}[0-9]+\\.[0-9]+\\.[0-9]+)`),
  )?.groups?.['tag'];

  if (latestReleaseTag) {
    return {tag: latestReleaseTag, isFallback: false};
  } else if (fallback && fallback.match(/v?[0-9]+\.[0-9]+\.[0-9]+/)) {
    core.warning(`Could not get latest release release tag. Falling back to '${fallback}'`);
    return {tag: fallback, isFallback: true};
  } else {
    throw Error(
      `Could not find any matching tag and fallback is either not defined or invalid! Fallback Value: ${typeof fallback === 'string' ? `"${fallback}"` : fallback}`,
    );
  }
};

export const isReleaseCommit: (tagPrefix: string) => Promise<boolean> = async (tagPrefix) => {
  try {
    return (await exec(`git for-each-ref --points-at HEAD 'refs/tags/${tagPrefix ?? ''}[0-9].[0-9].[0-9]*'`)).stdout.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
    }

    throw Error('Could not determine whether the current commit is a release commit!');
  }
};

export const getNextSemanticVersion: (baseTag: {tag: string; isFallback: boolean}) => Promise<string> = async ({
  tag: baseTag,
  isFallback,
}) => {
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
  } catch (error1) {
    if (isFallback) {
      core.warning(
        `Could not get messages for fallback tag "${baseTag}". Most probably this is a new repo without any tags... Trying to read all commits.`,
      );

      try {
        outputOfGitCommand = await exec(`git --no-pager log --pretty=format:%B`);
      } catch (error2) {
        throw Error(`Could not determine next version.`, {cause: error2});
      }
    } else {
      throw Error(`Could not get messages since git tag "${baseTag}" to determine next version.`);
    }
  }

  const commitMessagesAndBody = outputOfGitCommand.stdout;
  core.startGroup(`Found the following commit messages since tag "${baseTag}"`);
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

export const getCurrentCommitSha: () => Promise<string> = async () => {
  let outputOfGitCommand;

  try {
    outputOfGitCommand = await exec(`git rev-parse --short HEAD`);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
    }

    throw Error(`Could not get current commit sha`);
  }

  return outputOfGitCommand.stdout?.trim();
};
