---
title: "External DNS"
---

<div v-pre lang="en-US">

# External DNS

> **Note**
> DNS request should be forwarded by dae for domain based traffic split. This guide will show you how to configure dae with external DNS.

If you use a external DNS like AdguardHome, you could refer to the following guide.

## External DNS on localhost

If you set up an external DNS on localhost, you may want to let the DNS queries to `dns.google` proxied. For example, if you have the following configuration in AdguardHome:

```
Listen on: the same machine with dae, port 53.

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

You should configure dae as follows:

1. Complete `wan_interface` in "global" section to proxy requests of AdguardHome.

2. Insert following rule as the first line of "routing" section to avoid loops.

   ```python
   pname(AdGuardHome) && l4proto(udp) && dport(53) -> must_direct
   ```

   And make sure domain `dns.google` will be proxied in routing rules.

3. Add upstream and request to section "dns".

   ```
   dns {
     upstream {
       adguardhome: 'udp://127.0.0.1:53'
     }
     routing {
       request {
         fallback: adguardhome
       }
     }
   }
   ```

4. When binding to WAN, do not use the local external DNS directly in `/etc/resolv.conf`. For example, use `nameserver 119.29.29.29`; dae can then intercept DNS traffic as packets leave the network interface.

   After a reboot, services such as dnsmasq may restore `/etc/resolv.conf`. If this occurs, the source recommends uninstalling those services or making the file immutable:

   ::: code-group

   ```shell [sudo]
   sudo chattr +i /etc/resolv.conf
   ```

   ```shell [root]
   chattr +i /etc/resolv.conf
   ```

   :::

5. If you bind to LAN, make sure your DHCP server will distribute dae as the DNS server (DNS request should be forwarded by dae for domain based traffic split).

6. If there is still a DNS issue and there are no warn/error logs, you have to change your listening port of external DNS (here is AdGuardHome) from 53 to non-53 port. See [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364).

7. If you use PVE, refer to [#37](https://github.com/daeuniverse/dae/discussions/37).

## External DNS on another machine in LAN

If you set up a external DNS on another machine in LAN, you may want to let the DNS queries to `dns.google` proxied. For example, if you have following configuration in `AdguardHome`:

```
Listen on: 192.168.30.3:53 (mac address: 8c:16:45:36:1c:5a)

China mainland: udp://223.5.5.5:53
Others: https://dns.google/dns-query
```

You should configure dae as follows:

1. Fill in `lan_interface` in "global" section to proxy requests of AdguardHome.

2. Insert following rule as the first line of "routing" section to avoid loops.

   ```python
   sip(192.168.30.3) && l4proto(udp) && dport(53) -> must_direct
   # Or use MAC address if in the same link:
   # mac(8c:16:45:36:1c:5a) && l4proto(udp) && dport(53) -> must_direct
   ```

   And make sure domain `dns.google` will be proxied in routing rules.

3. Add upstream and request to section "dns".

   ```
   dns {
     upstream {
       adguardhome: 'udp://192.168.30.3:53'
     }
     routing {
       request {
         fallback: adguardhome
       }
     }
   }
   ```

4. If you bind to LAN, make sure your DHCP server will distribute dae as the DNS server (DNS request should be forwarded by dae for domain based traffic split).

5. If there is still a DNS issue and there are no warn/error logs, you have to change your listening port of external DNS (here is AdGuardHome) from 53 to non-53 port. See [#31](https://github.com/daeuniverse/dae/issues/31#issuecomment-1467358364).

6. If you use PVE, refer to [#37](https://github.com/daeuniverse/dae/discussions/37).

</div>

---

Source: [dae upstream](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/configuration/external-dns.md) · [AGPL-3.0 license](/upstream/dae-LICENSE.txt).
