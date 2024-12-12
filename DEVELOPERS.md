## Developing locally

The main extension code is in `src/extension.ts`. 
`package.json` contains the extension commands and configuration.

To develop locally, use the vscode debugging feaure.

Open `src/extension.ts` in the vscode editor and press F5 (or Run > Start debugging) to open a 
debugging window with the extension installed. Open a test study repo in this window to test
the extension functionality.

Note that you'll need some dummy tables at `dummy_tables` in you test study repo, and the
opensafely cli installed somewhere that the extension can find it (either globally, in a
virtual env in the study repo called `venv` or `.venv`, or specified in `.vscode/settings.json`).


## Publishing


### Setting up a user account to be able to publish

1. Sign in to https://azure.microsoft.com/en-gb/products/devops/. Do *not* use phcr account, but instead sign in with Github, and choose your datalab email.
2. Hover over your username once logged in and copy your user id
3. Ask the vscode admins (currently Simon and Becky, maybe Bennett admins in future) to:
 - add you to the `bennettoxford` Azure Devops organization
    - [https://dev.azure.com/bennettoxford/_settings/users]_
    - Add as Basic user
    - It is unclear if this is a hard requirement. It may be you need to be in
      an organization to generate a PAT. But it is what the docs say to do,
      so...
 - add you to the `bennettoxford` publisher:
    - [https://marketplace.visualstudio.com/manage/publishers/bennettoxford]
    - Add user to Publisher using  provided user id

The user should now have permissions to publish the vscode package.

### Generate a PAT

https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token

Sadly, this has an expiry, so you may need to repeat this.

### Manual Publish

1. `just login` and enter your PAT
2. create branch to capture release commit
3. `just publish $VERSION` where version is `major`, `minor` or `patch`. This
   will bump the version in package.json and add/commit/tag before then publishing
   the package.
4. create a PR to merge the changes/tags from release branch to main.
