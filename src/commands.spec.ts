import {getLatestReleaseTag, isReleaseCommit} from './commands';

// These tests are just calling the commands!! Therefore, the results may vary and they cannot run within the pipeline.
// To run the tests manually remove the 'x' in front of the first describe() statement!

xdescribe('commands', () => {
  describe('getLatestReleaseTag', () => {
    it('should get the latest release tag', async () => {
      expect(await getLatestReleaseTag('v*', '0.0.0')).toEqual('v1.1.0');
    });
  });

  describe('isReleaseCommit', () => {
    it('should check whether the latestest commit is a release commit', async () => {
      expect(await isReleaseCommit('v*')).toBe(false);
    });
  });
});
