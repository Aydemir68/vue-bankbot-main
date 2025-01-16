<template>
  <div class="main-container flex flex-column w-screen h-full">
    <Button
      v-if="isVisible" class="scroll-btn flex align-items-center p-3 bg-gray-200 right-0 m-3 border-none active:bg-gray-300" @click="scrollToBottom">
      <i class="pi pi-chevron-down"></i>
    </Button>
    <div ref="messagesContainer" class="flex flex-column h-full overflow-y-scroll mx-1">
      <div v-for="message in messages" :key="message.id">
        <div class="bg-primary-500 p-2 border-round-lg text-left" :class="{'flex user-message my-2 max-w-18rem': message.isUser, 'flex bot-message max-w-18rem': !message.isUser,}">
          {{ marked(message.text) }}
        </div>
      </div>
      <div id="generating" v-show="this.visibleGenMessage">
        <img class="gif_size" src="../../public/innoit.gif"/>
      </div>
    </div>
    <div class="input-container flex align-items-end p-3 h-5rem">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" class="input border-round border-none h-3rem w-20rem p-2" placeholder="Сообщение..."/>
      <button
        v-bind:disabled="this.sendButtonEnabled" @click="sendMessage" class="ml-2 bg-primary h-3rem hover:bg-primary-800 border-none active:bg-primary-600">
        <i class="pi pi-send"></i>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {marked} from "marked";

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
      messageId: 0, // Для уникальных идентификаторов сообщений
      isVisible: false,
      visibleGenMessage: false,
      sendButtonEnabled: false
    };
  },
  methods: {
    marked,
    async sendMessage() {
      if (this.newMessage.trim()) {
        // Сохраняем сообщение пользователя
        this.messages.push({
          id: this.messageId++,
          text: this.newMessage,
          isUser: true,
        });

        // Сохранение сообщения перед очисткой
        const userMessage = this.newMessage;
        this.newMessage = "";

        // Сохранение сессии
        this.saveSession();

        this.scrollToBottom();

        try {
          this.visibleGenMessage = true;
          this.sendButtonEnabled = true;
          // Отправляем сообщение на сервер
          await axios.post(
            "http://81.94.159.227:1203/api/v1/chat/generation",
            {
              role: "user",
              content: userMessage,
            }, {
                params: {
                  chat_id: "1ca42f7e-0f47-4ffe-ae96-41988848997a",
                  use_rag: true,
                  extract_keywords: true,
                  stream: true,}
              }
          );

          // Получаем ответ
          const response = await axios.get(
            "http://81.94.159.227:1203/api/v1/chat/message/list",
            {
              params: { chat_id: "1ca42f7e-0f47-4ffe-ae96-41988848997a" },
            }
          ).then().finally(this.visibleGenMessage = true);
          await axios.post(
              "http://81.94.159.227:1203/api/v1/chat/message/clear",null,
              {
                params: {
                  chat_id: "1ca42f7e-0f47-4ffe-ae96-41988848997a",
                }
              }
          )


          // Добавляем сообщение ассистента
          const assistantMessage = response.data.find(
            (msg) => msg.role === "assistant"
          );
          this.messages.push({
            id: this.messageId++,
            text: assistantMessage?.content || "Ответ не найден.",
            isUser: false,
          });

          this.saveSession();
        } catch (error) {
          console.error("Ошибка при отправке сообщения:", error);
          this.messages.push({
            id: this.messageId++,
            text: "Произошла ошибка. Попробуйте позже.",
            isUser: false,
          });
          this.saveSession();
        } finally {
          this.scrollToBottom();
          this.visibleGenMessage = false;
          this.sendButtonEnabled = false;
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
        this.isVisible =
          container.scrollTop < container.scrollHeight - container.clientHeight - 100;
      }
    },
    saveSession() {
      localStorage.setItem("chatSession", JSON.stringify(this.messages));
    },
    loadSession() {
      const savedMessages = JSON.parse(localStorage.getItem("chatSession"));
      if (savedMessages && Array.isArray(savedMessages)) {
        this.messages = savedMessages;
        this.messageId = this.messages.length
          ? this.messages[this.messages.length - 1].id + 1
          : 0;
      } else {
        this.messages.push({
          id: this.messageId++,
          text: "Приветствую!  Это раздел, в котором Вы можете получить ответы на различные вопросы по направлению финансовой грамотности. Для этого напишите Ваш вопрос ниже",
          isUser: false,
        });
      }
    },
  },
  mounted() {
    this.loadSession();
    const container = this.$refs.messagesContainer;
    if (container) {
      container.addEventListener("scroll", this.handleScroll);
    }
  },
  beforeDestroy() {
    const container = this.$refs.messagesContainer;
    if (container) {
      container.removeEventListener("scroll", this.handleScroll);
    }
  },
};
</script>

<style>
.gif_size {
  width: 10%;
}

mark {
  background-color: transparent;
  color: white;
}

.main-container {
  background-color: #2a3f4f;
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
  background-color: #3a4f5f; /* Цвет для ответов бота */
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
