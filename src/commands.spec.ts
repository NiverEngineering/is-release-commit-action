import {getLatestReleaseTag, isReleaseCommit} from './commands';

// These tests are just calling the commands!! Therefore, the results may vary and they cannot run within the pipeline.

describe('commands', () => {
  describe('getLatestReleaseTag', () => {
    it('should get the latest release tag', async () => {
      expect(await getLatestReleaseTag('v*', '0.0.0')).toEqual('0.0.0');
    });
  });

  describe('isReleaseCommit', () => {
    it('should check whether the latestest commit is a release commit', async () => {
      expect(await isReleaseCommit('v*')).toBe(true);
    });
  });
});
