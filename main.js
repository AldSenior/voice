const btn = document.querySelector(".btn")
const result = document.querySelector(".result")
const micBtn = document.querySelector(".mic-btn")
const loader = document.querySelector(".loader")

const speech = window.SpeechRecognition || window.webkitSpeechRecognition
if (!speech) {
	alert("Распознавание речи НЕ поддерживается в этом браузере.")
}

const rec = new speech()
rec.lang = "ru-RU"
rec.continuous = true
rec.interimResults = true

let isRecording = false
let accumulatedText = ""
let isMicConnected = false

// Обработчик события для подключения микрофона
micBtn.addEventListener("click", () => {
	if (isMicConnected) {
		alert("Микрофон уже подключен!")
		return
	}

	loader.style.display = "block" // Показываем индикатор подключения к микрофону

	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function (stream) {
			isMicConnected = true
			micBtn.classList.add("mic-connected")
			loader.style.display = "none" // Скрываем индикатор подключения

			// Обработка результатов распознавания речи
			rec.onresult = function (e) {
				const results = Array.from(e.results)
				const text = results[results.length - 1][0].transcript
				result.textContent = accumulatedText + text + " "
			}

			// Обработка завершения распознавания

			rec.onend = function () {
				if (isRecording) {
					accumulatedText = (accumulatedText ? ' ' : '') + result.textContent
					rec.start() // Перезапуск распознавания
				}
			}

			console.log("Микрофон подключен.")
		})
		.catch(function (err) {
			console.error("Ошибка доступа к микрофону: " + err.message)
			loader.style.display = "none" // Скрываем индикатор при ошибке
			alert("Ошибка доступа к микрофону: " + err.message)
		})
})

// Обработчик события для кнопки начала записи
btn.addEventListener("click", () => {
	if (!isMicConnected) {
		alert("Сначала подключите микрофон!")
		return
	}

	if (isRecording) {
		rec.stop() // Останавливаем запись
		btn.classList.remove("rec")
		isRecording = false
	} else {
		rec.start() // Запускаем запись
		btn.classList.add("rec")
		isRecording = true
	}
})

// Обработчик кнопки очистки текста
const clearBtn = document.querySelector(".clear-btn")
clearBtn.addEventListener("click", () => {
	result.textContent = ""
	accumulatedText = "" // Очищаем накопленный текст
})
