# Pipedream Utilities

This repository contains a collection of utilities that can be used as NPM dependencies in Pipedream (or any Javascript module). This allows you to re-use code without calling another workflow or adding a step.

## Utilities

The following utilities are available under /utils:

- `helpers.js`: Miscellaneous utilities, such as string normalization and date manipulation.
    - lastDay
    - normalizeString
    - startsWith
- `netsuite.js`: NetSuite REST & SuiteQL helpers, including a function to execute a SuiteQL query.
    - getRecordPath
    - request
    - queryRecord
- `sftp.js`: SFTP file operations, including a function to move a file by its path to a new destination on an SFTP host.
    - renameSftpFile

## Import Example

To use these utilities in your Pipedream, install them via NPM:

```bash

npm install @sil-org/pipedream-utils
```

and import the function you want.

`import { startsWith, netsuiteRequest } from '@sil-org/pipedream-utils'`
