import {getLatestReleaseTag, getNextSemanticVersion, isReleaseCommit} from './commands';
import * as child_process from 'child_process';
import {ExecException} from 'child_process';

jest.mock('child_process');

describe('commands', () => {
  describe('getLatestReleaseTag', () => {
    it('should choose the correct tag if multiple tags are present', async () => {
      mockExecCallWith({
        stdout: `207ed04 (tag: v1.1.0, tag: v1.1, tag: v1, origin/main) chore: Release 1.1.0
30acf60 (tag: v1.0.2, tag: v1.0) chore: Release 1.0.2
589782a (tag: v1.0.1) chore: Release 1.0.1
1a82b89 (tag: v1.0.0) chore: Release 1.0.0`,
      });

      expect(await getLatestReleaseTag('v*', '0.0.0')).toEqual('v1.1.0');
    });

    it('should fallback to given value if no tags could have been found', async () => {
      mockExecCallWith({
        stdout: ``,
      });

      expect(await getLatestReleaseTag('v*', 'v0.0.0')).toEqual('v0.0.0');
    });

    it('should throw error for falsy fallback value', async () => {
      mockExecCallWith({
        stdout: ``,
      });

      await expect(getLatestReleaseTag('v*', '')).rejects.toThrow(
        'Could not find any matching tag and fallback is either not defined or invalid! Fallback Value: ""',
      );
    });

    it('should throw error for undefined fallback value', async () => {
      mockExecCallWith({
        stdout: ``,
      });

      await expect(getLatestReleaseTag('v*', undefined)).rejects.toThrow(
        'Could not find any matching tag and fallback is either not defined or invalid! Fallback Value: undefined',
      );
    });

    it('should throw error for invalid fallback value', async () => {
      mockExecCallWith({
        stdout: ``,
      });

      await expect(getLatestReleaseTag('v*', 'blubb')).rejects.toThrow(
        'Could not find any matching tag and fallback is either not defined or invalid! Fallback Value: "blubb"',
      );
    });

    it('should throw error if git command fails', async () => {
      mockExecCallWith({
        error: Error('Something went wrong...'),
      });

      await expect(getLatestReleaseTag('v*', 'v0.0.0')).rejects.toThrow('Could not get latest tags.');
    });
  });

  describe('isReleaseCommit', () => {
    it('return true for a tag starting with "v" and pointing at HEAD', async () => {
      mockExecCallWith({
        stdout: `a7730ce591e5494a455a5283d75eddca8dc80b98 commit refs/tags/v1.2.3`,
      });

      expect(await isReleaseCommit('v*')).toBe(true);
    });

    it('return false if no tag starting with "v" and pointing at HEAD could be found', async () => {
      mockExecCallWith({
        stdout: ``,
      });

      expect(await isReleaseCommit('v*')).toBe(false);
    });

    it('return false if no tag starting with "v" and pointing at HEAD could be found', async () => {
      mockExecCallWith({
        error: Error('Something went wrong...'),
      });

      await expect(isReleaseCommit('v*')).rejects.toThrow('Could not determine whether the current commit is a release commit!');
    });
  });

  describe('getNextSemanticVersion', () => {
    it('should leave the version unchanged if there ar no commits since the last release', async () => {
      mockExecCallWith({
        stdout: ``,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('1.2.3');
    });

    it('should calculate next bugfix version if messages do not contain any "feat" or breaking changes', async () => {
      mockExecCallWith({
        stdout: `fix: Fix a bug
      
refactor: Refactor everything

build: Update dependencies`,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('1.2.4');
    });

    it('should calculate next feature version if messages contain a "feat" commit', async () => {
      mockExecCallWith({
        stdout: `fix: Fix a bug
      
feat: Add a fancy feature`,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('1.3.0');
    });

    it('should calculate next feature version if messages contain a "feat" commit with scope', async () => {
      mockExecCallWith({
        stdout: `fix: Fix a bug
      
feat(api): Add a fancy feature`,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('1.3.0');
    });

    it('should calculate next major version if messages contain a commit with "!"', async () => {
      mockExecCallWith({
        stdout: `fix: Fix a bug
      
feat!: Add a breaking feature`,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('2.0.0');
    });

    it('should calculate next major version if messages contain a commit with "!" and scope', async () => {
      mockExecCallWith({
        stdout: `fix: Fix a bug
      
feat(api)!: Add a breaking feature`,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('2.0.0');
    });

    it('should calculate next major version if a message\'s body contains "BREAKING CHANGE:"', async () => {
      mockExecCallWith({
        stdout: `fix: Fix a bug
      
feat: Add a breaking feature.

BREAKING CHANGE: This is a breaking change`,
      });

      expect(await getNextSemanticVersion('v1.2.3')).toEqual('2.0.0');
    });

    it('should throw an error, if the git command fails', async () => {
      mockExecCallWith({error: Error('Git command failed...')});

      await expect(getNextSemanticVersion('v1.2.3')).rejects.toThrow('Could not get messages since git tag "v1.2.3".');
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});

const mockExecCallWith = ({
  error = null,
  stdout = '',
  stderr = '',
}: {
  error?: ExecException | null;
  stdout?: string;
  stderr?: string;
}) =>
  jest.spyOn(child_process, 'exec').mockImplementation((command, callback) => {
    if (typeof callback === 'function') {
      setTimeout(
        () =>
          (callback as (error: child_process.ExecException | null, stdout: string, stderr: string) => void)(
            error,
            stdout,
            stderr,
          ),
        10,
      );
    }

    return {} as child_process.ChildProcess;
  });
