
set dotenv-load := true

_default:
    @{{ just_executable() }} --list

# Set up dev environment
devenv:
    npm install

# Build a local vscode extension package
build: devenv
    npx vsce package

# Install the locally built package
install: build
    code --install-extension opensafely-*.vsix

# Login as publisher with PAT
login:
    @echo "You will need a PAT for this, see DEVELOPERS.md"
    npx vsce login bennettoxford

# Publish package. Must have run login, and supply "major", "minor" or "patch" to bump version.
publish version: build
    npx vsce publish {{ version }}
