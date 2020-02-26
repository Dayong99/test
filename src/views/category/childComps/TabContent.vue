<template>
</template>

<script>
  import Scroll from '../../../components/common/scroll/Scroll'
  import TabContentCategory from '../childComps/TabContentCategory'
  import TabContentDetail from '../childComps/TabContentDetail'

	export default {
		name: "TabContent",
    components: {
		  Scroll,
      TabContentCategory,
      TabContentDetail
    },
    props: {
      subcategories: {
        type: Object,
        default() {
          return {}
        }
      },
      categoryDetail: {
        type: Array,
        default() {
          return []
        }
      }
    }
	}
</script>

<style scoped>
</style>
