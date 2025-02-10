const btn = document.querySelector(".btn")
const result = document.querySelector(".result")

const speech = window.SpeechRecognition || window.webkitSpeechRecognition
if (!speech) {
	alert("Распознавание речи НЕ поддерживается")
}

const rec = new speech()
rec.lang = "ru-RU"
rec.continuous = true // Позволяет распознавать речь непрерывно
rec.interimResults = true // Позволяет получать промежуточные результаты

let isRecording = false // Флаг для отслеживания состояния записи
let accumulatedText = "" // Переменная для хранения текста всех сессий

navigator.mediaDevices.getUserMedia({ audio: true })
	.then(function (stream) {
		rec.onresult = function (e) {
			const results = Array.from(e.results)
			const text = results[results.length - 1][0].transcript

			// Отображаем текст вместе с накопленным
			result.textContent = accumulatedText + text + " "
		}

		rec.onend = function () {
			if (isRecording) {
				// Сохраняем текущее распознанное слово (или фразу)
				accumulatedText = (accumulatedText ? ' ' : '') + result.textContent.trim()
				rec.start() // Начинаем новую сессию распознавания
			}
		}

	})
	.catch(function (err) {
		console.error("Ошибка доступа к микрофону: " + err.message)
		alert("Ошибка доступа к микрофону: " + err.message)
	})


btn.addEventListener("click", () => {
	if (isRecording) {
		rec.stop() // Останавливаем распознавание
		btn.classList.remove("rec")
		isRecording = false
	} else {
		// При начале новой записи просто запускаем её
		rec.start() // Запускаем новую сессию распознавания
		btn.classList.add("rec")
		isRecording = true
	}
})

// Добавляем кнопку для очистки текста
const clearBtn = document.createElement("button")
clearBtn.textContent = "Очистить текст"
clearBtn.addEventListener("click", () => {
	result.textContent = ""
	accumulatedText = "" // Очищаем накопленный текст
})
document.body.appendChild(clearBtn)
