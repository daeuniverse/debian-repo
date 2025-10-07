#!/usr/bin/env bash

set -e

[ -d repo ] || mkdir repo
for dir in conf dists incoming pool; do
  [ -d "repo/$dir" ] || mkdir -p "repo/$dir"
done

export debian_origin="daeuniverse"
export debian_label="daeuniverse"
export debian_suite="stable"
export debian_codename="goose"
export debian_architecture="amd64 arm64 i386 all"
export debian_components="main"
export debian_description="A Debian repository for v2rayA, dae and juicity."

cat > repo/conf/distributions <<- EOL
Origin: ${debian_origin}
Label: ${debian_label}
Suite: ${debian_suite}
Codename: ${debian_codename}
Architectures: ${debian_architecture}
Components: ${debian_components}
Description: ${debian_description}
SignWith: C27FABADF6B07760
EOL

for deb_file in ./archive/*.deb; do
    reprepro -b repo includedeb ${debian_codename} "$deb_file"
done