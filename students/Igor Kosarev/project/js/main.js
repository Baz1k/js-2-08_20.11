let url_productsData = 'https://raw.githubusercontent.com/igorkosarev/geekbrains-js2lv-json/master/productsData.json';

class Product {
  constructor(product) {
    this.title = product.title
    this.id = product.id
    this.img = product.img
    this.price = product.price
    this.cartImg = product.cartImg //добавляем к каждому продукту картинку для корзины
  }
  render() {
    return `<div class="product-item" data-id="${this.id}">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.title}</h3>
                        <p>${this.price} $</p>
                        <button class="buy-btn" 
                        data-id="${this.id}"
                        data-title="${this.title}"
                        data-image="${this.img}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`
  }
}

class Products {
  constructor(block) {
      this.products = []
      this.block = `.${block}`
      this._init()
    }
    //инициализация продуктов из репозитория
  _init() {
    fetch(url_productsData)
      .then(d => d.json())
      .then(data => {
        data.forEach(item => {
          this.products.push(new Product(item))
        })
      })
      .finally(() => this.render())
  }
  render() {
    let block = document.querySelector(this.block)
    let str = ''
    this.products.forEach(item => {
      str += item.render()
    })
    block.innerHTML = str
  }
}

let catalog = new Products('products')

class CartItem {
  constructor(item) {
    this.name = item.title;
    this.id = item.id;
    this.img = item.cartImg;
    this.price = +item.price;
    this.quantity = 1;
  }
  render() {
    return `<div class="cart-item" data-id="${this.id}">
                              <div class="product-bio">
                                  <img src="${this.img}" alt="Some image">
                                  <div class="product-desc">
                                      <p class="product-title">${this.name}</p>
                                      <p class="product-quantity">Quantity: ${this.quantity}</p>
                                      <p class="product-single-price">$${this.price} each</p>
                                  </div>
                              </div>
                              <div class="right-block">
                                  <p class="product-price">${this.quantity * this.price}</p>
                                  <button class="del-btn" data-id="${this.id}">&times;</button>
                              </div>
                          </div>`
  }
  addQuantity() {
    this.quantity++;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }
  render() {
    let allProducts = "";
    for (let el of this.items) {
      allProducts += el.render();
    }
    document.querySelector(`.cart-block`).innerHTML = allProducts;
  }
}
//глобальные сущности корзины и каталога (ИМИТАЦИЯ! НЕЛЬЗЯ ТАК ДЕЛАТЬ!)
//Новая корзина пользователя определяется классом
let userCart = new Cart;


//кнопка скрытия и показа корзины
document.querySelector('.btn-cart').addEventListener('click', () => {
  document.querySelector('.cart-block').classList.toggle('invisible');
});
//кнопки удаления товара (добавляется один раз)
document.querySelector('.cart-block').addEventListener('click', (evt) => {
    if (evt.target.classList.contains('del-btn')) {
      removeProduct(evt.target);
    }
  })
  //кнопки покупки товара (добавляется один раз)
document.querySelector('.products').addEventListener('click', (evt) => {
  if (evt.target.classList.contains('buy-btn')) {
    addProduct(evt.target);
  }
})

//создание товара
function createProduct(i) {
  return {
    id: ids[i],
    title: items[i],
    price: prices[i],
    img: image,
    cartImg: cartImage,
    // quantity: 0,
    // createTemplate: function () {
    //     return `<div class="product-item" data-id="${this.id}">
    //                 <img src="${this.img}" alt="Some img">
    //                 <div class="desc">
    //                     <h3>${this.name}</h3>
    //                     <p>${this.price} $</p>
    //                     <button class="buy-btn" 
    //                     data-id="${this.id}"
    //                     data-name="${this.name}"
    //                     data-image="${this.img}"
    //                     data-price="${this.price}">Купить</button>
    //                 </div>
    //             </div>`
    // },

    // add: function() {
    //     this.quantity++
    // }
  }
};

//рендер списка товаров (каталога)
// function renderProducts () {
//     let arr = [];
//     for (item of list) {
//         arr.push(item.createTemplate())
//     }
//     document.querySelector('.products').innerHTML = arr.join();
// }

// renderProducts ();

//CART

// Добавление продуктов в корзину
function addProduct(product) {
  let productId = +product.dataset['id'];
  let find = userCart.items.find(element => element.id === productId);
  let item = catalog.products.find(element => element.id === productId);
  if (!find) {
    userCart.items.push(new CartItem(item));
  } else {
    find.addQuantity();
  }
  userCart.render();

}


//удаление товаров
function removeProduct(product) {
  let productId = +product.dataset['id'];
  let find = userCart.items.find(element => element.id === productId);
  if (find.quantity > 1) {
    find.quantity--;
  } else {
    userCart.items.splice(userCart.items.indexOf(find), 1);
    document.querySelector(`.cart-item[data-id="${productId}"]`).remove()
  }
  userCart.render();
}

//перерендер корзины
//function renderCart() {
//  let allProducts = '';
//  for (el of userCart) {
//    allProducts += `<div class="cart-item" data-id="${el.id}">
//                          <div class="product-bio">
//                              <img src="${el.img}" alt="Some image">
//                              <div class="product-desc">
//                                  <p class="product-title">${el.name}</p>
//                                  <p class="product-quantity">Quantity: ${el.quantity}</p>
//                                  <p class="product-single-price">$${el.price} each</p>
//                              </div>
//                          </div>
//                          <div class="right-block">
//                              <p class="product-price">${el.quantity * el.price}</p>
//                              <button class="del-btn" data-id="${el.id}">&times;</button>
//                          </div>
//                      </div>`
//  }
//
//  document.querySelector(`.cart-block`).innerHTML = allProducts;
//}