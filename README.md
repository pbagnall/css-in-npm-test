# css-in-npm-test
Testing options for publishing CSS in NPM packages.

This has an unusual structure. The package is not intended to be used directly, instead it generates a package which can be used. This way client projects don't
have the overhead of all the devDependencies, or unnecessary SCSS code. They just get the resulting CSS code.

It builds the package in the dist folder. To publish it run

`