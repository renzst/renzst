// main.js

// general helper functions

function generateHex() {
    let num = Math.floor(Math.random()*Math.pow(16, 6));
    return "id" + num.toString(16);
}



// Library and methods definitions

function Library(...books) {
    this.bookArray = [];
    books.forEach(book => this.bookArray.push(book));
}

Library.prototype.addBooks = function(...books) {
    books.forEach(book => this.bookArray.push(book));
}

Library.prototype.getBooks = function() {
    return this.bookArray;
}

Library.prototype.getBook = function(id) {
    for (let book of this.bookArray) {
        if (book.uuid == id) {
            return book;
        }
    }
    return undefined;
}

Library.prototype.getBookCount = function() {
    return this.bookArray.length;
}

Library.prototype.removeBooks = function(...bookIds) {
    for (let id of bookIds) {
        for (let i = 0; i < this.bookArray.length; i++) {
            if (this.bookArray[i].uuid == id) {
                this.bookArray.splice(i, 1);
                break;
            }
        }
    }
}



// Book definition and methods

function Book(title, author, pages, read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.hasRead = read
    this.uuid = generateHex();
}

Book.prototype.wasItRead = function() {
    return "This book has " + (this.hasRead ? "" : "not ") + "been read yet."
}

Book.prototype.info = function() {
    return this.title + ", by " + this.author + ": ", this.pages + " pages. " + this.wasItRead()
}

Book.prototype.toString = function() {
    return this.uuid;
}

Book.prototype.toggleReadStatus = function() {
    this.hasRead = !this.hasRead;
}

Book.prototype.generateLibraryCard = function() {
    let bookTitle = document.createElement("h2");
    bookTitle.classList.add("book-title");
    bookTitle.textContent = this.title;

    let author = document.createElement("p");
    author.classList.add("author");
    author.textContent = this.author;

    let pages = document.createElement("p");
    pages.classList.add("pages");
    pages.textContent = this.pages;

    let readStatus = document.createElement("read-status");
    readStatus.classList.add("read-status");
    if (this.hasRead) {
        readStatus.classList.add("read-true");
        readStatus.textContent = "Read";
    }
    else {
        readStatus.textContent = "Unread";
    }

    let cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    cardContent.appendChild(bookTitle);
    cardContent.appendChild(author);
    cardContent.appendChild(pages);
    cardContent.appendChild(readStatus);

    let card = document.createElement("div");
    card.classList.add("library-card");
    card.id = this.uuid;

    if (this.hasRead) card.classList.add("read-true");
    
    card.appendChild(cardContent);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("delete");
    deleteBtn.addEventListener("click", () => {
        let thisCard = document.querySelector(`.carousel > .library-card#${card.id}`);
        thisCard.remove();
        biblio.removeBooks(card.id);
    });
    card.appendChild(deleteBtn);

    let toggleRead = document.createElement("button");
    toggleRead.innerText = this.hasRead ? "Mark unread" : "Mark read";
    toggleRead.addEventListener("click", () => {
        this.toggleReadStatus();
        updateCard(card.id);
    });
    card.appendChild(toggleRead);


    return card;
}

// DOM-specific functions

function updateCard(id) {
    let book = biblio.getBook(id);
    let card = document.querySelector(`.carousel > .library-card#${book.uuid}`)
    card.replaceWith(book.generateLibraryCard());
}

function populateCarousel(library) {
    const carousel = document.querySelector(".carousel");
    library.bookArray.forEach(book => {
        carousel.appendChild(book.generateLibraryCard());
    });
}

function updateCarousel(library) {
    const carouselChildren = document.querySelectorAll(".carousel > *");
    for (child of carouselChildren) {
        child.remove();
    }
    populateCarousel(library);
}

function initBookEntry() {
    const openButton = document.querySelector("#addBook");
    const form = document.querySelector("#bookEntry");
    
    openButton.addEventListener('click', () => {
        if(form.classList.contains("hidden")) {
            form.classList.remove("hidden")
        }
    })
    
    const submitBtn = document.querySelector("#bookEntrySubmit");
    submitBtn.addEventListener("click", () => {
        let book = makeBookFromResponses();
        biblio.addBooks(book);
        updateCarousel(biblio);
    });
}


function makeBookFromResponses() {
    let responses = [];
    for (let property of ["title", "author", "pages", "hasRead"]) {
        responses.push(document.querySelector(`.formInput > #${property}`).value);
    }
    return new Book(responses[0], responses[1], responses[2], responses[3]);
}

// Test books
const necro = new Book("Necropolitics", "Mbembe", 204, false);
const disci = new Book("Discipline and Punish", "Foucault", 364, true);
const lml = new Book("Living My Life", "Goldman", 673, true);
const marx = new Book("Das Kapital", "Marx", 1688, false);

// General code
let biblio = new Library(lml, marx, disci, necro);
populateCarousel(biblio);

initBookEntry(biblio);
