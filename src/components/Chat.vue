<template>
    <div class="overflow-scroll h-full w-full">
      <div class="messages">
        <div v-for="message in messages" :key="message.id" class="message" :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
          {{ message.text }}
        </div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          class="input"
          placeholder="Сообщение..."
        />
        <button @click="sendMessage" class="">
          <i class="pi pi-send"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
        messageId: 0 // Для уникальных идентификаторов сообщений
      };
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim()) {
          // Сохраняем сообщение пользователя
          this.messages.push({ id: this.messageId++, text: this.newMessage, isUser: true });
          this.newMessage = '';
  
          // Отправляем ответ
          setTimeout(() => {
            this.messages.push({ id: this.messageId++, text: 'Отправлено', isUser: false });
          }, 500); // Имитация задержки перед ответом
        }
      },
    },
  };
  </script>
  
<style>
</style>