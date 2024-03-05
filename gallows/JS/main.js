/*const swup = new Swup();*/

document.body.onload = function() {
  setTimeout( function(){
  let preloader = document.getElementById('preloader');
  if ( !preloader.classList.contains('hide') )
  {
      preloader.classList.add('hide');
  }
  }, 1500);
}

function audioMain() {
  let soundButton = document.querySelector('.soundbutton');
  let	audio = document.querySelector('.audio');

  audio.volume = 0.03;
  
  soundButton.addEventListener('click', elem => {
    soundButton.classList.toggle('paused')
    audio.paused ? audio.play() : audio.pause()
  })

  window.onfocus = function() {
    soundButton.classList.contains('paused') ? audio.pause() : audio.play()
  }

  window.onblur = function() {
  audio.pause()
  }
}
audioMain();

/*document.getElementById('playButton').addEventListener('click', function() {
  localStorage.setItem('playMusic', 'true');
  window.location.href = '/HTML/game-info.html';
});
window.onload = function() {
  let shouldPlayMusic = localStorage.getItem('playMusic');
  if (shouldPlayMusic === 'true') {
      let	audio = document.getElementsByClassName('audio');
      audio.play();
      shouldPlayMusic === 'false';
  }
};*/

document.querySelectorAll('video').playbackRate = 10;

let menuTavern = document.querySelector('.header__tavern a svg use');
let tavernOption = document.querySelector('.game__info-tavern');
let audioTAvern = new Audio('/assets/audio/tavern-audio/tavern-audio2.mp3');
let audioMain2 = document.querySelector('.game__info-footer .header__footer-audio .audio');
audioTAvern.volume = 0.01;
audioTAvern.loop = true;
menuTavern.onclick = () => {
  if (menuTavern.classList.contains('active')) {
    menuTavern.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/assets/boxicons-2.1.4/svg/logos/bxl-shopify.svg#shopify');
    audioTAvern.pause();
    audioMain2.play();
  } else {
    menuTavern.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/assets/boxicons-2.1.4/svg/logos/bxl-shopify.svg#shopify-close');
    audioTAvern.play();
    audioMain2.pause();
  }
  menuTavern.classList.toggle('active');
  tavernOption.classList.toggle('active-bar');
}

/*
tavern actions
*/
window.addEventListener('click', function (event) {
  let counter;
  if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
  const counterWrapper = event.target.closest('.counter-wrapper');
  counter = counterWrapper.querySelector('[data-counter]');
  }
  if (event.target.dataset.action === 'plus') {
    counter.innerText = ++counter.innerText;
  }
  if (event.target.dataset.action === 'minus') {
    if (parseInt(counter.innerText) > 0) {
      counter.innerText = --counter.innerText;
    } else if (event.target.closest('.cart-wrapper') && parseInt(counter.innerText) <= 1) {
      event.target.closest('.cart-item').remove();
      toggleCartStatus();
      calcCartPriceAndDelivery();
    }
  }
  if (event.target.hasAttribute('data-action') && event.target.closest('.cart-wrapper')) {
    calcCartPriceAndDelivery();
  }
});

const productsContainer = document.querySelector('#ability-container');
getProducts();
async function getProducts() {
    const response = await fetch('/JS/spells.json');
    const productsArray = await response.json();
	renderProducts(productsArray);
}
function renderProducts(productsArray) {
  productsArray.forEach(function (item) {
      const productHTML = `<div class="cart-item card" data-id="${item.id}">
            <div class="cart-item__top">
              <div class="cart-item__img">
                <img src="${item.imgSrc}" alt="${item.title}">
              </div>
              <div class="cart-item__desc">
                <div class="cart-item__title">${item.title}</div>
                <p class="text">${item.spellInfo}</p>
                <div class="cart-item__details">
                  <div class="items items--small counter-wrapper">
                    <div class="items__control" data-action="minus">-</div>
                    <div class="items__current" data-counter="">0</div>
                    <div class="items__control" data-action="plus">+</div>
                  </div>
                  <div class="price">
                    <div class="price__currency">${item.price}</div>
                  </div>
                </div>
                <button data-cart type="button" class="btn-tavern">
                  In the backpack
                </button>
              </div>
            </div>
          </div>`;
      productsContainer.insertAdjacentHTML('beforeend', productHTML);
  });
}

