<template>
  <div class="overflow-scroll h-full bg-primary-100 border-round-2xl">
    <div class="overflow-auto">
      <div class="messages">
        <div v-for="message in messages" :key="message.id" class="message" :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="input-container flex align-items-center p-3">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="input border-round border-none h-3rem w-20rem p-2"
        placeholder="Сообщение..."
      />
      <button @click="sendMessage" class="ml-2 bg-primary h-3rem hover:bg-primary-800 border-none active:bg-primary-600">
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

.input-container {
  height: 94vh;
  width: 46dvh;
}

</style>