# css-in-npm-test
Testing options for publishing CSS in NPM packages.

[![npm version](https://img.shields.io/npm/v/@pbagnall/css-in-npm-test.svg)](https://www.npmjs.org/package/@pbagnall/css-in-npm-test)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## installation
This has an unusual structure. The package is not intended to be used directly, instead it generates a package which can be used. This way client projects don't
have the overhead of all the devDependencies, or unnecessary SCSS code. They just get the resulting CSS code.

To download the code run depending which URL type you're using.

for SSH
: `git clone git@github.com:pbagnall/css-in-npm-test.git`

for HTTPS
: `git clone https://github.com/pbagnall/css-in-npm-test.git`

via GitHub CLI
: `gh repo clone pbagnall/css-in-npm-test`




To build and publish the package you need to do the following:

Build the package by running

`yarn build`

This builds the dist folder with it's own package.json ready to publish

Publish the dist folder by running

`yarn publish --access public dist`

