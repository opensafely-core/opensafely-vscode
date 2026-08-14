## Developing locally

The main extension code is in `src/extension.ts`. 
`package.json` contains the extension commands and configuration.

### Set up local dev enironment
```
just install
```

### Using the debugger

To develop locally, use the vscode debugging feaure.

Open `src/extension.ts` in the vscode editor and press F5 (or Run > Start debugging) to open a 
debugging window with the extension installed. Open a test study repo in this window to test
the extension functionality.

Note that you'll need some dummy tables at `dummy_tables` in you test study repo, and the
opensafely cli installed somewhere that the extension can find it (either globally, in a
virtual env in the study repo called `venv` or `.venv`, or specified in `.vscode/settings.json`).


## Publishing

### Setting up a user account to be able to publish

1. Ask the Azure DevOps Organisation Admins (currently Becky, maybe Bennett admins in future) to [add you to the `bennettoxford` organisation](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/add-organization-users), with admin permissions on the project. 

   - https://dev.azure.com/bennettoxford/_settings/users
   - Click "Add users":
      - Enter the new user's email address* in the user field
      - Select Access Level - Basic
      - Add to projects - select "OpenSAFELY vscode extension"
      - Add to AzureDevOps Groups - select "ProjectAdministrator"
      - Check the "Send email invites" box

   * Note: Preferably use your datalab email address. You _can_ use your Oxford email address for this, to avoid having yet another Microsoft account, however, you'll need to be added to the organistation with the prhcxxxx@ox.ac.uk email that you use to log in, not your human-readable alias.

1. From the email invitation, click on the link to the organisation, and login (ensure you're using the account that matches the email address the invitation was sent to). Once you're logged in, find your user ID:
   - Go to https://marketplace.visualstudio.com
   - hover over your user name; this will allow you to copy your user ID.

   Note that you need to do this from the VS Marketplace, and **NOT** from the Azure DevOps organisation page.

1. Ask an Organisation Admin to add you to the bennettoxford publisher - this can **only** be done by user ID:
    - https://marketplace.visualstudio.com/manage/publishers/bennettoxford
    - Add user to Publisher using provided user id

You should now have permission to publish the vscode package.

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
