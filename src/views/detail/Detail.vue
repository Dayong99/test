<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from '../../components/common/scroll/Scroll'
  import GoodsList from '../../components/content/goods/GoodsList'
  import BackTop from '../../components/content/backtop/BackTop'
  // import Toast from '../../components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from '../../network/detail'
  import {debounce} from '../../components/common/utils'
  import {itemListenerMixin,backTopMixin} from '../../components/common/mixin'

  import { mapActions } from 'vuex'

  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      Scroll,
      BackTop,
      // Toast
    },
    mixins:[itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopsYs: [],
        getThemeTopY: null,
        positionY:[],
        isShowBackTop: false,
        // message: '',
        // show: false
      }
    },

    created () {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        console.log(res)

        // 1)获取数据
        const data = res.result

        // 2）获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        // 3）获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 4）创建店铺信息
        this.shop = new Shop(data.shopInfo)

        // 5)保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 6)获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 7）取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        // 8)取出推荐信息
        getRecommend().then(res => {
          this.recommends = res.data.list
        })

        // 3.给getThemeTopY赋值（对this.themeTopsYs的赋值操作进行防抖操作）
        this.getThemeTopY = debounce(() => {
          // this.themeTopsYs = []
          this.themeTopsYs.push(0)
          this.themeTopsYs.push(this.$refs.params.$el.offsetTop-44)
          this.themeTopsYs.push(this.$refs.comment.$el.offsetTop-44)
          this.themeTopsYs.push(this.$refs.recommends.$el.offsetTop-44)
          this.themeTopsYs.push(Number.MAX_VALUE);

          // console.log(this.themeTopsYs)
        },50)
      })
    },
    mounted () {

    },
    updated () {

    },
    destroyed () {
      this.$bus.$off('itemImageLoad',this.itemImageListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad () {
        this.newRefresh()
        // this.$refs.scroll.refresh()
        // this.$refs.scroll.refresh();
        //
        // this.themeTopsYs = []
        //
        // this.themeTopsYs.push(0);
        // this.themeTopsYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopsYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopsYs.push(this.$refs.recommends.$el.offsetTop);
        // this.themeTopsYs.push(Number.MAX_VALUE);

        this.getThemeTopY()
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopsYs[index], 100)
      },
      contentScroll(position) {
        // 获取Y值
        const positionY = -position.y

        // 将positionY与themeTopsYs进行对比
        let length = this.themeTopsYs.length
        for(let i = 0; i < length - 1; i++) {
          if(this.currentIndex !== i && (positionY >= this.themeTopsYs[i]) && positionY < this.themeTopsYs[i+1]) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 1.判断BackTop是否显示
        this.listenShowBackTop(position)
      },
      addToCart() {
        //1. 获取购物车信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        // 用户选择商品的唯一标识
        product.iid = this.iid

        // 2.将商品加入购物车
        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res
          //
          // setTimeout(() =>{
          //   this.show = false
          //   this.message = ''
          // }, 1000)
          // console.log(this.$toast)
          this.$toast.show('商品加入购物车+1')
        })
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res)
        // })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 1;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    background-color: #fff;
    height: calc(100% - 44px - 49px);
  }
</style>
