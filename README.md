# A Debian APT repo

This repo contains dae, v2rayA, v2ray, xray and juicity programs.

## Usage

### Add the repository

#### For APT version lower than 3.0

Add the repository to your sources list:

```sh
cat <<- EOL | sudo tee /etc/apt/sources.list.d/daeuniverse.list
deb [signed-by=/usr/share/keyrings/daeuniverse-archive-goose.gpg] https://daeuniverse.pages.dev goose honk 
EOL
```
#### For APT version 3.0 or higher

Add the repository to your sources list:

```sh
cat <<- EOL | sudo tee /etc/apt/sources.list.d/daeuniverse.sources
Types: deb
URIs: https://daeuniverse.pages.dev
Suites: goose
Components: honk
Architectures: amd64 arm64 i386 riscv64
Signed-By: /usr/share/keyrings/daeuniverse-archive-goose.gpg
EOL
```

### Import the GPG key

```sh
curl -fsSL https://daeuniverse.pages.dev/public-key.asc | sudo gpg --dearmor -o /usr/share/keyrings/daeuniverse-archive-goose.gpg
```

### Install packages

Update the package list:

```sh
sudo apt update
```
Install the desired package, for example, v2rayA:

```sh
sudo apt install v2raya
```