import Router from 'vue-router'
import store from '../store'
import mobile from './routes/mobile'
import common from './routes/common'

const router = new Router({
  routes: [
    ...process.env.IS_MOBILE_DEVICE ? mobile : [],
    ...common
  ]
})

store.watch(
  (state, { loggedIn }) => loggedIn,
  loggedIn => {
    if (loggedIn) {
      if (process.env.IS_MOBILE_DEVICE || store.state.loginTarget) {
        router.push(store.state.loginTarget || { name: 'apps' })
        store.commit('setLoginTarget')
      }
    } else {
      store.commit('setLoginTarget', router.currentRoute.fullPath)
      router.push({ name: process.env.IS_MOBILE_DEVICE ? 'intro' : 'apps' })
    }
  })

store.subscribe(function (mutation, state) {
  switch (mutation.type) {
    case 'toggleRemoteConnectionPrompt':
      if (!state.desktop.showRemoteConnectionPrompt) store.commit('setLoginTarget')
      break
  }
})

export default router
