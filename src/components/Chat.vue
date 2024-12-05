<template>
  <div class="main-container flex flex-column w-full">
      <div class="flex flex-column h-full overflow-y-scroll mx-1">
          <div v-for="message in messages" :key="message.id">
            <div class="max-w-14rem bg-primary-500 p-1 border-round-lg" :class="{'flex user-message my-2': message.isUser, 'flex bot-message': !message.isUser}">
              {{ message.text }}
            </div>
          </div>
      </div>
    <div class="input-container flex align-items-end p-3 h-fit">
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

.main-container{
  height: 94vh;
  background-color: #2A3F4F;;
}

.user-message {
  background-color: #009688; /* Цвет для сообщений пользователя */
  color: white;
  margin-left: auto; /* Выравнивание вправо */
  font-size: medium;
}

.bot-message {
  background-color: #3A4F5F; /* Цвет для ответов бота */
  color: white;
  margin-right: auto; /* Выравнивание влево */
  font-size: medium;
}
</style>