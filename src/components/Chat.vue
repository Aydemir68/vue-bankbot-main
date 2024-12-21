<template>
  <div class="main-container flex flex-column w-screen h-full">
      <div class="flex flex-column h-full overflow-y-scroll mx-1">
          <div v-for="message in messages" :key="message.id">
            <div class="bg-primary-500 p-2 border-round-lg" :class="{'flex user-message my-2 max-w-16rem': message.isUser, 'flex bot-message max-w-16rem ': !message.isUser}">
              {{ message.text }}
            </div>
          </div>
      </div>
    <div class="input-container flex align-items-end p-3 h-5rem">
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
  import axios from "axios";
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
        messageId: 0 // Для уникальных идентификаторов сообщений
      };
    },
    methods: {
      async sendMessage() {
        if (this.newMessage.trim()) {
          // Сохраняем сообщение пользователя в список сообщений
          this.messages.push({ id: this.messageId++, text: this.newMessage, isUser: true });

          // Сохраняем текст сообщения перед очисткой
          const userMessage = this.newMessage;
          this.newMessage = '';

          try {
            // Отправляем сообщение пользователя на сервер через POST-запрос
            await axios.post("http://127.0.0.1:8000/api/v1/chat/generation?chat_id=c1d08391-8545-4676-abe8-8a92f52ec88c&use_rag=true&extract_keywords=true&stream=true\n", {
              role: "user",
              content: userMessage,
              params: {
                chat_id: "c1d08391-8545-4676-abe8-8a92f52ec88c",
                use_rag: true,
                extract_keywords: true,
                stream: true,
              },
            });

            // Отправляем запрос на получение списка сообщений
            const response = await axios.get("http://127.0.0.1:8000/api/v1/chat/message/list", {
              params: { chat_id: "c1d08391-8545-4676-abe8-8a92f52ec88c" },
            });

            // Ищем первое сообщение от ассистента
            if (Array.isArray(response.data) && response.data.length > 0) {
              const assistantMessage = response.data.find(msg => msg.role === "assistant");

              if (assistantMessage) {
                this.messages.push({
                  id: this.messageId++,
                  text: assistantMessage.content, // Добавляем поле content из ответа
                  isUser: false,
                });
              } else {
                this.messages.push({
                  id: this.messageId++,
                  text: "Ответ от ассистента не найден.",
                  isUser: false,
                });
              }
            } else {
              this.messages.push({
                id: this.messageId++,
                text: "Ответ пуст или неверный.",
                isUser: false,
              });
            }
          } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
            this.messages.push({ id: this.messageId++, text: "Произошла ошибка. Пожалуйста, попробуйте позже", isUser: false });
          }
        }
      },
    },
  };
  </script>
  
<style>

.main-container{
  background-color: #2A3F4F;
  overflow: auto;
}

.user-message {
  background-color: #009688; /* Цвет для сообщений пользователя */ 
  color: white;
  margin-left: auto; /* Выравнивание вправо */
  font-size: medium;
  text-align: justify;
  margin-top: 0.5rem;
}

.bot-message {
  background-color: #3A4F5F; /* Цвет для ответов бота */
  color: white;
  margin-right: auto; /* Выравнивание влево */
  font-size: medium;
  text-align: justify;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>