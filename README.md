# opensafely-vscode

NOTE: This extension is currently under development and is subject to change without warning!

This is a VSCode extension for working with the [OpenSAFELY](https://www.opensafely.org) tools.

Currently, it supports showing [ehrQL](https://docs.opensafely.org/ehrql) variables, tables and
datasets produced from ehrQL dataset definition files, using a set of dummy data tables.

Note that this extension can only be run with dummy data, as a local debugging tool.


## Features

Show ehrQL variables and datasets within a dataset definition.

Please see the [OpenSAFELY documentation](https://docs.opensafely.org/ehrql/explanation/vscode-extension/) for further information on using the extension with OpenSAFELY.


## Requirements

Requires the `opensafely` package. This can be set explicitly as an [extension setting](#extension-settings). 

```
pip install opensafely
```

## Extension Settings

This extension contributes the following settings:

* `opensafely.enable`: Enable/disable this extension.
* `opensafely.DummyTablesDir`: Set to the name of a directory in the workspace folder that
  contains dummy tables. Defaults to `dummy_tables`. See the
  [OpenSAFELY documentation](https://docs.opensafely.org/ehrql/how-to/dummy-data/#supply-your-own-dummy-tables)
  for information on how OpenSAFELY can generate dummy tables for you.
* `opensafely.opensafelyPath`: optional; path to an `opensafely` executable. If not provided,
  the extension will look for an `opensafely` installation in a virtual environment local to the
  workspace directory, and will fall back to an `opensafely` installed in an activated or
  system-wide.
* `opensafely.EHRQLImageVersion`: ehrQL docker image version; defaults to the current most recent
  production image (v1).
