///////////////////////////////////////
'use strict'
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const navItem = document.querySelector('.nav');


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///Code for scrolling through page
btnScrollTo.addEventListener("click",function(event){
  const s1coords = section1.getBoundingClientRect()

  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top+ window.pageYOffset,
    behaviour: 'smooth',
  });
})
///Navigation Code

//inefficent because we are adding the event listener to every single elemnt we want
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behaviour:"smooth"})
//   })
// })

//using event delegation here
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  const id = e.target.getAttribute('href')
  document.querySelector(id).scrollIntoView({behaviour:"smooth"})
})

//implementing the tabbed component
tabsContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab')
  if(!clicked)return
  ///removing the active class from the tab
  tabs.forEach(tab=>tab.classList.remove('operations__tab--active'))
  //adding the active class to the button that was clicked
  clicked.classList.add('operations__tab--active')

  ///Activating the content area
  const contentNum = clicked.getAttribute('data-tab');
  tabContent.forEach(tab=>tab.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${contentNum}`).classList.add('operations__content--active')

})
///Adding the fade out feature on the navLinks when one link is hovered overlay

function setOpacity(e,opactiy){
  if(e.target.classList.contains('nav__link')){
    const link =  e.target;
    const children = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    children.forEach(child =>{
      if(child!==link){
        child.style.opacity =opactiy
      }
    })
    logo.style.opacity = opactiy
  }
}
navItem.addEventListener('mouseover',function(e){
  setOpacity(e,0.5)
})

navItem.addEventListener('mouseout',function(e){
  setOpacity(e,1)
})
///Implenting the sticky navbar with the intersection observer aperiam
// const obsCallBack = function(entries, observer){
//   entries.forEach(entry =>{
//     console.log(entry);
//   })
// }
// const obsOptions ={
//   root: null,
//   threshold: [0,0.2]
//
// }
// const observer = new IntersectionObserver(obsCallBack,obsOptions)
// observer.observe(section1)
///To implent the sticky navbar, we want it to become sticky when the header element is no longer in view

const header = document.querySelector('.header')
const navHeight = navItem.getBoundingClientRect().height;


const stickyNavBar = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting) navItem.classList.add('sticky')
  else navItem.classList.remove('sticky')
}

const headerObserver = new IntersectionObserver(stickyNavBar,{
  root:null,
  threshold: 0,
  rootMargin:`-${navHeight}px`
})
headerObserver.observe(header)

///Revealing the elements/ sections of the page as we scroll down the pageXOffset

const allSections = document.querySelectorAll('.section')

const displaySection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
}
const sectionObserver = new IntersectionObserver(displaySection, {
  root: null,
  threshold: 0,
  rootMargin:'-200px'
})
allSections.forEach(function(section){
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

//Lazy Loading the images on the page for better performance

const images = document.querySelectorAll('img[data-src]')

const displayImg = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return
  ///the logic will only apply if the viewport is intersecting the image,
  //we want to replace the src attribute in the element with the data-src

  entry.target.src = entry.target.dataset.src;
  //we add the load event listener to this because we want to remove the blurry class once the image is fully loaded
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imageObserver = new IntersectionObserver(displayImg, {
  root:null,
  threshold:0
})

images.forEach(img => {
  imageObserver.observe(img)
})



//Slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();





///learning stuff
const randomInt = (min,max) => Math.floor(Math.random() * (max-min +1) + min)

const randomColor =() => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`


const h1 = document.querySelector('h1')



////
