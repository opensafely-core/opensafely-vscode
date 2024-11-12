# ehrql-vscode

Debug and display the dataset produced from an ehrQL dataset definition.


## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

Requires opensafely:

```pip install opensafely```

## Extension Settings

This extension contributes the following settings:

* `ehrql-vscode.enable`: Enable/disable this extension.
* `ehrql-vscode.DummyTablesDir`: Set to the name of a directory in the workspace folder that
  contains dummy tables. Defaults to `dummy_tables`. If no directory is found at the dummy
  tables location, dummy data is generated from the dataset definition.
