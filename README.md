# Pipedream Utilities

This repository contains a collection of utilities that can be used as NPM dependencies in Pipedream (or any Javascript module). This allows you to re-use code without calling another workflow or adding a step.

## Utilities

The following categories of utilities are available under /utils:

- `helpers`: Miscellaneous utilities, such as string normalization and date manipulation.
    - lastDay
    - normalizeString
    - startsWith
- `netsuite`: NetSuite REST & SuiteQL helpers, including functions to execute SuiteQL queries.
    - getRecordPath
    - queryRecord
    - queryRecords
    - request
- `sftp`: SFTP file operations, including a function to move a file by its path to a new destination on an SFTP host.
    - renameSftpFile

## Import Example

To use these utilities, install via NPM (optional for Pipedream) in your local environment:

```bash

npm install @sil-org/pipedream-utils
```

or in Pipedream just import the category/ies of functions you want.

`import { helpers, netsuite } from '@sil-org/pipedream-utils@^0.3.0'`

## Contributing

Use the recommended extensions with VSCode/VSCodium.

If using a different IDE, read the .vscode/extensions.json file and install the equivalent extensions in your environment.

Use the scripts in package.json to test, lint and format your code.

The actions will check it when you push.

The "Publish" action must be triggered manually in Github after updating the package.json version (and running `npm i` to update it in the lock file.)
