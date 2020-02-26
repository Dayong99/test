import Toast from './Toast'
const obj = {}

obj.install = function (Vue) {

  // document.body.appendChild(Toast.$el)
  // 1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)

  // 2.通过new的方式，根据组件构造器，创建出一个组件对象
  const newToast = new toastContrustor()

  // 3.将某一元素手动挂载到组件对象上
  newToast.$mount(document.createElement('div'))

  // 4.toast.$el对应的就是div
  document.body.appendChild(newToast.$el)
  Vue.prototype.$toast = newToast;
}
export default obj
