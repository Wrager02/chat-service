<template>
  <div id="group">
    <h1>{{group.name}}</h1>
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