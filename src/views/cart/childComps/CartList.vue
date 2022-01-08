<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <!-- 组件用v-for最好要绑定key -->
      <!-- Key可以标识组件的唯一性,为了更好地区别各个组件 key的作用主要是为了高效的更新虚拟DOM保持数据的唯一,不绑定会导致所有列表DOM重新渲染 -->
      <cart-list-item v-for="(item, index) in list"
                      :key="index"
                      :item-info="item"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

  import { mapGetters } from 'vuex'

  export default {
    name:"CartList",
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters({
        list: 'cartList'
      })
    },
    activated() {
      // console.log("-----");
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 93px;
  }

  .content {
    height: 100%;
    overflow: hidden;
  }

</style>
