<template>
  <div id="chat">
    <h1>{{chat.name}}</h1>
  </div>
</template>

<script>
export default {
  name: "chat",
  props: {
    type: String,
    url: String
  },
  computed: {
    chat() {
      return this.$store.getters.getChannel(this.url, this.type);
    }
  }
}
</script>

<style scoped>

</style>