import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart (context, payload) {
      return new Promise((resolve, reject) => {
        // 添加新的商品
        // let newProduct = null;
        // for (let item of state.cartList) {
        //   if(item.iid === payload.iid) {
        //     newProduct = item;
        //   }
        // }
        // 1.新添加商品与购物车内已有商品匹配
        let newProduct = context.state.cartList.find(item => item.iid === payload.iid)

        // 2.计算购物车内的各自的商品的数量
        if (newProduct) {
          context.commit(ADD_COUNTER,newProduct)
          resolve('当前的商品数量+1')
        } else {
          payload.count = 1
          context.commit(ADD_TO_CART, payload)
          resolve('添加了新的商品')
        }
      })
  }
}
