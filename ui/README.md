# linux-kernel-cves ui

> A vue.js UI to navigate data from linux-kernel-cves

## Setting up the vue.js ui

``` bash
# clone the linux-kernel-cves repo
git clone https://github.com/nluedtke/linux_kernel_cves.git

# Install vue
npm install -g @vue/cli

# move to ui folder, install dependencies with npm
cd ui
npm install

# serve with hot reload at localhost:8080 (may require vue-cli 3 or higher)
npm run serve

# build for production with minification
npm run build
```

## Configuration

The linux-kernel-cves ui allows some simple configuration. You can change the $apiBaseUrl in `main.js` to connect to a different data source. The ui is tightly coupled with the structure of `linux-kernel-cves` source data, so no guarantees are made when utilizing custom or otherwise modified data.
