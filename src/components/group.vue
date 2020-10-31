<template>
  <div id="group">
    <h1>{{group.name}}</h1>
    <router-link :to="{ name: 'chat', params: { url: url, type: 'allgemein' }}">Allgemein</router-link>
    <router-link :to="{ name: 'chat', params: { url: url, type: 'wichtig' }}">Wichtig</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "group",
  props: {
    url: String
  },
  computed: {
    group() {
      return this.$store.getters.getGroup(this.url);
    }
  }
}
</script>

<style scoped>
#group {
  padding: 2%;
}
</style>