/*
cart
*/
const cartWrapper =  document.querySelector('.cart-wrapper');
window.addEventListener('click', function (event) {
	if (event.target.hasAttribute('data-cart')) {
		const card = event.target.closest('.card');
		const spellsInfo = {
			id: card.dataset.id,
			imgSrc: card.querySelector('.cart-item__img img').getAttribute('src'),
			title: card.querySelector('.cart-item__title').innerText,
			price: card.querySelector('.price__currency').innerText,
			counter: card.querySelector('[data-counter]').innerText,
		};
    if (parseInt(spellsInfo.counter) === 0) {
      return;
  }
  
  const totalPriceEl = document.querySelector('.game__info-total');
  const totalPriceE2 = document.querySelector('.total-price');
    if (totalPriceEl.innerText && spellsInfo.price && (parseInt(totalPriceEl.innerText) - (parseInt(spellsInfo.price) * parseInt(spellsInfo.counter)) < 0)) {
      alert('The total amount must not exceed 1000');
      return;
    }
    calcCartPriceAndDelivery();
    if(parseInt(totalPriceE2.innerText) + (parseInt(spellsInfo.price) * parseInt(spellsInfo.counter)) > 1000) {
      alert('The total amount must not exceed 1000');
      return;
    }

    /**
    Changing the initial number of tokens
     */
    const observer = new MutationObserver(function() {
      const totalPriceEl = document.querySelector('.total-price');
      const gameInfoTotalEl = document.querySelector('.game__info-total');
      gameInfoTotalEl.innerText = 1000 - parseInt(totalPriceEl.innerText);
      if(gameInfoTotalEl.innerText < 500) {
        gameInfoTotalEl.style.color = "var(--space-red-cart)";
      } else {
        gameInfoTotalEl.style.color = "var(--white)";
      }
    });
    const targetNode = document.querySelector('.total-price');
    observer.observe(targetNode, { childList: true, subtree: true });

		const itemInCart = cartWrapper.querySelector(`[data-id="${spellsInfo.id}"]`);
		if (itemInCart) {
			const counterElement = itemInCart.querySelector('[data-counter]');
			counterElement.innerText = parseInt(counterElement.innerText) + parseInt(spellsInfo.counter);
		} else {
        const cartItemHTML = `<div class="cart-item" data-id="${spellsInfo.id}">
                  <div class="cart-item__top">
                    <div class="cart-item__img">
                      <img src="${spellsInfo.imgSrc}" alt="${spellsInfo.title}">
                    </div>
                    <div class="cart-item__desc">
                      <div class="cart-item__title">${spellsInfo.title}</div>
                      <div class="cart-item__details">
                        <div class="items items--small counter-wrapper">
                          <div class="items__control" data-action="minus">-</div>
                          <div class="items__current" data-counter="">${spellsInfo.counter}</div>
                          <div class="items__control" data-action="plus">+</div>
                        </div>
                        <div class="price">
                          <div class="price__currency">${spellsInfo.price}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
			cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
		}
		card.querySelector('[data-counter]').innerText = '1';
		toggleCartStatus();
		calcCartPriceAndDelivery();
	}
});

function calcCartPriceAndDelivery() {
	const cartWrapper = document.querySelector('.cart-wrapper');
	const priceElements = cartWrapper.querySelectorAll('.price__currency');
	const totalPriceENow = document.querySelector('.total-price');
	
  let priceTotal = 0;
	
	priceElements.forEach(function (item) {
		const amountEl = item.closest('.cart-item').querySelector('[data-counter]');
		priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
	});
	
	totalPriceENow.innerText = priceTotal;
}

function toggleCartStatus() {

  const cartWrapper = document.querySelector('.cart-wrapper');
  const cartEmptyBadge = document.querySelector('[data-cart-empty]');
  const orderForm = document.querySelector('#order-form');

  if (cartWrapper.children.length > 0) {
      cartEmptyBadge.classList.add('none');
      orderForm.classList.remove('none');
  } else {
      cartEmptyBadge.classList.remove('none');
      orderForm.classList.add('none');
  }
}

/*
save items to Cart
*/
/*function saveCartItems() {
  const cartItemsOld = Array.from(cartWrapper.querySelectorAll('.cart-item')).map(item => {
      return {
          id: item.dataset.id,
          imgSrc: item.querySelector('.cart-item__img img').getAttribute('src'),
          title: item.querySelector('.cart-item__title').innerText,
          price: item.querySelector('.price__currency').innerText,
          counter: item.querySelector('[data-counter]').innerText,
      };
  });
  localStorage.setItem('cartItemsOld', JSON.stringify(cartItemsOld));
}*/

/*
loaded items
*/
/*document.addEventListener('DOMContentLoaded', loadCartItems);
function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItemsOld')) || [];
  for (const item of cartItems) {
      const cartItemHTML = `<div class="cart-item" data-id="${item.id}">
                <div class="cart-item__top">
                  <div class="cart-item__img">
                    <img src="${item.imgSrc}" alt="${item.title}">
                  </div>
                  <div class="cart-item__desc">
                    <div class="cart-item__title">${item.title}</div>
                    <div class="cart-item__details">
                      <div class="items items--small counter-wrapper">
                        <div class="items__control" data-action="minus">-</div>
                        <div class="items__current" data-counter="">${item.counter}</div>
                        <div class="items__control" data-action="plus">+</div>
                      </div>
                      <div class="price">
                        <div class="price__currency">${item.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
      cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
  }
}*/