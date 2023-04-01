const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')

// Fetch quotes from API and render them
function getQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => renderQuotes(quotes))
}

function renderQuotes(quotes) {
  quoteList.innerHTML = ''
  quotes.forEach(quote => {
    const li = document.createElement('li')
    li.classList.add('quote-card')

    const blockquote = document.createElement('blockquote')
    blockquote.classList.add('blockquote')

    const p = document.createElement('p')
    p.classList.add('mb-0')
    p.textContent = quote.quote

    const footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.textContent = quote.author

    const br = document.createElement('br')

    const likeButton = document.createElement('button')
    likeButton.classList.add('btn-success')
    likeButton.textContent = `Likes: `
    const likeCount = document.createElement('span')
    likeCount.textContent = quote.likes.length
    likeButton.appendChild(likeCount)

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn-danger')
    deleteButton.textContent = 'Delete'

    blockquote.appendChild(p)
    blockquote.appendChild(footer)
    blockquote.appendChild(br)
    blockquote.appendChild(likeButton)
    blockquote.appendChild(deleteButton)

    li.appendChild(blockquote)

    // Event listeners for delete and like buttons
    deleteButton.addEventListener('click', () => {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE'
      })
      .then(() => li.remove())
    })

    likeButton.addEventListener('click', () => {
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteId: quote.id })
      })
      .then(() => {
        likeCount.textContent = parseInt(likeCount.textContent) + 1
      })
    })

    quoteList.appendChild(li)
  })
}

// Event listener for quote form submission
quoteForm.addEventListener('submit', event => {
  event.preventDefault()
  const quote = event.target.elements['quote'].value
  const author = event.target.elements['author'].value

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quote, author })
  })
  .then(response => response.json())
  .then(quote => {
    quote.likes = []
    renderQuotes([quote])
  })

  quoteForm.reset()
})

// Initial fetch and render of quotes
getQuotes()
c