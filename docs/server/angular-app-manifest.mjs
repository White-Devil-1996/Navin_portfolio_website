
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/portfolio-website/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/portfolio-website"
  },
  {
    "renderMode": 2,
    "route": "/portfolio-website/dynamicComp"
  },
  {
    "renderMode": 2,
    "route": "/portfolio-website/login"
  },
  {
    "renderMode": 2,
    "route": "/portfolio-website/dashboard"
  },
  {
    "renderMode": 2,
    "redirectTo": "/portfolio-website",
    "route": "/portfolio-website/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8348, hash: '06c67643ee0ed522a4d7c8f023d6566bb95ee62c44d1ced70ddfd2a280f1ab54', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1024, hash: '8e6352f88b9736e4dfdfba8e1a74699b75f8b47ac12954368d1af740eab2e1c0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 294, hash: '0cc3bac80c7b990a332fbd833643e496a5d66fced6839924aaaa33e7957af7a0', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'index.html': {size: 312, hash: '9aeb8e3f58c028ff08d26737b65084aee1b07de8c2d4ea6a43e559d4dab2b868', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 14783, hash: '47444148a03f539ae2f8cfa1efc68d463bff697908a4621a376bd35b47b2a3b1', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'dynamicComp/index.html': {size: 74387, hash: 'acd9713a017815aebff6d414e89a4c3dbc1b892a59b84d53f40308bfc15db631', text: () => import('./assets-chunks/dynamicComp_index_html.mjs').then(m => m.default)},
    'styles-DG44VR7K.css': {size: 469831, hash: 'xGUhm2A/Xxg', text: () => import('./assets-chunks/styles-DG44VR7K_css.mjs').then(m => m.default)}
  },
};
