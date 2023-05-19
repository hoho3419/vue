<template>
  <TheHeader></TheHeader>
  <router-view v-slot="slotProps">
    <Transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </Transition>
  </router-view>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'

export default {
  components:{
    TheHeader,
  },
  computed:{
    didAutoLogout(){
      return this.$store.getters.getDidAutoLogout;
    }
  },
  watch:{
    didAutoLogout(curValue,oldValue){
      if(curValue && curValue !== oldValue){
        this.$router.replace('/coaches');
      }
    }
  },
  created(){
    this.$store.dispatch('tryLogin');
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}
.route-enter-from,
.route-leave-to{
  opacity: 0;
  transform: scale(0.8);
}
.route-enter-active{
  transition: all .3s ease-in;
}
.route-leave-active{
  transition: all .3s ease-out;
}
.route-enter-to,
.route-leave-from{
  opacity: 1;
  transform: scale(1);
}

</style>