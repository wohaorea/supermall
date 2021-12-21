<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <!-- 属性: topImages  传入值: top-images -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
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

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'

  export default {
    name:"Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,

      Scroll,
      GoodsList
    },
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
        themeTopYs: [],
        currentIndex: 0
      }
    },
    created() {
      // 获取iid,保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片的轮播数据
        // 中转
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.取出评论的信息
        if (data.rate.cRate !==0) {
          this.commentInfo = data.rate.list[0]
        }
      })

      // 3. 请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    },
    // updated() {
    //   this.themeTopYs = []
    //   // 根据最新的数据,对应的DOM是已经被渲染出来
    //   // 但是图片依然是没有加载完()
    //   // offsetTop值不对的时候,都是因为图片的问题
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)


    //   console.log(this.themeTopYs)
    // },
    methods: {
      imageLoad() {
        // 解决划不动的bug，让图片加载完重新刷新一次
        this.$refs.scroll.refresh()

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)


        console.log(this.themeTopYs)
      },
      titleClick(index) {
        // console.log(index)
        // 滚动到某一个位置
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // console.log(position)
        // 1.获取y值
        const positionY = -position.y
        let length = this.themeTopYs.length
        // 2.positionY和主题中的值进行对比
        for(let i = 0; i < this.themeTopYs.length; i++) {
          // console.log(i)
          // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          //   console.log(i)
          // }

          if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i])) {
            // console.log(i)
            this.currentIndex = i;
            console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
