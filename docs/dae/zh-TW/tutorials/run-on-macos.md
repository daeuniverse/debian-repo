---
title: "macOS / Lima"
---

<div v-pre lang="zh-TW">

# macOS / Lima

::: warning 歷史教學
原文中的 Debian 映像連結已回傳 HTTP 404；透過 Homebrew 安裝 socket_vmnet 的方式亦不符合目前 Lima 的 sudoers 要求。需先更新映像與網路設定，不能直接執行整套流程。請參閱 [Lima VMNet 文件](https://lima-vm.io/docs/config/network/vmnet/)。
:::
## 安裝 brew

### 適用於 x86

可參閱官方文件 <https://docs.brew.sh/Installation> 安裝 brew：

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### 適用於 ARM64

若要安裝 ARM64 架構套件，應將 homebrew 安裝在 `/opt/homebrew`：

```shell
cd /opt
sudo mkdir homebrew
sudo chown $(whoami):admin homebrew
curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
```

## Lima

### 設定

本節介紹如何使用 [lima](https://github.com/lima-vm/lima) 虛擬機器執行 dae，並代理整個 macOS 主機網路。

首先，應安裝 `lima` 與 `socket_vmnet`。

```shell
# Install lima for VM and socket_vmnet for bridge.
brew install lima socket_vmnet

# Set up the sudoers file for launching socket_vmnet from Lima
limactl sudoers >etc_sudoers.d_lima
sudo install -o root etc_sudoers.d_lima /etc/sudoers.d/lima
```

接著，設定 lima 與 dae VM 的設定。

```shell
# Configure lima networks.
socket_vmnet_bin=$(readlink -f ${HOMEBREW_PREFIX}/opt/socket_vmnet)/bin/socket_vmnet
sed -ir "s#^ *socketVMNet:.*#  socketVMNet: \"${socket_vmnet_bin}\"#" ~/.lima/_config/networks.yaml
```

```shell
# Configure dae vm.
mkdir ~/.lima/dae/
cat << 'EOF' | tee ~/.lima/dae/lima.yaml
images:
- location: "https://cloud.debian.org/images/cloud/bookworm/daily/20230416-1352/debian-12-generic-amd64-daily-20230416-1352.qcow2"
  arch: "x86_64"
  digest: "sha512:8dcb07f213bbe7436744ce310252f53eb06d8d0a85378e4bdeb297e29d7f8b8af82b038519fabca84a75f188aa4e5586d21856d1bb09ab89aca70fd39be7c06b"
- location: "https://cloud.debian.org/images/cloud/bookworm/daily/20230416-1352/debian-12-generic-arm64-daily-20230416-1352.qcow2"
  arch: "aarch64"
  digest: "sha512:88020fbde570e4bc773d6b05d810150b64fea007a2a18dfee835f1d73025bd2872300352e5cb1acb0bb4784c3c6765be1007880177f5319385d4fdf1d75e3ccf"
mounts:
networks:
- lima: bridged
  interface: "lima0"
memory: "1GB"
disk: "3GiB"
EOF
```

啟動 dae VM 並進行設定。

```shell
# Start dae VM.
limactl start dae
```

```shell
# Enter the dae VM.
limactl shell dae
```

以下命令在 dae 虛擬機內執行：

```shell
# Manually configure network.
cat << 'EOF' | sudo tee /etc/netplan/99-override.yaml
network:
    ethernets:
        eth0:
            dhcp4: true
            dhcp4-overrides:
                route-metric: 200
        lima0:
            dhcp4: true
            dhcp6: true
    version: 2
EOF

# Apply netplan.
sudo netplan apply

# Install requirements.
sudo apt-get install jq

# Install dae.
sudo bash -c "$(curl -s https://hubmirror.v2raya.org/raw/daeuniverse/dae-installer/main/installer.sh)" @ install

# Configure config.dae.
cat << 'EOF' | sudo tee /usr/local/etc/dae/config.dae
global {
  lan_interface: lima0
  wan_interface: lima0

  log_level: info
  allow_insecure: false
  auto_config_kernel_parameter: true
}

subscription {
  # Fill in your subscription links here.
}

# See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/dns.md for full examples.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    request {
      fallback: alidns
    }
    response {
      upstream(googledns) -> accept
      ip(geoip:private) && !qname(geosite:cn) -> googledns
      fallback: accept
    }
  }
}

group {
  proxy {
    #filter: name(keyword: HK, keyword: SG)
    policy: min_moving_avg
  }
}

# See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/routing.md for full examples.
routing {
  pname(NetworkManager) -> direct
  dip(224.0.0.0/3, 'ff00::/8') -> direct

  ### Write your rules below.

  dip(geoip:private) -> direct
  dip(geoip:cn) -> direct
  domain(geosite:cn) -> direct

  fallback: proxy
}
EOF
sudo chmod 0600 /usr/local/etc/dae/config.dae

# Do not forget to add your subscriptions and nodes.
sudo vim /usr/local/etc/dae/config.dae

# Enable and start dae.
sudo systemctl enable --now dae.service

# Exit dae vm.
exit
```

將 macOS 的預設路由設為 dae VM。

> **注意**
> 每次連線至網路時，可能都需要執行此命令。
>
> 若要自動執行，請參閱[自動設定路由與 DNS](#自動設定路由與-dns)。

```shell
# Get IP of dae VM.
dae_ip=$(limactl shell dae ip --json addr | limactl shell dae jq -cr '.[] | select( .ifname == "lima0" ).addr_info | .[] | select( .family == "inet" ).local')
# Set gateway of macOS host to dae VM.
sudo route delete default; sudo route add default $dae_ip
# Set DNS of macOS host to dae VM.
networksetup -setdnsservers Wi-Fi $dae_ip
```

驗證是否成功。

```shell
# Verify.
curl -v ipinfo.io
```

### 自動設定路由與 DNS

撰寫要執行的指令碼。

```shell
# The script to execute.
mkdir -p /Users/Shared/bin
cat << 'EOF' > /Users/Shared/bin/dae-network-update.sh
#!/bin/sh
set -ex
export PATH=$PATH:/opt/local/bin/:/opt/homebrew/bin/
dae_ip=$(limactl shell dae ip --json addr | limactl shell dae jq -cr '.[] | select( .ifname == "lima0" ).addr_info | .[] | select( .family == "inet" ).local')
current_gateway=$(route -n get default|grep gateway|rev|cut -d' ' -f1|rev)
networksetup -getdnsservers Wi-Fi | cut -d" " -f1 | grep -E '\.|:' && dns_override=1
[ ! -z "$dae_ip" ] && ping -c 1 -t 1 -n "$dae_ip" && dae_ready=1
[ -z "$dae_ready" ] && [ ! -z "$dns_override" ] && (networksetup -setmanual Wi-Fi 1.1.1.1 255.255.255.255 1.1.1.1; networksetup -setdhcp Wi-Fi; networksetup -setdnsservers Wi-Fi "Empty"; exit 1)
[ "$current_gateway" != "$dae_ip" ] && (sudo route delete default; sudo route add default $dae_ip)
networksetup -setdnsservers Wi-Fi $dae_ip
exit 0
EOF

# Give executable permission.
chmod +x /Users/Shared/bin/dae-network-update.sh
```

授予 route 無密碼權限。

```shell
if [ $(id -u) -eq "0" ]; then echo 'Do not use root!!'; else echo "$(whoami) ALL=(ALL) NOPASSWD: $(which route)" | sudo tee /etc/sudoers.d/"$(whoami)"-route; fi
```

撰寫 plist 服務檔案。

```shell
cat << 'EOF' > ~/Library/LaunchAgents/org.v2raya.dae.networkchanging.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"
 "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.v2raya.dae.networkchanging</string>

  <key>LowPriorityIO</key>
  <true/>

  <key>ProgramArguments</key>
  <array>
    <string>/Users/Shared/bin/dae-network-update.sh</string>
  </array>

  <key>WatchPaths</key>
  <array>
    <string>/etc/resolv.conf</string>
    <string>/Library/Preferences/SystemConfiguration/NetworkInterfaces.plist</string>
    <string>/Library/Preferences/SystemConfiguration/com.apple.airport.preferences.plist</string>
  </array>

  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
EOF
```

載入 plist 服務。

```shell
launchctl load ~/Library/LaunchAgents/org.v2raya.dae.networkchanging.plist
```

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/run-on-macos.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
