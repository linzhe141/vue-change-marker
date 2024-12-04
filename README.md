# <img src="./logo.jpg" width="30" height="30" align="center" /> vue change marker

When a vue component changes, `vue change marker` can highlight the changed component

[demo using `vue change marker`](https://linzhe141.github.io/vue-change-marker/)

![vue-change-marker demo](./demo.gif)

> [!IMPORTANT]
> Only works in the dev environment

## Install

```bash
npm i vue-change-marker
```

```ts
import { VueChangeMarker } from 'vue-change-marker'
import { createApp } from 'vue'
import App from './App.vue'
// Before createApp
VueChangeMarker()

createApp(App).mount('#app')
```
