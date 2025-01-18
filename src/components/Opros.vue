<template>
  <div class="flex flex-column h-full w-full p-2">
    <!-- Основной блок викторины -->
    <div v-if="currentQuestionIndex < questions.length" class="border-round-xl h-full w-full p-1 overflow-y-scroll">
      <div class="header w-full border-round-xl bg-black-alpha-30 p-3 text-gray-300 text-lg font-semibold text-center">
        {{ questions[currentQuestionIndex].question }}
      </div>

      <div class="mt-3">

        <div v-if="Array.isArray(questions[currentQuestionIndex].correct_answer)" class="flex flex-column gap-2">
          <div v-for="(answer, index) in questions[currentQuestionIndex].answers" :key="index"
               class="flex w-full bg-black-alpha-20 p-3 border-round gap-3">
            <input type="checkbox" :id="'answer-' + currentQuestionIndex + '-' + index"
                   :name="'question-' + currentQuestionIndex" :value="answer" v-model="this.checked"
                   class="flex"/>
            <label :for="'answer-' + currentQuestionIndex + '-' + index" class="flex text-left">{{ answer }}</label>
          </div>
        </div>

        <!-- Если вопрос не позволяет несколько правильных ответов, используем радиокнопки -->
        <div v-else-if="questions[currentQuestionIndex].answers && questions[currentQuestionIndex].answers.length > 0"
             class="flex flex-column gap-2">
          <div v-for="(answer, index) in questions[currentQuestionIndex].answers" :key="index"
               class="flex w-full bg-black-alpha-20 p-3 border-round gap-3">
            <input type="radio" :id="'answer-' + index" :name="'question-' + currentQuestionIndex" :value="answer"
                   v-model="selectedAnswers[currentQuestionIndex]" class="flex"/>
            <label :for="'answer-' + index" class="flex text-left">{{ answer }}</label>
          </div>
        </div>

        <div v-else-if="questions[currentQuestionIndex].correct_answer === 'без ответа'"></div>
        <!-- Если вариантов ответов нет, отображаем поле для ввода текста -->
        <div v-else>
          <input type="text" v-model="selectedAnswers[currentQuestionIndex]" placeholder="Введите ваш ответ"
                 class="border-round border-none p-3 w-full"/>
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
          class="flex w-8rem justify-content-center custom-button align-items-center bg-black-alpha-30 border-round
                 text-white hover:bg-primary-800"
          @click="goBack"
          :disabled="currentQuestionIndex === 0">
        Назад
      </button>

      <Button icon="pi pi-microchip-ai" severity="info" rounded class="m-1 bg-primary-400" @click="openDialog"/>
      <Dialog v-model:visible="visible" modal header="Помощь Интеллектуального Ассистента" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">{{responseMessage}}</span>
      </Dialog>

      <div v-if="currentQuestionIndex === questions.length - 1">
        <Button @click="this.visibleConfirm = true" class="flex w-8rem justify-content-center custom-button
                align-items-center bg-black-alpha-30 border-round
                text-white hover:bg-primary-800" label="Завершить"></Button>
        <Dialog v-model:visible="visibleConfirm" modal class="bg-gray-200" header="Вы действительно хотите завершить опрос?"
                :style="{ width: '25rem' }" :closable="false">
          <div class="flex justify-end gap-2">
            <Button type="button" label="Отмена" severity="secondary" @click="this.visibleConfirm = false"
                    class="border-1 border-black-alpha-50"></Button>
            <Button type="button" label="Завершить" @click="this.complete"
                    class="border-1 border-black-alpha-50"></Button>
          </div>
        </Dialog>
        <Dialog v-model:visible="visibleComplete"  header="Cпасибо за прохождение опроса!" modal class="bg-gray-200" :style="{ width: '25rem' }" :closable="false">
          <p>Ваш результат отправлен! Вы будете перенаправлены на страницу с опросами</p>
          <div>{{this.test}}</div>
        </Dialog>
      </div>
      <div v-else>
        <button class="flex w-8rem justify-content-center custom-button align-items-center bg-black-alpha-30 border-round
                 text-white hover:bg-primary-800"
                @click="goNext">
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import Button from "primevue/button";
import Toast from 'primevue/toast';
import 'vue3-toastify/dist/index.css';
import Dialog from 'primevue/dialog';
import axios from "axios";




export default {
  data() {
    return {
      id: null,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      test: null,
      visible: false,
      visibleConfirm: false,
      visibleComplete: false,
      questions: [],// Подключаем вопросы из JSON
      link: '/test',
      responseMessage: ""
    };
  },
  components: {
    Toast,
    Button,
    Dialog,
  },
  setup() {
    const checked = ref([])
    return { checked };
  },
  beforeMount() {
    this.id = this.$route.params.id; // Получаем ID из маршрута
    this.fetchQuestions(); // Загружаем вопросы через API
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await axios.get(`https://finlit-test.ru/surveys/get_by_id?survey_id=${this.id}`);
        this.questions = response.data.questions; // Сохраняем полученные вопросы
        this.loading = false; // Устанавливаем состояние загрузки в false
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      };
    }, 
    openDialog() {
      this.visible = true;
      this.sendMessage();
    },
    async complete() {
      let tg = window.Telegram.WebApp;
      this.visibleConfirm = false;
      this.visibleComplete = true;
      setTimeout(this.closeDialog, 3000);
      try {
        const response = await axios.post(`https://finlit-test.ru/surveys/save_result`, null,
            {params: {init_data: tg.initData, survey_id: this.id}}).then(res => {});
        this.loading = false; // Устанавливаем состояние загрузки в false

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      };
    },
    closeDialog() {
      this.visibleComplete = false;
      this.$router.push('/test');
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

        await axios.post(
            "http://81.94.159.227:1203/api/v1/chat/generation",
            {
              role: "user",
              content: requestMessage,
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
        );

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

        await axios.post(
            "http://81.94.159.227:1203/api/v1/chat/message/clear",null,
            {
              params: {
                chat_id: "1ca42f7e-0f47-4ffe-ae96-41988848997a",
              }
            }
        )
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
        this.responseMessage = "Произошла ошибка. Пожалуйста, попробуйте позже";
      }
    }
  }
};
</script>

<style scoped>
.custom-button {
  height: 3rem;
  outline: none;
}

input[type="checkbox"] {
  transform: scale(1.7);
  border: 0;
}

input[type='radio'] {
  transform: scale(1.7);
}

</style>
