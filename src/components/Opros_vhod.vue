<template>
  <div class="quiz-container w-screen p-2">
    <!-- Основной блок викторины -->
    <div v-if="currentQuestionIndex < questions.length" class="question-container border-round-xl p-2 h-full w-full overflow-y-scroll">
      <div class="header w-full border-round-xl text-gray-300 text-lg font-bold text-left p-2 bg-primary-800">{{ questions[currentQuestionIndex].question }}</div>

      <div class="answers mt-3">


        <div v-if="Array.isArray(questions[currentQuestionIndex].correct_answer)">
          <div
              v-for="(answer, index) in questions[currentQuestionIndex].answers"
              :key="index"
              class="answer">
            <input
                type="checkbox"
                :id="'answer-' + currentQuestionIndex + '-' + index"
                :name="'question-' + currentQuestionIndex"
                :value="answer"
                v-model="this.checked"
                class="checkbox-input"/>
            <label :for="'answer-' + currentQuestionIndex + '-' + index">{{ answer }}</label>
          </div>
        </div>
        <!-- Если вопрос не позволяет несколько правильных ответов, используем радиокнопки -->
        <div v-else-if="questions[currentQuestionIndex].answers && questions[currentQuestionIndex].answers.length > 0">
          <div
              v-for="(answer, index) in questions[currentQuestionIndex].answers"
              :key="index"
              class="answer">
            <input
                type="radio"
                :id="'answer-' + index"
                :name="'question-' + currentQuestionIndex"
                :value="answer"
                v-model="selectedAnswers[currentQuestionIndex]"/>
            <label :for="'answer-' + index">{{ answer }}</label>
          </div>
        </div>

        <div v-else-if="questions[currentQuestionIndex].correct_answer === 'без ответа'"></div>
        <!-- Если вариантов ответов нет, отображаем поле для ввода текста -->
        <div v-else>
          <input
              type="text"
              v-model="selectedAnswers[currentQuestionIndex]"
              placeholder="Введите ваш ответ"
              class="text-input border-round border-none p-2 w-16rem"/>
        </div>
      </div>
    </div>

    <!-- Блок с результатами -->
    <div v-else class="results">
      <h2>Тест завершен!</h2>
      <p>Ваши ответы:</p>
      <ul>
        <li v-for="(answer, index) in selectedAnswers" :key="index">
          {{ questions[index].question }}: {{ Array.isArray(answer) ? answer.join(', ') : answer }}
        </li>
      </ul>
    </div>

    <!-- Кнопки управления -->
    <div class="flex w-full justify-content-between mt-3">
      <button
          class="flex w-8rem justify-content-center custom-button align-items-center bg-gray-900 border-round text-white active:bg-primary-600 hover:bg-primary-800"
          @click="goBack"
          :disabled="currentQuestionIndex === 0">
        Назад
      </button>

      <Button icon="pi pi-microchip-ai" severity="info" rounded class="m-1 bg-primary-400" @click="openDialog"/>
      <Dialog v-model:visible="visible" modal header="Помощь Интеллектуального Ассистента" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">{{responseMessage}}</span>
      </Dialog>

      <Toast />
      <div v-if="currentQuestionIndex === questions.length - 1">
        <ConfirmPopup group="headless"
                      class="lex w-20rem justify-content-center custom-button align-items-center bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800">
          <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4">
              <span>{{ message.message }}</span>
              <div class="flex items-center gap-2 mt-4">
                <Button label="Подтвердить" @click="acceptCallback" size="small"></Button>
                <Button label="Отмена" outlined @click="rejectCallback" severity="secondary" size="small" text></Button>
              </div>
            </div>
          </template>
        </ConfirmPopup>
        <Button @click="requireConfirmation($event)" class="flex w-8rem justify-content-center custom-button
        align-items-center bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800 border-none" label="Завершить"></Button>
      </div>


      <div v-else>
        <button class="flex w-8rem justify-content-center custom-button align-items-center bg-gray-900 text-white active:bg-primary-600 hover:bg-primary-800"
                @click="goNext">
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import questions from './Vhod.json';
import {ref} from "vue";
import Button from "primevue/button";
import Toast from 'primevue/toast';
import 'vue3-toastify/dist/index.css';
import Dialog from 'primevue/dialog';
import axios from "axios";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmPopup from 'primevue/confirmpopup';




export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      test: null,
      visible: false,
      questions: questions.questions, // Подключаем вопросы из JSON
      link: '/test',
      responseMessage: ""
    };
  },
  components: {
    Toast,
    Button,
    Dialog,
    ConfirmPopup
  },
  setup() {
    const checked = ref([])
    const confirm = useConfirm();
    const toast = useToast();

    const requireConfirmation = (event) => {
      confirm.require({
        target: event.currentTarget,
        group: 'headless',
        message: 'Save your current process?',
        accept: () => {
          toast.add({severity:'info', summary:'Confirmed', detail:'You have accepted', life: 3000});
        },
        reject: () => {
          toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
        }
      });
    }
    return { checked, requireConfirmation };
  },


  methods: {
    openDialog() {
      this.visible = true;
      this.sendMessage();
    },
    goNext() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        console.log("Тест завершен!");
      }
      this.responseMessage = "";
    },
    goBack() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
      this.responseMessage = "";
    },
    complete() {
      this.$router.push('/test');
    },
    async sendMessage() {
      if (this.responseMessage.trim()) {
        console.log(this.responseMessage);
        return;
      }
      const user_question = this.questions[this.currentQuestionIndex].question;
      const requestMessage = `Ты не мог бы мне разъяснить следующий вопрос: ${user_question}`; // Формируем строку с вопросом
      console.log(requestMessage);
      this.responseMessage = '';

      try {

        await axios.post("http://127.0.0.1:8000/api/v1/chat/generation?chat_id=c1d08391-8545-4676-abe8-8a92f52ec88c&use_rag=true&extract_keywords=true&stream=true", {
          role: "user",
          content: requestMessage,
          params: {
            chat_id: "c1d08391-8545-4676-abe8-8a92f52ec88c",
            use_rag: true,
            extract_keywords: true,
            stream: true,
          }
        });

        // Получаем ответ от ассистента
        const response = await axios.get("http://127.0.0.1:8000/api/v1/chat/message/list", {
          params: { chat_id: "c1d08391-8545-4676-abe8-8a92f52ec88c" },
        });

        // Ищем первое сообщение от ассистента
        if (Array.isArray(response.data) && response.data.length > 0) {
          const assistantMessage = response.data.reverse().find(msg => msg.role === "assistant");

          if (assistantMessage) {
            this.responseMessage = assistantMessage.content;
          } else {
            this.responseMessage = "Ответ от ассистента не найден.";
          }
        } else {
          this.responseMessage = "Ответ пуст или неверный.";
        }
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
        this.responseMessage = "Произошла ошибка. Пожалуйста, попробуйте позже";
      }
    }
  }
};
</script>

<style scoped>
.quiz-container {
  height: 94vh;
  background-color: #2a3f4f;
  color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Основной контейнер викторины */
.question-container {
  background-color: rgb(66, 115, 195);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.answer {
  text-align: left;
}

.custom-button {
  height: 3rem;
}

input[type="radio"] {
  margin-right: 1vh;
}

input[type="checkbox"] {
  border-radius: 0;
  background-color: transparent;
}

input[type="checkbox"] {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 0;
  border: 2px solid #fff;
  background-color: transparent;
}


</style>
