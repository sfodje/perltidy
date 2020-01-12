# Perl::Tidy

This extension is a simple formatter for perl code using Perl::Tidy.

## Features

* Format perl code using default formatting command
* Format on save (editor.formatOnSave must be true)
* Format selected text
* Basic linting

## Changes
See [CHANGELOG.md](CHANGELOG.md)

## Requirements

This extension requires that Perl::Tidy is installed.
To install Perl::Tidy:
* cpan install Perl::Tidy
* ppm install Perl-Tidy (if using ActivePerl)
* brew install perltidy (Mac OS)
* sudo apt install perltidy -y (Ubuntu)
* sudo yum install perltidy -y (CentOS)

## Extension Settings

This extension contributes the following settings:

* `perltidy.executable`: path to perltidy executable
* `perltidy.profile`: path to .perltidyrc file.
* `perltidy.languageIdentifiers`: array of language identifiers, allows support for perl+mojolicious
* `perltidy.additionalArguments`: array listing any additional arguments to be used with the perltidy command
