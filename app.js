let form = document.querySelector('.form-body')
let inputEmail = form.querySelector('._email')
let inputPassword = form.querySelector('._password')
let button = form.querySelector('.form-body__button')
let input = form.querySelectorAll('.form-body__input')
let loader = document.querySelector('.lds-ellipsis')
let body = document.querySelector('.body')

button.disabled = false
for (let i = 0; i < input.length; i++) {
  input[i].disabled = false
}

let formatEmail = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$|^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/

let formatPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/

function showOkMessage() {
  for (let i = 0; i < input.length; i++) {
    input[i].style.border='1px solid #43A470'
  }
}

const submitForm = async (e) => {
  e.preventDefault()

  if (inputEmail.value.match(formatEmail) && inputPassword.value.match(formatPassword)) {
    showOkMessage()
  }


  let login = inputEmail.value
  let password = inputPassword.value

  async function getRequest() {
    try {
      const response = await fetch(`https://test-works.pr-uni.ru/api/login/index.php?login=${login}&password=${password}`)
      const data = await response.json()
      return data
    }
    catch (err) {
      console.log(err.message)
    }
  }

  loader.style.display = 'inline-block'

  button.disabled = true
  for (let i = 0; i < input.length; i++) {
    input[i].disabled = true
  }

  let obj = await getRequest()
  console.log(obj)

  if (obj.status === 'error') {

    let error = document.createElement('div')

    error.innerHTML = `${obj.errorMessage}`

    form.insertBefore(error, button)

    error.classList.add('error')

    for (let i = 0; i < input.length; i++) {
      input[i].classList.add('input-error')
    }
  }

  if (obj.status === 'ok') {
    showOkMessage()

    document.cookie=`token=${obj.token}`

    form.style.display='none'

    let userMessage = `<div class="user">${obj.user.name}, Вы успешно авторизованы!</div>`

    body.insertAdjacentHTML('beforeend', userMessage)

    const user = document.querySelector('.user')

    user.classList.add('show')

  }

  loader.style.display = 'none'

  button.disabled = false
  for (let i = 0; i < input.length; i++) {
    input[i].disabled = false
  }

  inputEmail.focus()
}

form.addEventListener('submit', submitForm)


const changeInput = () => {
  let error = document.querySelector('.error')

  if (inputEmail.value === '') {
    inputEmail.classList.add('input-ok')
    inputPassword.classList.add('input-ok')
    error.style.display='none'
  }
}

form.addEventListener('input', changeInput)