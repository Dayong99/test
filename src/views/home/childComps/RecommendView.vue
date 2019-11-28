<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecommendView",
    props: {
      recommends: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .recommend {
    display: flex;  /*水平布局*/
    width: 100%;
    text-align: center;
    font-size: 12px;
    padding: 10px 0 20px;   /*填充样式:上填充 两边填充 下填充*/
    border-bottom: 8px solid #eee;   /*底部内边框样式：在边框底部描绘一条宽度为8px的白色（#eee）实线（solid）*/
  }

  .recommend-item {
    flex: 1;  /*均等分*/
  }

  .recommend-item img {
    width: 70px;
    height: 70px;
    margin-bottom: 10px; /*底部外边距样式*/
  }
</style>
