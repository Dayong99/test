<template>
  <div id="category">
<!--    顶部区域-->
    <nav-bar class="top-nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
<!--    下部区域-->
    <div class="under-content">
      <!--    左边内容-->
      <!--    左边导航栏-->
      <tab-menu :categories="categories"
                @selectItem="selectItem" class="left-tab">
      </tab-menu >
      <tab-control :titles="['综合', '新品', '销量']"
                   @tabClick="tabClick"
                   class="right-tab2"
                   ref="rightTab2"
                   v-show="isTabFixed">
      </tab-control>
      <!--      右边内容-->
      <scroll id="scroll-content"
              :data="[categoryData]"
              :probe-type="3"
              @scroll="contentScroll"
              ref="scroll">
        <!--      商品分类-->
        <div>
          <tab-content-category :subcategories="showSubcategory" @swiperImageLoad="swiperImageLoad">
          </tab-content-category>
          <!--          商品分类导航-->
          <tab-control :titles="['综合', '新品', '销量']"
                       @tabClick="tabClick"
                       class="right-tab"
                       ref="rightTab">
          </tab-control>
          <!--          商品展示-->
          <tab-content-detail :category-detail="showCategoryDetail">
          </tab-content-detail>
        </div>
      </scroll>
    </div>
  </div>
</template>


<script>
  import NavBar from '../../components/common/navbar/NavBar'

  import TabMenu from './childComps/TabMenu'
  import TabControl from '../../components/content/tabControl/TabControl'
  import Scroll from '../../components/common/scroll/Scroll'
  import TabContentCategory from './childComps/TabContentCategory'
  import TabContentDetail from './childComps/TabContentDetail'

  import { getCategory, getSubcategory, getCategoryDetail } from '../../network/category'
  import { POP, SELL, NEW } from '../../components/common/const'
  import { tabControlMixin } from '../../components/common/mixin'

  export default {
    name: 'Category',
    components: {
      NavBar,
      TabMenu,
      TabControl,
      Scroll,
      TabContentCategory,
      TabContentDetail
    },
    // mixins: [tabControlMixin],
    data () {
      return {
        categories: [],
        categoryData: {},
        currentIndex: -1,
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    created () {
      // 1.请求分类数据
      this._getCategory()
    },
    computed: {
      activated () {
        this.$refs.scroll.scrollTo(0, this.saveY, 0)
        this.$refs.scroll.refresh()
      },
      deactivated () {
        // 1.保存Y值
        this.saveY = this.$refs.scroll.getScrollY()
      },
      showSubcategory () {
        if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail () {
        if (this.currentIndex === -1) return []
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    methods: {
      _getCategory () {
        getCategory().then(res => {
          // 1.获取左侧侧边栏分类数据
          this.categories = res.data.category.list
          // console.log(this.categories)
          // 2.初始化右侧部分每个分类子数据
          for (let i = 0; i < this.categories.length; i++) {
            // 右侧部分数据：右侧网格数据---subcategories，右侧导航栏数据---categoryDetail
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求左侧侧边栏第一个分类的数据
          this._getSubcategories(1)
        })
      },
      // 获取右侧网格内的数据
      _getSubcategories (index) {
        this.currentIndex = index
        const mailKey = this.categories[index].maitKey
        getSubcategory(mailKey).then(res => {
            this.categoryData[index].subcategories = res.data
            // console.log(res.data)
            this.categoryData = { ...this.categoryData }
            this._getCategoryDetail('pop')
            this._getCategoryDetail('new')
            this._getCategoryDetail('sell')
          }
        )
      },
      _getCategoryDetail (type) {
        // 1.获取右侧导航---从请求this.categories数组中提取miniWallkey，
        const miniWallkey = this.categories[this.currentIndex].miniWallkey
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // console.log(res)
          // 3.将获取的数据保存下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res
          // console.log(res)
          this.categoryData = { ...this.categoryData }
        })
      },
      /**
       * 事件响应相关的方法
       */
      selectItem (index) {
        this._getSubcategories(index)
      },
      tabClick (index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.rightTab.currentIndex = index
        this.$refs.rightTab2.currentIndex = index
        // console.log(this.currentType)
      },
      contentScroll (position) {
        // 2.决定默认隐藏的right-tab2是否显示
        this.isTabFixed = (-position.y) > this.tabOffsetTop
        // console.log(position)
      },
      swiperImageLoad () {
        this.tabOffsetTop = this.$refs.rightTab.$el.offsetTop
      },
    }
  }
</script>

<style scoped>
  #category {
    height: 100vh;
    position: relative;
  }

  .top-nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .under-content {
    position: relative;
    display: flex;
    overflow: hidden;
    height: calc(100% - 44px - 49px);
  }

  #scroll-content {
    position: absolute;
    left: 85px;
    padding-left: 24px;
    height: 100%;
  }

  .right-tab2 {
    position: relative;
    z-index: 9;
    flex: 1;
  }

</style>
