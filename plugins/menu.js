var drawers = [
  {
    action: 'home',
    title: '首页',
    path: '/',
    items: [{
      title: '统计',
      path: '/dashboard'
    }]
  },
  {
    action: 'food-variant',
    title: '文章管理',
    path: '/article',
    items: [{
      title: '文章分类',
      path: '/category'
    },
      {
        title: '标签管理',
        path: '/table'
      },
      {
        title: '评论管理',
        path: '/comments'
      },
      {
        title: '文章列表',
        path: '/article_list'
      },
      {
        title: '编辑文章',
        path: '/edit_article'
      }
    ]
  },
  {
    action: 'comment-account-outline',
    title: '人员管理',
    path: '/user',
    items: [{
      title: '权限管理',
      path: '/list'
    },
      {
        title: '角色管理',
        path: '/roleManage'
      },
      {
        title: '人员管理',
        path: '/member'
      },
      {
        title: '个人资料',
        path: '/personal_info'
      }
    ]
  },
  {
    action: 'laptop',
    title: '运维管理',
    path: '/operations',
    items: [
      {
        title: '存储管理',
        path: '/storageManage'
      },
      {
        title: '定时任务',
        path: '/task'
      }
    ]
  },
  {
    action: 'database-edit',
    title: '系统监控',
    path: '/monitor',
    items: [
      {
        title: '异常日志',
        path: '/errorlog'
      },
      {
        title: '在线用户',
        path: '/online'
      },
      {
        title: '服务监控',
        path: '/server'
      }
    ]
  },
  {
    action: 'settings',
    title: '系统管理',
    path: '/settings',
    items: [
      {
        title: '主题管理',
        path: '/theme'
      },
      {
        title: '菜单管理',
        path: '/menu'
      },
      {
        title: '邮箱管理',
        path: '/emailConfig'
      },
      {
        title: '友情链接',
        path: '/friend_link'
      },
      {
        title: '系统日志',
        path: '/SystemLog'
      }
    ]
  }
]

var themes = [{
  name: '知乎蓝',
  color: '#42A5F5',
  dark: false,
  checked: false
},
  {
    name: '依提篮',
    color: '#29B6F6',
    dark: false,
    checked: false
  },
  {
    name: '水鸭青',
    color: '#4DB6AC',
    dark: false,
    checked: false
  },
  {
    name: '重力橘',
    color: '#FFF176',
    dark: true,
    checked: false
  },
  {
    name: '少女粉',
    color: '#F06292',
    dark: false,
    checked: false
  }
]
export default {
  drawers,
  themes
}
