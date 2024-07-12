import * as core from '@actions/core';
import {getLatestReleaseTag, isReleaseCommit} from './commands';

// Main IIFE
(async () => {
  try {
    const tagPrefix = core.getInput('release-tag-prefix');
    const fallback = core.getInput('fallback-tag');

    core.setOutput('latest-release-tag', await getLatestReleaseTag(tagPrefix, fallback));
    core.setOutput('is-release-commit', await isReleaseCommit(tagPrefix));
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
})();
