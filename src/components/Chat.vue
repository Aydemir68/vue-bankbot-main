<template>
  <div class="main-container flex flex-column w-screen h-full">
    <Button
      v-if="isVisible" class="scroll-btn flex align-items-center p-3 bg-gray-200 right-0 m-3 border-none active:bg-gray-300" @click="scrollToBottom">
      <i class="pi pi-chevron-down"></i>
    </Button>

    <button v-if="hasUserMessages" class="bin-button" @click="clearChat">
      <svg
          class="bin-top"
          viewBox="0 0 39 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
        <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
        <line
            x1="12"
            y1="1.5"
            x2="26.0357"
            y2="1.5"
            stroke="white"
            stroke-width="3"
        ></line>
      </svg>
      <svg
          class="bin-bottom"
          viewBox="0 0 33 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_8_19" fill="white">
          <path
              d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
          ></path>
        </mask>
        <path
            d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
            fill="white"
            mask="url(#path-1-inside-1_8_19)"
        ></path>
        <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
        <path d="M21 6V29" stroke="white" stroke-width="4"></path>
      </svg>
    </button>

    <div ref="messagesContainer" class="flex flex-column h-full overflow-y-scroll mx-1">
      <div v-if="this.messages.length === 0" class="flex h-full w-full align-items-center justify-content-center">
        <div class="bg-black-alpha-30 border-round w-full m-4 px-4 py-6">
          <p><strong>Приветствую, дорогой пользователь!</strong></p>
          <p>Это раздел, в котором вы можете получить ответы на различные вопросы по направлению финансовой грамотности. Для этого напишите ваш вопрос ниже</p>
          <img class="bot_gif_size" src="/output-onlinegiftools.gif" alt="robot" />
        </div>
      </div>
      <div v-for="message in messages" :key="message.id">
        <div class="bg-black-alpha-30 p-2 border-round-bottom text-left"
             :class="{'flex user-message my-2 max-w-18rem': message.isUser, 'flex bot-message max-w-18rem': !message.isUser,}">
          {{ message.text }}
        </div>
      </div>
      <div id="generating" v-show="this.visibleGenMessage" class="p-2">
        <img class="gif_size" src="/innoit.gif"/>
      </div>
    </div>
    <div class="flex w-full align-items-end p-2 h-5rem">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" class="input border-round border-none h-3rem w-full p-2" placeholder="Сообщение..."/>
      <button
        v-bind:disabled="this.sendButtonEnabled" @click="sendMessage"
        class="ml-2 bg-primary h-3rem hover:bg-primary-800 border-none active:bg-primary-600 outline-none">
        <i class="pi pi-send"></i>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {marked} from "marked";
import {chatExists, chatGenerate, getAnswer} from "../chat_api.js";

// Глобальная переменная для хранения сессии
const sessionStorage = {
  messages: [],
};

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
  computed: {
    hasUserMessages() {
      return this.messages.some((message) => message.isUser);
    },
  },
  methods: {
    marked,
    async sendMessage() {
      this.visibleGenMessage = true;
      if (this.newMessage.trim()) {
        // Сохраняем сообщение пользователя
        this.messages.push({
          id: this.messageId++,
          text: this.newMessage,
          isUser: true,
        });
        this.scrollToBottom();

        const userMessage = this.newMessage;
        this.newMessage = "";
        const kb_id = "201e9a1e-eb77-4923-943e-c87c9dea5033";
        const tg = window.Telegram.WebApp;
        this.scrollToBottom();

        try {
          const chat_id = await chatExists(tg.initDataUnsafe.user.id.toString(), kb_id);
          if (chat_id) {
            await chatGenerate(chat_id, userMessage);
            const answer = await getAnswer(chat_id);

            if (answer) {
              this.messages.push({
                id: this.messageId++,
                text: answer || "Ответ не найден.",
                isUser: false,
              });
            } else {
              this.messages.push({
                id: this.messageId++,
                text: "Ответ не был получен.",
                isUser: false,
              });
            }
          } else {
            this.messages.push({
              id: this.messageId++,
              text: "Не удалось найти или создать чат.",
              isUser: false,
            });
          }
        } catch (error) {
          console.error("Ошибка при обработке сообщения:", error);
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
      sessionStorage.messages = [...this.messages];
    },
    loadSession() {
      const savedMessages = sessionStorage.messages;
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
    clearChat() {
      // Очищаем массив сообщений и сбрасываем счетчик ID
      setTimeout (() => {
        this.messages = [];
        this.messageId = 0;
        sessionStorage.messages = [];
        this.scrollToBottom();
        this.visibleGenMessage = false;
      }, 1200);
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

<style scoped>

* {
  -webkit-tap-highlight-color: transparent;
}

.gif_size {
  width: 20%;
}

.bot_gif_size {
  width: 50%;
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

.bin-button {
  position: fixed; /* Фиксированное положение кнопки */
  top: 10px; /* Отступ сверху */
  right: 10px; /* Отступ справа */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.8rem;
  background-color: rgb(255, 95, 95);
  cursor: pointer;
  border: 0.2rem solid rgb(255, 201, 201);
  transition-duration: 1s;
  z-index: 1000; /* Чтобы кнопка всегда была поверх остальных элементов */
  outline: none;
}

.bin-bottom {
  width: 0.9rem;
  outline: none;
}
.bin-top {
  width: 1.1rem;
  transform-origin: right;
  transition-duration: 0.3s;
}
.bin-button:hover .bin-top {
  transform: rotate(45deg);
}
.bin-button:hover {
  background-color: rgb(246, 71, 71);
  outline: none;
}
.bin-button:active {
  transform: scale(0.9);
}


</style>
