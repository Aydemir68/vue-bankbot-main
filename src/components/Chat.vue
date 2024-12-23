<template>
  <div class="main-container flex flex-column w-screen h-full">
    <Button v-if="isVisible" class="scroll-btn flex align-items-center p-3 bg-gray-200 right-0 m-3 border-none active:bg-gray-300" @click="scrollToBottom">
      <i class="pi pi-chevron-down"></i>
    </Button>
      <div ref="messagesContainer" class="flex flex-column h-full overflow-y-scroll mx-1">
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
      newMessage: "",
      messageId: 0, // Для уникальных идентификаторов сообщений
      isVisible: false,
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim()) {
        // Сохраняем сообщение пользователя
        this.messages.push({
          id: this.messageId++,
          text: this.newMessage,
          isUser: true,
        });

        // Сохраняем текст сообщения перед очисткой
        const userMessage = this.newMessage;
        this.newMessage = "";

        this.scrollToBottom();

        try {
          // Отправляем сообщение на сервер
          await axios.post(
              "http://127.0.0.1:8000/api/v1/chat/generation?chat_id=c1d08391-8545-4676-abe8-8a92f52ec88c&use_rag=true&extract_keywords=true&stream=true\n",
              {
                role: "user",
                content: userMessage,
                params: {
                  chat_id: "c1d08391-8545-4676-abe8-8a92f52ec88c",
                  use_rag: true,
                  extract_keywords: true,
                  stream: true,
                },
              }
          );

          // Получаем ответ
          const response = await axios.get(
              "http://127.0.0.1:8000/api/v1/chat/message/list",
              {
                params: { chat_id: "c1d08391-8545-4676-abe8-8a92f52ec88c" },
              }
          );

          // Добавляем сообщение ассистента
          const assistantMessage = response.data.find(
              (msg) => msg.role === "assistant"
          );
          this.messages.push({
            id: this.messageId++,
            text: assistantMessage?.content || "Ответ не найден.",
            isUser: false,
          });
        } catch (error) {
          console.error("Ошибка при отправке сообщения:", error);
          this.messages.push({
            id: this.messageId++,
            text: "Произошла ошибка. Попробуйте позже.",
            isUser: false,
          });
        } finally {
          this.scrollToBottom();
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    handleScroll() {
      const container = this.$refs.messagesContainer;
      if (container) {
        this.isVisible = container.scrollTop < container.scrollHeight - container.clientHeight - 100;
      }
    },
  },
  mounted() {
    const container = this.$refs.messagesContainer;
    if (container) {
      container.addEventListener('scroll', this.handleScroll);
    }
  },
  beforeDestroy() {
    const container = this.$refs.messagesContainer;
    if (container) {
      container.removeEventListener('scroll', this.handleScroll);
    }
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

.scroll-btn {
  position: fixed;
  bottom: 16rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  box-shadow: 0 1rem 2.2rem rgba(0, 0, 0, 0.2);
}
</style>