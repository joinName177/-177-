/**
 * 动态配置路由
 */
import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/components/HomePage')

const Login = () => import('@/components/Login')
const NotFound = () => import('@/components/NotFound')

//基础组件
const Layout = () => import('@/components/element-demo-basic/Layout')
const LayoutContainer = () => import('@/components/element-demo-basic/LayoutContainer')
const Button = () => import('@/components/element-demo-basic/Button')
const Icon = () => import('@/components/element-demo-basic/Icon')
const Link = () => import('@/components/element-demo-basic/Link')
//Form
const Cascader = () => import('@/components/element-demo-form/Cascader')
const Checkbox = () => import('@/components/element-demo-form/Checkbox')
const ColorPicker = () => import('@/components/element-demo-form/ColorPicker')
const DatePicker = () => import('@/components/element-demo-form/DatePicker')
const DateTimePicker = () => import('@/components/element-demo-form/DateTimePicker')
const FormTable = () => import('@/components/element-demo-form/FormTable')
const Input = () => import('@/components/element-demo-form/Input')
const InputNumber = () => import('@/components/element-demo-form/InputNumber')
const Radio = () => import('@/components/element-demo-form/Radio')
const Rate = () => import('@/components/element-demo-form/Rate')
const Select = () => import('@/components/element-demo-form/Select')
const Slider = () => import('@/components/element-demo-form/Slider')
const Switch = () => import('@/components/element-demo-form/Switch')
const TimePicker = () => import('@/components/element-demo-form/TimePicker')
const Transfer = () => import('@/components/element-demo-form/Transfer')
const Upload = () => import('@/components/element-demo-form/Upload')
//Data
const Table = () => import('@/components/element-demo-data/Table')
//Notice
const Alert = () => import('@/components/element-demo-Notice/Alert')
//Navigation
const NavMenu = () => import('@/components/element-demo-navigation/NavMenu')
//Other
const Carousel = () => import('@/components/element-demo-other/Carousel')

//父子传值
const TransferHome = () => import('@/components/myChild/vue-transfer-data/transferHome')

const MainPage = ()=>import('@/components/mainPage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: MainPage
     },
    {
      path: '/',
      component: Home,
      name: 'Basic',
      icon: 'el-icon-s-home',
      leaf: false,//只有一个节点
      children: [
        {
          path: '/element-demo-basic/Layout',
          component: Layout,
          name: 'Layout',
          icon: ''
        },
        {
          path: '/element-demo-basic/LayoutContainer',
          component: LayoutContainer,
          name: 'LayoutContainer',
          icon: ''
        },
        {
          path: '/element-demo-basic/Button',
          component: Button,
          name: 'Button',
          icon: ''
        },
        {
          path: '/element-demo-basic/Icon',
          component: Icon,
          name: 'Icon',
          icon: ''
        },
        {
          path: '/element-demo-basic/Link',
          component: Link,
          name: 'Link',
          icon: ''
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Form',
      icon: 'el-icon-s-flag',
      leaf: false,
      children: [
        {
          path: '/element-demo-form/Cascader',
          component: Cascader,
          name: 'Cascader',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Checkbox',
          component: Checkbox,
          name: 'Checkbox',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/ColorPicker',
          component: ColorPicker,
          name: 'ColorPicker',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/DatePicker',
          component: DatePicker,
          name: 'DatePicker',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/DateTimePicker',
          component: DateTimePicker,
          name: 'DateTimePicker',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/FormTable',
          component: FormTable,
          name: 'FormTable',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Input',
          component: Input,
          name: 'Input',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/InputNumber',
          component: InputNumber,
          name: 'InputNumber',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Radio',
          component: Radio,
          name: 'Radio',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Rate',
          component: Rate,
          name: 'Rate',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Select',
          component: Select,
          name: 'Select',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Slider',
          component: Slider,
          name: 'Slider',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Switch',
          component: Switch,
          name: 'Switch',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/TimePicker',
          component: TimePicker,
          name: 'TimePicker',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Transfer',
          component: Transfer,
          name: 'Transfer',
          icon: 'el-icon-star-on'
        },
        {
          path: '/element-demo-form/Upload',
          component: Upload,
          name: 'Upload',
          icon: 'el-icon-star-on'
        },
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Data',
      icon: 'el-icon-s-platform',
      leaf: false,//只有一个节点
      children: [
        {
          path: '/element-demo-data/Table',
          component: Table,
          name: 'Table',
          icon: 'el-icon-s-help'
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Notice',
      icon: 'el-icon-s-comment',
      leaf: false,//只有一个节点
      children: [
        {
          path: '/element-demo-Notice/Alert',
          component: Alert,
          name: 'Alert',
          icon: 'el-icon-upload'
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Navigation',
      icon: 'el-icon-s-data',
      leaf: false,//只有一个节点
      children: [
        {
          path: '/element-demo-navigation/NavMenu',
          component: NavMenu,
          name: 'NavMenu',
          icon: 'el-icon-s-cooperation'
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Other',
      icon: 'el-icon-s-unfold',
      leaf: false,//只有一个节点
      children: [
        {
          path: '/element-demo-other/Carousel',
          component: Carousel,
          name: 'Carousel',
          icon: 'el-icon-s-order'
        }
      ]
    },
    {
      path: '/login',
      icon: 'el-icon-s-custom',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    },
    {
      path: '/404',
      hidden: true,
      name: '',
      component: NotFound
    },
    {
      path:'/TransferHome',
      name:'VUE传值',
      component: TransferHome,
    }
  ]
})
