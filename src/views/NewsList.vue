<template>
    <div class="lobbyNews">
        <div class="lobbyNews__title">Лента новостей</div>
        <div class="lobbyNews__cards">
            <div class="lobbyNews__card">
                <div class="card__wrapper">
                    <img src="/public/logo/Bsu_Основная версия. Черный.png" alt="" class="card__logo">
                    <div class="card__title">Элитное IT-образование в Бурятии: БГУ и ВШЭ открывают программу двойных
                        дипломов</div>
                    <div class="card__date">13 марта</div>
                </div>
                <div class="card__wrapper">
                    <p class="card__description">Далеко-далеко за словесными горами в стране гласных и согласных живут
                        рыбные тексты. Свой своего ipsum рукописи текстов то над обеспечивает путь которой решила там
                        если
                        это что буквоград власти переписали, города lorem!</p>
                    <img src="/public/img/news1.png" alt="" class="card__img">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
document.title = 'Лента новостей'
</script>

<style scoped>
.lobbyNews {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
}

.lobbyNews__title {
    font-size: 40px;
}

.lobbyNews__cards {
    display: flex;
    flex-direction: column;
    gap: 20px;

}

.lobbyNews__card {
    border: 1px solid black;
    border-radius: 15px;
    padding: 10px;
}

.card__logo {
    width: 100px;
}

.card__title {
    font-weight: 700;
    background-color: antiquewhite;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.card__wrapper {
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.card__img {
    width: 300px;
}

.card__description {
    width: 400px;
    font-size: 20px;
    align-items: center;
    justify-self: center;
}
</style>