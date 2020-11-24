import Vue from 'vue'
import {
  Upload,
  Dialog,
  Table,
  TableColumn,
  Button,
  Pagination,
  Input,
  Message,
  Link,
  Popover,
  TimeSelect,
  Image,
  Switch,
  Select,
  Option,
} from 'element-ui'
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Link)
Vue.use(Popover)
Vue.use(TimeSelect)
Vue.use(Image)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
// 在调用 Vue.use 前，给 Message 添加 install 方法
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
Vue.use(Message)
Vue.prototype.$message = Message
