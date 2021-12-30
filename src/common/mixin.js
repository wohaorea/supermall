import { debouce } from "./utils"
import BackTop from '@/components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    let newRefresh = debouce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      newRefresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    console.log("我是混入中的内容")
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      // console.log("dianji")
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
    listenShowBackTop(position) {
      // 3.是否显示回到顶部
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
