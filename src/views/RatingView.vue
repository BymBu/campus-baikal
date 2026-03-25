<template>
  <div class="rating-page">
    <h1 class="rating-title">Рейтинг</h1>
    
    <!-- Топ-5 занятий -->
    <div class="rating-card">
      <h3 class="card-title">Топ-5 занятий</h3>
      <div v-if="topLessons.length === 0" class="empty-data">
        Нет данных
      </div>
      <div v-for="item in topLessons" :key="item.discipline" class="rating-item">
        <strong>{{ item.discipline }}</strong> - средняя оценка: <span class="rating-value">{{ item.avg }}</span>
      </div>
    </div>
    
    <!-- Топ-5 преподавателей -->
    <div class="rating-card">
      <h3 class="card-title">Топ-5 преподавателей</h3>
      <div v-if="topTeachers.length === 0" class="empty-data">
        Нет данных
      </div>
      <div v-for="item in topTeachers" :key="item.teacher" class="rating-item">
        <strong>{{ item.teacher }}</strong> - средняя оценка: <span class="rating-value">{{ item.avg }}</span>
      </div>
    </div>
    
    <!-- График -->
    <div class="rating-card">
      <h3 class="card-title">График оценок по дням</h3>
      <div v-if="chartData.length === 0" class="empty-data">
        Нет данных для графика
      </div>
      <canvas ref="chartCanvas" class="chart-canvas" :class="{ 'hidden': chartData.length === 0 }"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { api } from '@/api/api';

const allMarks = ref([]);
const allSchedule = ref([]);
const topLessons = ref([]);
const topTeachers = ref([]);
const chartData = ref([]);
const chartCanvas = ref(null);

onMounted(async () => {
  try {
    const marksRes = await api.getAllMarks();
    const scheduleRes = await api.getAllSchedule();
    
    allMarks.value = marksRes.data || [];
    allSchedule.value = scheduleRes.data || [];
    
    console.log('Оценок:', allMarks.value.length);
    console.log('Занятий:', allSchedule.value.length);
    
    calculateTop();
    
    // Даем время на рендер DOM
    await nextTick();
    
    // Ждем появления canvas (иначе не загружается, графика нет)
    setTimeout(() => {
      drawChart();
    }, 200);
    
  } catch(e) {
    console.error('Ошибка загрузки:', e);
  }
});

function calculateTop() {
  const scheduleMap = new Map();
  allSchedule.value.forEach(lesson => {
    scheduleMap.set(lesson.id, lesson);
  });
  
  // Топ занятий
  const lessonMap = new Map();
  
  allMarks.value.forEach(mark => {
    const lessonId = mark.schedule_item?.id;
    
    if (lessonId && scheduleMap.has(lessonId)) {
      const lesson = scheduleMap.get(lessonId);
      
      if (!lessonMap.has(lessonId)) {
        lessonMap.set(lessonId, {
          discipline: lesson.discipline,
          sum: 0,
          count: 0
        });
      }
      const data = lessonMap.get(lessonId);
      data.sum += mark.mark;
      data.count++;
    }
  });
  
  const lessons = [];
  for (let [id, data] of lessonMap) {
    lessons.push({
      discipline: data.discipline,
      avg: (data.sum / data.count).toFixed(1)
    });
  }
  topLessons.value = lessons.sort((a,b) => b.avg - a.avg).slice(0,5);
  
  // Топ преподавателей
  const teacherMap = new Map();
  
  allMarks.value.forEach(mark => {
    const lessonId = mark.schedule_item?.id;
    const lesson = scheduleMap.get(lessonId);
    
    if (lesson && lesson.teacher) {
      if (!teacherMap.has(lesson.teacher)) {
        teacherMap.set(lesson.teacher, {
          sum: 0,
          count: 0
        });
      }
      const data = teacherMap.get(lesson.teacher);
      data.sum += mark.mark;
      data.count++;
    }
  });
  
  const teachers = [];
  for (let [teacher, data] of teacherMap) {
    teachers.push({
      teacher: teacher,
      avg: (data.sum / data.count).toFixed(1)
    });
  }
  topTeachers.value = teachers.sort((a,b) => b.avg - a.avg).slice(0,5);
}

function drawChart() {
  // Проверяем, есть ли данные для графика
  const scheduleMap = new Map();
  allSchedule.value.forEach(lesson => {
    scheduleMap.set(lesson.id, lesson);
  });
  
  // Группируем по датам
  const dailyMap = new Map();
  
  allMarks.value.forEach(mark => {
    const lessonId = mark.schedule_item?.id;
    const lesson = scheduleMap.get(lessonId);
    
    if (lesson && lesson.date) {
      if (!dailyMap.has(lesson.date)) {
        dailyMap.set(lesson.date, {
          sum: 0,
          count: 0
        });
      }
      const data = dailyMap.get(lesson.date);
      data.sum += mark.mark;
      data.count++;
    }
  });
  
  const dates = Array.from(dailyMap.keys()).sort();
  
  if (dates.length === 0) {
    console.log('Нет данных для графика');
    chartData.value = [];
    return;
  }
  
  const averages = dates.map(date => {
    const data = dailyMap.get(date);
    return (data.sum / data.count).toFixed(1);
  });
  
  chartData.value = dates.map((date, i) => ({
    date: date.slice(5),
    avg: parseFloat(averages[i])
  }));
  
  // Получаем canvas
  const canvas = chartCanvas.value;
  if (!canvas) {
    console.log('Canvas не найден');
    return;
  }
  
  const container = canvas.parentElement;
  canvas.width = container.clientWidth - 40;
  canvas.height = 400;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const width = canvas.width / chartData.value.length;
  const maxAvg = 5;
  
  chartData.value.forEach((item, i) => {
    const height = (item.avg / maxAvg) * canvas.height;
    const x = i * width;
    const y = canvas.height - height;
    
    ctx.fillStyle = '#007bff';
    ctx.fillRect(x, y, width - 2, height);
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(item.date, x + 5, canvas.height - 5);
    
    ctx.fillStyle = '#007bff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(item.avg, x + 5, y - 5);
  });
  
}
</script>

<style scoped>
.rating-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.rating-title {
  margin-bottom: 30px;
  font-size: 32px;
  color: #333;
}

.rating-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  margin-bottom: 15px;
  font-size: 20px;
  color: #495057;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
  display: inline-block;
}

.empty-data {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 5px;
}

.rating-item {
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  transition: transform 0.2s;
}

.rating-item:hover {
  transform: translateX(5px);
}

.rating-value {
  color: #007bff;
  font-weight: bold;
  font-size: 16px;
}

.chart-canvas {
  width: 100%;
  height: 400px;
  background: #fff;
}

.hidden {
  display: none;
}

@media (max-width: 768px) {
  .rating-page {
    padding: 10px;
  }
  
  .rating-title {
    font-size: 24px;
  }
  
  .rating-item {
    font-size: 14px;
  }
  
  .chart-canvas {
    height: 300px;
  }
}
</style>