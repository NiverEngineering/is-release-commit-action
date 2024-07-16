# Changelog

## [1.2.0](https://github.com/NiverEngineering/is-release-commit-action/compare/v1.1.0...v1.2.0) (2024-07-16)


### 🚀 Features

* Add calculation for next semantic version ([805e881](https://github.com/NiverEngineering/is-release-commit-action/commit/805e8819671451bff451138d8b0868f5471aad7e))
* Sort tags by commit history instead of date the tag was created ([8977730](https://github.com/NiverEngineering/is-release-commit-action/commit/89777302940070b0b3a9e5aeac2b6de52acf7b82))
* Use GitHub logging features instead of `console` ([c0630cf](https://github.com/NiverEngineering/is-release-commit-action/commit/c0630cf6e6b2a77437a32506f4cbf9d8082a5f11))


### 🐛 Bug Fixes

* Fix typos in log messages ([d23986e](https://github.com/NiverEngineering/is-release-commit-action/commit/d23986e2717c2ce0597236a36723c97c0eea8d88))


### 🛠 Refactorings

* Use `exec` instead of `spawn` to check whether to current commit is a release ([4972c1f](https://github.com/NiverEngineering/is-release-commit-action/commit/4972c1fb71fc137b9015bab7a866f0466d6e9139))

## [1.1.0](https://github.com/NiverEngineering/is-release-commit-action/compare/v1.0.2...v1.1.0) (2024-07-15)


### 🚀 Features

* Add version parts to output ([3363c14](https://github.com/NiverEngineering/is-release-commit-action/commit/3363c14495508999c26f839bf81b4e04767b2961))


### 📦 Build System & Dependencies

* Add Jest tests and report to pipeline ([2837cd6](https://github.com/NiverEngineering/is-release-commit-action/commit/2837cd65f70f4a1f3fe81c10d5f8b59157776433))
* Set correct package name (copy/paste error) ([eaf06c8](https://github.com/NiverEngineering/is-release-commit-action/commit/eaf06c8585610a115dc0dc9747801740702b444b))

## [1.0.2](https://github.com/NiverEngineering/is-release-commit-action/compare/v1.0.1...v1.0.2) (2024-07-15)


### 📦 Build System & Dependencies

* Add missing checkout step ([72f879e](https://github.com/NiverEngineering/is-release-commit-action/commit/72f879eec97c2c0cb8a7a0e3aab1f0b0be6c0257))

## [1.0.1](https://github.com/NiverEngineering/is-release-commit-action/compare/v1.0.0...v1.0.1) (2024-07-15)


### 📦 Build System & Dependencies

* Add tags for major (e.g. `v1`) and minor (e.g. `v1.1`) versions ([2439fb7](https://github.com/NiverEngineering/is-release-commit-action/commit/2439fb790932a348bb06f196f580f7f129508642))

## 1.0.0 (2024-07-15)


### 🚀 Features

* Create initial version of `is-release-commit-action` ([5956685](https://github.com/NiverEngineering/is-release-commit-action/commit/595668561f390ab878be9503fbd41cc652f11709))
