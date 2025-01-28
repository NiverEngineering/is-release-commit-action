import * as core from '@actions/core';
import {getCurrentCommitSha, getLatestReleaseTag, getNextSemanticVersion, isReleaseCommit} from './commands';
import {extractVersionPartsFrom} from './version-part-extractor';

// Main IIFE
(async () => {
  try {
    const tagPrefix = core.getInput('release-tag-prefix');
    const fallback = core.getInput('fallback-tag');

    const latestTag = await getLatestReleaseTag(tagPrefix, fallback);
    const releaseCommit = await isReleaseCommit(tagPrefix);
    const {major, minor, bugfix} = extractVersionPartsFrom(latestTag.tag);
    const version = `${major}.${minor}.${bugfix}`;
    const nextSemanticVersion = await getNextSemanticVersion(latestTag);
    const currentCommitSha = await getCurrentCommitSha();

    core.info(`Latest Tag: ${latestTag.tag}`);
    core.info(`Is Fallback Tag: ${latestTag.isFallback}`);
    core.info(`Is Release Commit: ${releaseCommit}`);
    core.info(`Version from Tag: ${version}`);
    core.info(`Major Part: ${major}`);
    core.info(`Minor Part: ${minor}`);
    core.info(`Bugfix Part: ${bugfix}`);
    core.info(`Next Semantic Version: ${nextSemanticVersion}`);
    core.info(`Current Commit SHA: ${currentCommitSha}`);

    core.setOutput('latest-release-tag', latestTag.tag);
    core.setOutput('is-fallback-tag', latestTag.isFallback);
    core.setOutput('is-release-commit', releaseCommit);
    core.setOutput('version', version);
    core.setOutput('major-version', major);
    core.setOutput('minor-version', minor);
    core.setOutput('bugfix-version', bugfix);
    core.setOutput('next-semantic-version', nextSemanticVersion);
    core.setOutput('current-commit-sha', currentCommitSha);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error occurred');
    }
  }
})();
