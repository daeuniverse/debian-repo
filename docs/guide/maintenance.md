# Services & certificates

## Customize a systemd service

If you want to edit the systemd service file, you can just run(for example, for `daed` service):

::: code-group

```sh [sudo]
sudo systemctl edit --full daed.service
```

```sh [root]
systemctl edit --full daed.service
```

:::

New file will be placed in `/etc/systemd/system/daed.service`, instead of in `/lib/systemd/system/daed.service`, and new file will not be overwritten when package is updated.

## How to set ACL to allow non-root user to read letsencrypt certs

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
