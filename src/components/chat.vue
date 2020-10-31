<template>
  <div id="chat">
    <h1>{{chat.name}}</h1>
    <div id="messages">
      <message v-for="message in chat.messages" :key="message.timestamp" :message="message"/>
    </div>
    <input type="text" v-model="message" @keypress.enter="publish" placeholder="Nachricht">
    <button v-on:click="publish">Senden!</button>
  </div>
</template>

<script>
import Message from "@/components/message";
export default {
  name: "chat",
  components: {Message},
  props: {
    type: String,
    url: String
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {
    chat() {
      return this.$store.getters.getChannel(this.url, this.type);
    }
  },
  methods: {
    publish() {
      this.$store.commit('publish', {
        message: this.message,
        channel: this.chat.uuid,
        chat: this.type,
        group: this.url
      });
      this.message = "";
    }
  }
}
</script>

<style scoped>
#messages {
  display: flex;
  flex-direction: column;
}
</style>