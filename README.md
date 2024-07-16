# Is Release Commit Action

Checks whether the current commit is a release commit.

## Inputs

### `release-tag-prefix`

A glob prefix to filter tag names. Set to `*` if all tags shall be taken into account.  
Default: `v*`

### `fallback-tag`

The fallback if no release tag could have been found.  
Default: `0.0.0`

## Outputs

### `latest-release-tag`

The content of the latest release tag. E.g. "v1.2.3" or the value of `fallback-tag` if no tag could be found.

### `is-release-commit`

Whether the current commit is a release commit (`"true"`) or not (`"false"`)

### `version`

The actual version extracted from the git tag (`"v1.2.3"` -> `"1.2.3"`)

### `major-version`

The major part of the version extracted from the git tag (`"v1.2.3"` -> `"1"`)

### `minor-version`

The minor part of the version extracted from the git tag (`"v1.2.3"` -> `"2"`)

### `bugfix-version`

The minor part of the version extracted from the git tag (`"v1.2.3"` -> `"3"`)

### `next-semantic-version`

If `is-release-commit` is `"false"`, the next semantic version based on the commits since the last release is returned.
Otherwise, the currently built version is returned.

## Example usage

<!-- x-release-please-start-version -->

```yaml
- uses: NiverEngineering/is-release-commit-action@v1.2.0
  id: is-release-commit
```

<!-- x-release-please-end -->
