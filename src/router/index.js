import Vue from 'vue'
import Router from 'vue-router'
import author from '@/components/author'
import makeFriend from '@/components/love/makeFriend'   //茅台佳缘
import msgActivity from '@/components/love/msgActivity'   //茅台佳缘
import dynamics from '@/components/love/dynamics'
import lPerCenter from '@/components/love/lPerCenter'
import lPlain from '@/components/love/lPlain'
import detailed from '@/components/love/detailed'
import detail from '@/components/love/detail'
import Linformation from '@/components/love/Linformation'
import Recommend from '@/components/love/Recommend'
import loveActivity from '@/components/love/loveActivity'
import activ from '@/components/love/activ'
import perDt from '@/components/love/perDt'
import mineFollow from '@/components/love/mineFollow'
import myFans from '@/components/love/myFans'
import messageCenter from '@/components/love/messageCenter'
import myActivity from '@/components/love/myActivity'

Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'author',
      component: author
    },
    {    //首页
      path: '/love/makeFriend',
      name: 'makeFriend',
      component: makeFriend
    },


    {    //茅台佳缘
      path: '/love/msgActivity',
      name: 'msgActivity',
      component: msgActivity
    },
    {
      path: '/love/dynamics',
      name: 'dynamics',
      component: dynamics
    },
    {
      path: '/love/lPerCenter',
      name: 'lPerCenter',
      component: lPerCenter
    },
    {
      path: '/love/lPlain',
      name: 'lPlain',
      component: lPlain
    },
    {
      path: '/love/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/love/detailed',
      name: 'detailed',
      component: detailed
    },
    {
      path: '/love/Linformation',
      name: 'Linformation',
      component: Linformation
    },
    {
      path: '/love/Recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/love/loveActivity',
      name: 'loveActivity',
      component: loveActivity
    },
    {
      path: '/love/activ',
      name: 'activ',
      component: activ
    },
    {
      path: '/love/perDt',
      name: 'perDt',
      component: perDt
    },
    {
      path: '/love/mineFollow',
      name: 'mineFollow',
      component: mineFollow
    },
    {
      path: '/love/myFans',
      name: 'myFans',
      component: myFans
    },
    {
      path: '/love/messageCenter',
      name: 'messageCenter',
      component: messageCenter
    },
    {
      path: '/love/myActivity',
      name: 'myActivity',
      component: myActivity
    }
  ]
})
