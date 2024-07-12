import * as core from '@actions/core';
import {getLatestReleaseTag, isReleaseCommit} from './commands';
import {spawnCommand} from './spawn';

// Main IIFE
(async () => {
  try {
    (await spawnCommand('ls', '-lisa')).stdout.forEach(console.log);

    const tagPrefix = core.getInput('release-tag-prefix');
    const fallback = core.getInput('fallback-tag');

    const latestTag = await getLatestReleaseTag(tagPrefix, fallback);
    const releaseCommit = await isReleaseCommit(tagPrefix);

    console.log('Latest Tag:', latestTag);
    console.log('Is Release Commit:', releaseCommit);

    core.setOutput('latest-release-tag', latestTag);
    core.setOutput('is-release-commit', releaseCommit);
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.error(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
})();
