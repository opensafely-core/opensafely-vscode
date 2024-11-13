set dotenv-load := true

_default:
    @{{ just_executable() }} --list

# set up dev environment
devenv:
    npm install

# build a local vscode extension package
package-build: devenv
    npx vsce package

# install the locally built package
package-install: package-build
    code --install-extension ehrql-vscode-*.vsix

