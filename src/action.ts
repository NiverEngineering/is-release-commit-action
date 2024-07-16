import * as core from '@actions/core';
import {getLatestReleaseTag, getNextSemanticVersion, isReleaseCommit} from './commands';
import {extractVersionPartsFrom} from './version-part-extractor';

// Main IIFE
(async () => {
  try {
    const tagPrefix = core.getInput('release-tag-prefix');
    const fallback = core.getInput('fallback-tag');

    const latestTag = await getLatestReleaseTag(tagPrefix, fallback);
    const releaseCommit = await isReleaseCommit(tagPrefix);
    const {major, minor, bugfix} = extractVersionPartsFrom(latestTag);
    const version = `${major}.${minor}.${bugfix}`;
    const nextSemanticVersion = await getNextSemanticVersion(latestTag);

    console.log('Latest Tag:', latestTag);
    console.log('Is Release Commit:', releaseCommit);
    console.log('Version from Tag:', version);
    console.log('Major Part:', major);
    console.log('Minor Part:', minor);
    console.log('Bugfix Part:', bugfix);
    console.log('Next Semantic Version', nextSemanticVersion);

    core.setOutput('latest-release-tag', latestTag);
    core.setOutput('is-release-commit', releaseCommit);
    core.setOutput('version', version);
    core.setOutput('major-version', major);
    core.setOutput('minor-version', minor);
    core.setOutput('bugfix-version', bugfix);
    core.setOutput('next-semantic-version', nextSemanticVersion);
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.error(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
})();
