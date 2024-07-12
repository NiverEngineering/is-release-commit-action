import {spawnCommand} from './spawn';

export const getLatestReleaseTag: (tagPrefix: string, fallback: string) => Promise<string> = async (tagPrefix, fallback) => {
  let latestReleaseTag;

  try {
    latestReleaseTag = (
      await spawnCommand(
        'git',
        'for-each-ref',
        '--sort=-creatordate',
        '--count',
        '1',
        '--format="%(refname:short)"',
        `refs/tags/${tagPrefix ?? '*'}`,
      )
    )?.stdout?.[0]?.replace(/["\s]/g, '');
  } catch (error) {
    console.error(error);
  }

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
    return (await spawnCommand('git', 'for-each-ref', '--points-at', 'HEAD', `refs/tags/${tagPrefix}`)).stdout.length > 0;
  } catch (error) {
    console.error(error);
    throw Error('Could not determine whether the current commit is a release commit!');
  }
};
