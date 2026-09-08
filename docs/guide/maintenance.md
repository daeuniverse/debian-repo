# Services & certificates

## Customize a systemd service

To edit a systemd service file, run the following command. The example edits the `daed` service:

::: code-group

```sh [sudo]
sudo systemctl edit --full daed.service
```

```sh [root]
systemctl edit --full daed.service
```

:::

The new file is placed in `/etc/systemd/system/daed.service` rather than `/lib/systemd/system/daed.service`, and it is not overwritten when the package is updated.

## Let a non-root user read Let's Encrypt certificates

We use the `nobody` user to run the v2ray, xray, juicity and juicity-rs services, and the `nobody` user does not have permission to read the certs in `/etc/letsencrypt/live`, so you need to set ACL to allow non-root user to read letsencrypt certs.

### Install `acl` package (use Debian/Ubuntu as an example)

::: code-group

```sh [sudo]
sudo apt install acl
```

```sh [root]
apt install acl
```

:::

### Set ACL to allow user `nobody` to read letsencrypt certs

::: code-group

```sh [sudo]
sudo setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}
sudo setfacl -m u:nobody:rX /etc/letsencrypt
```

```sh [root]
setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}
setfacl -m u:nobody:rX /etc/letsencrypt
```

:::

### Set hook to certbot to automatically set ACL when certs are renewed

::: code-group

```sh [sudo]
sudo certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```

```sh [root]
certbot renew --deploy-hook "setfacl -R -m u:nobody:rX /etc/letsencrypt/{live,archive}"
```

:::
