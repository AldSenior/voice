const btn = document.querySelector(".btn")
const result = document.querySelector(".result")
const micBtn = document.querySelector(".mic-btn")

const speech = window.SpeechRecognition || window.webkitSpeechRecognition
if (!speech) {
	alert("Распознавание речи НЕ поддерживается")
}

const rec = new speech()
rec.lang = "ru-RU"
rec.continuous = true
rec.interimResults = true

let isRecording = false
let accumulatedText = ""
let isMicConnected = false // Флаг для отслеживания состояния микрофона

micBtn.addEventListener("click", () => {
	if (isMicConnected) {
		alert("Микрофон уже подключен!")
		return
	}

	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function (stream) {
			isMicConnected = true // Меняем флаг на true
			micBtn.classList.add("mic-connected") // Меняем класс для стиля

			rec.onresult = function (e) {
				const results = Array.from(e.results)
				const text = results[results.length - 1][0].transcript.trim()
				result.textContent = accumulatedText + text + " "
			}

			rec.onend = function () {
				if (isRecording) {
					accumulatedText = (accumulatedText ? ' ' : '') + result.textContent.trim()
					rec.start()
				}
			}

			console.log("Микрофон подключен.")
		})

		.catch(function (err) {
			console.error("Ошибка доступа к микрофону: " + err.message)
			alert("Ошибка доступа к микрофону: " + err.message)
		})
})

btn.addEventListener("click", () => {
	if (!isMicConnected) {
		alert("Сначала подключите микрофон!")
		return
	}

	if (isRecording) {
		rec.stop()
		btn.classList.remove("rec")
		isRecording = false
	} else {
		rec.start()
		btn.classList.add("rec")
		isRecording = true
	}
})

// Кнопка очистки текста
const clearBtn = document.querySelector(".clear-btn")
clearBtn.addEventListener("click", () => {
	result.textContent = ""
	accumulatedText = ""
})
