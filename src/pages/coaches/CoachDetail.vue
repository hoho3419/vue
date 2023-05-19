<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header style="text-align: center;">
          <h2>관심 있으면 연락하세요~~</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge v-for="area in areas" 
        :id="area"
        :key="area"
        :title="area"
        :type="area"
        ></base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
  props: ['id'],
  data(){
    return {
      seletedCoach: null,
    }
  },
  computed:{
    // ...mapGetters(['coaches/selectedCoah']),
    fullName(){
      return this.seletedCoach.firstName + " " + this.seletedCoach.lastName;
    },
    areas(){
      return this.seletedCoach.areas;
    },
    rate(){
      return this.seletedCoach.hourlyRate;
    },
    description(){
      return this.seletedCoach.description;
    },
    contactLink(){
      // console.log(this.$route.path)
      return '/coaches' + '/' + this.id + '/contact';
    }
  },
  created(){
    this.seletedCoach = this.$store.getters['coaches/coaches'].find(el => el.id === this.id);
    // this.seletedCoach = this.coaches(this.id);
  }
}
</script>