export type VersionParts = {
  major: string;
  minor: string;
  bugfix: string;
};

export const extractVersionPartsFrom: (gitTag: string) => VersionParts = (gitTag) => {
  const {major, minor, bugfix} = (gitTag.match(/(?<major>[0-9]+)\.(?<minor>[0-9]+)\.(?<bugfix>[0-9]+)/)?.groups ??
    {}) as VersionParts;

  if (!major || !minor || !bugfix) {
    throw Error(`Could not extract version parts from git tag "${gitTag}"`);
  }

  return {major, minor, bugfix};
};
