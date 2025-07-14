let itemIndex = null;
let items;

const loadItem = () => {
  let LeftSide = document.getElementById("imgOfItem");
  LeftSide.setAttribute("src", items[itemIndex].image);

  document.getElementById("name").textContent = items[itemIndex]["name"];
  document.getElementById("price").textContent =
    "$" + items[itemIndex]["price"];
  document.getElementById("description").textContent =
    items[itemIndex]["description"];
};

const changeItem = (index) => {
  if (itemIndex == index) return; //cuz whats the point of reloading the same item?
  document.querySelectorAll("#actualLinks button")[itemIndex].style.color = "";
  itemIndex = index;
  document.querySelectorAll("#actualLinks button")[itemIndex].style.color =
    "blue";
  loadItem();
};

async function getItems() {
  try {
    const response = await fetch("items.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function loadPageWithNewItem() {
  let siteTitle = document.querySelector("head title");
  items = await getItems();
  if (items === null) {
    siteTitle.innerHTML = "Error reading file!";
    document.querySelector("#actualItem").innerHTML = "Please try to refresh!";
    return;
  }
  itemIndex = Math.floor(Math.random() * items.length);
  let item = items[itemIndex];
  siteTitle.innerHTML = item.name;

  let content = ``;

  content = items
    .map(
      (itemObj, i) =>
        `<li> <button data-index="${i}" ${
          i === itemIndex ? ' style="color: blue;"' : ""
        }>${itemObj.name}</button> </li>`
    )
    .join("");
  document.getElementById("actualLinks").innerHTML = content;

  document.querySelectorAll("#actualLinks button").forEach((button) => {
    button.addEventListener("click", (btn) => {
      changeItem(Number(btn.target.dataset.index));
    });
  });
  loadItem();
}

// fetch('https://jsonplaceholder.typicode.com/posts')
//       .then(response => response.json())
//       .then(json => console.log(json))

document.getElementById("logo").addEventListener("click", () => {
  location.reload();
});

loadPageWithNewItem();

document.getElementById("addToCart").addEventListener("click", () =>
  //adding the button functionality
  {
    event.preventDefault();

    let how_many = parseInt(document.getElementById("quantity").value);

    if(how_many === NaN)
    {
      alert("Please enter a number");
      return;
    }

    const cart =
      localStorage.getItem("cart") === null
        ? {}
        : JSON.parse(localStorage.getItem("cart"));
      
    if(cart[items[itemIndex].name])
    {
      cart[items[itemIndex].name].quantity += how_many;
    }
    else
    {
      cart[items[itemIndex].name] = {
        quantity : how_many,
        actualItem : items[itemIndex],
      };
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }
);
