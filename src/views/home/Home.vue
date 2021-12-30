<template>
  <div id="home">

    <nav-bar class="home-nav"><div slot='center'>购物街</div></nav-bar>
    <div class="wrapper">
        <tab-control
              :titles="['流行', '新款', '精选']"
              @tabClick="tabClick"
              ref="tabControl1"
              class="tab-control"
              v-show="isTabFixed"></tab-control>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
        <feature-view></feature-view>
        <tab-control
              :titles="['流行', '新款', '精选']"
              @tabClick="tabClick"
              ref="tabControl2"></tab-control>
        <good-list :goods="showGoods"></good-list>
        <detail></detail>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from '../../components/content/tabControl/TabControl'
  import GoodList from '../../components/content/goods/GoodsList'
  import Detail from '../detail/Detail'
  import Scroll from 'components/common/scroll/Scroll'


  import {
    getHomeMultidata,
    getHomeGoods,
  } from 'network/home'
  import {debouce} from "@/common/utils"
  import {itemListenerMixin, backTopMixin} from '@/common/mixin'

  export default {
    name: "Home",

    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Detail,
      Scroll
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        // 可能会把isShow当成一个变量
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,

      }
    },

    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('dest');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      },

    mounted() {
      // 调用防抖debouce
      // let newrefresh = debouce(this.$refs.scroll.refresh, 50)
      // 对监听的事件进行保存
      // this.itemImgListener = () => {
      //   newRefresh()
      // }
      // 3.监听item中图片加载完成
      // this.$bus.$on("itemImageLoad", this.itemImgListener)

      // 2.获取tabControl的offsetTop
      // 所有的组件都有一个属性$el: 用于获取组件中的元素
      // this.tabOffsetTop = this.$refs.tabControl
    },

    methods: {
      /**
       * 事件监听相关的方法
       */

      // 该方法已封装到common/utils.js
      // refresh()函数的防抖
      // debounce(func, delay) {
      //   let timer = null
      //   return function (...args) {
      //     if (timer) clearTimeout(timer)
      //     timer = setTimeout(() => {
      //       func.apply(this, args)
      //     }, delay)
      //   }

      // },
      tabClick(index) {
        // console.log(index);
        switch(index) {
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
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentScroll(position) {
        // console.log(position);
        // 1.判断BackTop是否显示
        this.listenShowBackTop(position)
        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)

        this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      /**
       * 网络请求相关方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;

        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成加载了更多,需要再调用一次finishPullUp
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    position: relative;
    z-index: 10;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
