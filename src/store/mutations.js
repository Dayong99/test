import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // mutations的唯一目的就是修改state中的状态，其中的每个方法尽可能完成的事情尽可能简单
  [ADD_COUNTER] (state, payload) {
    payload.count++
  },
  [ADD_TO_CART] (state, payload) {
    payload.checked = false
    state.cartList.push(payload)
  }
}
