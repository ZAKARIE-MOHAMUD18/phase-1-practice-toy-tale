let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
const toyCollection = document.getElementById("toy-collection");
const toyForm = document.querySelector(".add-toy-form");

// 🚀 Fetch and render all toys
fetch("http://localhost:3000/toys")
  .then((res) => res.json())
  .then((toys) => {
    toys.forEach((toy) => renderToyCard(toy));
  });

// 🧸 Render one toy card
function renderToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => handleLike(toy, card));

  toyCollection.appendChild(card);
}

// ➕ Add a new toy
toyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const image = e.target.image.value;

  const newToy = {
    name,
    image,
    likes: 0
  };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  })
    .then((res) => res.json())
    .then((toy) => {
      renderToyCard(toy);
      toyForm.reset(); // Clear the form
    });
});

// ❤️ Handle likes
function handleLike(toy, card) {
  const updatedLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: updatedLikes })
  })
    .then((res) => res.json())
    .then((updatedToy) => {
      toy.likes = updatedToy.likes;
      const likesP = card.querySelector("p");
      likesP.textContent = `${updatedToy.likes} Likes`;
    });
}
