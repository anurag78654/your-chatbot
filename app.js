const DOM = {
  messages: document.getElementById('messages'),
  welcome: document.getElementById('welcome'),
  input: document.getElementById('user-input'),
  send: document.getElementById('send-btn'),
  toggle: document.getElementById('theme-toggle'),
}

const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  document.body.className = savedTheme
} else {
  document.body.className = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

DOM.toggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

DOM.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
})

DOM.send.addEventListener('click', sendMessage)

async function sendMessage() {
  const text = DOM.input.value.trim()
  if (!text) return

  DOM.input.value = ''
  DOM.welcome.classList.add('hidden')
  DOM.send.disabled = true

  addMessage(text, 'user')
  const typingId = addTyping()

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    const data = await res.json()
    removeTyping(typingId)
    addMessage(data.reply, 'bot')
  } catch (err) {
    removeTyping(typingId)
    addMessage(`Error: ${err.message}`, 'bot')
  } finally {
    DOM.send.disabled = false
    DOM.input.focus()
  }
}

function addMessage(text, role) {
  const div = document.createElement('div')
  div.className = `message ${role}`
  div.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`
  DOM.messages.appendChild(div)
  scrollDown()
  return div
}

function addTyping() {
  const div = document.createElement('div')
  div.className = 'message bot typing'
  div.innerHTML = `<div class="bubble"><span></span><span></span><span></span></div>`
  DOM.messages.appendChild(div)
  scrollDown()
  return div
}

function removeTyping(id) {
  if (id && id.parentNode) id.remove()
}

function scrollDown() {
  requestAnimationFrame(() => {
    DOM.messages.scrollTop = DOM.messages.scrollHeight
  })
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
