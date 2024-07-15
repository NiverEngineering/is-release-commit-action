import {extractVersionPartsFrom} from './version-part-extractor';

describe('version extractor', () => {
  describe('extractVersion', () => {
    it('should extract correct version from git tag starting with "v"', () => {
      const actual = extractVersionPartsFrom('v1.2.3');

      expect(actual.major).toEqual('1');
      expect(actual.minor).toEqual('2');
      expect(actual.bugfix).toEqual('3');
    });

    it('should extract correct version from git tag with plain version', () => {
      const actual = extractVersionPartsFrom('1.2.3');

      expect(actual.major).toEqual('1');
      expect(actual.minor).toEqual('2');
      expect(actual.bugfix).toEqual('3');
    });

    it('should extract correct version from git tag with more than one digit per part', () => {
      const actual = extractVersionPartsFrom('v17.245.338');

      expect(actual.major).toEqual('17');
      expect(actual.minor).toEqual('245');
      expect(actual.bugfix).toEqual('338');
    });

    it('should throw error for invalid tag', () => {
      expect(() => extractVersionPartsFrom('v1')).toThrow('Could not extract version parts from git tag "v1"');
      expect(() => extractVersionPartsFrom('v1.2.')).toThrow('Could not extract version parts from git tag "v1.2."');
      expect(() => extractVersionPartsFrom('blubb')).toThrow('Could not extract version parts from git tag "blubb"');
    });
  });
});
