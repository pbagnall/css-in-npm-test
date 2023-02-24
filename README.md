# css-in-npm-test
Testing options for publishing CSS in NPM packages.

[![Build & Test](https://github.com/pbagnall/css-in-npm-test/actions/workflows/test.yml/badge.svg)](https://github.com/pbagnall/css-in-npm-test/actions/workflows/test.yml)
[![release-please](https://github.com/pbagnall/css-in-npm-test/actions/workflows/release-please.yml/badge.svg)](https://github.com/pbagnall/css-in-npm-test/actions/workflows/release-please.yml)

[![npm version](https://img.shields.io/npm/v/@pbagnall/css-in-npm-test.svg)](https://www.npmjs.org/package/@pbagnall/css-in-npm-test)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Overview as of 22 Feb 2023
This has an unusual structure. Normally an NPM package would be built directly
from the package folder. But in this case we don't want the source-code in the
final package, we want the CSS which is built from that source code. This also
means that there are no dependencies for the final package.

---
### Build process
Building is done by running `yarn build`.

It cleans the output, runs SASS to build the CSS, and then runs a script `script/prepare_package.mjs`. That script filters the package.json, removing any properties which aren't needed in the final NPM, namely:
  * scriptsComments,
  * scripts
  * devDependencies
  * config
It also copies the LICENCE and dist_README.md files into the dist folder (renaming dist_README.md to just README.md), ready for NPM to package up.

---
### Commitizen setup
This repo uses commitizen to collect commit messages, which are then used by release_please to create the release notes.

Commitizen has been set up so it is installed correctly just by running `yarn`. There is nothing else which needs doing for that.

To do that the package.json has pre and post install scripts. The preinstall set up git hooks to use scripts in the `scripts/githooks` folder. That contains teh `prepare-commit.msg` script, which collects the commit info.

The postinstall script ultimately runs `scripts/commitizen`, which sets up commitizen.

---
### Release-please
To actually generate the release notes (in `CHANGELOG.md`) we're using release-please. This is a bit more complex to set up, since quite a bit of the configuration has to be done in github.

Firstly there are two files here, the `release-please-config.json` and the `.release-please-manifest.json`.

The config file contains the basic config for release-please, and the manifest contains the current release number. Note that we're telling release please that the package is just '.' which means the outer package folder, not the dist folder the NPM is generated from.

In the config file there's a `bootstrap-sha` property. That should be set to the
full hash of the latest commit which Release-please should consider when looking for changes to add to the `CHANGELOG.md`. Once it's run once, then this is no longer relevant, but it should be set before the first run, to prevent Release-please assuming the first release was 0.1.0. You should also make sure that the manifest contains the correct current version, so Release-please derives the next version number correctly.

---
### Github workflows
Next there are the .github/workflow files, `release-please.yml` and `test.yml`.

#### release-please.yml
This script controls the release process. It runs whenever a branch is merged into `main`. For this repo, its required that all changed are merged via a PR, so it runs when a PR is merged into main. At that point it builds and tests* the package ready for NPM. 

It then creates or updates the release branch, in this case called `release-please--branches--main--components--css-in-npm-test`. It works out what the next version should be from the commit messages on the branch, and updates package.json appropriately. It also updates `.release-please-manifest.json.`. It then creates a PR ready to merge back into main when a release is wanted. This makes it easy to bundle a number of changes into a single release - just merge in how ever many PRs are wanted, and then when you're ready to release merge in the release PR.

When the release PR is merged in it again builds and tests* the CSS. It that fails it for any reason it aborts. It then creates a new release tag, and generates the release. Once that's complete it publishes the NPM from the dist folder, based on the edited package.json.

\*_The test doesn't currently do anything, it's just a call to true, so always passes, but it could be replaced by a test using playwright to check for visual regressions, accessibility tests, etc as needed._

---
### Github configuration
There are two areas which need configuration in github, the Branch protection rules, and secrets are variables. These can be set through the repo settings page.

#### Branch protection rules
At a minimum the following restrictions should be set on the main branch:
* Require a pull request before merging
* Require status checks to pass before merging
  * Require branches to be up to date before merging
  * Add a status check called 'build-and-test'

You might also want to not allow bypassing the above settings, since this prevents admins form making mistakes. Admin's can always temporarily switch this off if needs be.

#### Secrets and Variables
The repo needs two secrets, one to run Release-please and one to publish to NPM.

##### Release-please token
This will need to be created by an admin of the repository. They should go to their personal settings -> Developer Settings -> Personal access tokens and then "Generate new token". You **must** select a Classic token, the fine grained tokens do not work for this as yet. Given the token a meaningful name, and set an exipry. You'll then need to set the following permissions: (to be checked)
* repo
* workflow
* write:packages
Once you've created the token, copy it to the clipboard and go to the repo settings page -> Secrets and variables -> Actions. Then create a new repository secret and paste in the token. Give the token the name RELEASE_PLEASE.

##### NPM token.
This should be created on npmjs.com. It will require read and write access for the scope and package. see [Creating and viewing access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens). The token should then be copied to the clipboard (don't close the NPM page just yet). You should then go to repo settings page -> Secrets and Variables -> Actions. Then create a "New repository secret" pasting in the token from NPM. Give it the name PUBLISH_CSS.

_NOTE: When the tokens expire you'll need to create new ones at github or NPM. You can then update the repo settings tokens, with the new tokens. You don't need to delete these and recreate them._