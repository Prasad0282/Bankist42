"use strict";

///////////////////////////////////////
// Modal window
const header = document.querySelector(".header");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// btnScrollTo.addEventListener("click", function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   console.log(e.target.getBoundingClientRect());
//   console.log("Current Scroll(X/Y)", window.scrollX, scrollY);
//   console.log(
//     "height/width viewport",
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );
//   section1.scrollIntoView({ behavior: "smooth" });
// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );
// window.scrollTo({
//   left: s1coords.left + window.scrollX,
//   top: s1coords.top + window.scrollY,
//   behavior: "smooth",
// });
//});
//PAGE NAVIGATION
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });
//1.Add event listener to common parent element
//2.determine what element originated the element
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});
//Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  console.log(clicked);
  //guard clause
  if (!clicked) return;
  //active tab
  tabs.forEach((t) => t.classList.remove("operations__tab__active"));
  //remove tab
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  clicked.classList.add("operations__tab__active");
  //Activate content area
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menu fade animation
//mouseover!=mouseout
//mouseenter!=mouseleave
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// nav.addEventListener("mouseover", handleHover.bind(0.5));
// nav.addEventListener("mouseout", handleHover.bind(1));
// //Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function (e) {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

//sticky navigation:intersection observer api
// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const header1 = document.querySelector(".header");
const navWeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navWeight}px`,
});
headerObserver.observe(header1);

//Reveal sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add("section--hidden");
});

//Lazy loading images
const imageTargets = document.querySelectorAll("img[data-src");
const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  //replace src to data src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imageTargets.forEach((img) => imgObserver.observe(img));

//SLider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnleft = document.querySelector(".slider__btn--left");
  const btnright = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");
  let curSlide = 0;
  const maxSlide = slides.length;
  // const slider = document.querySelector(".slider");
  // slider.style.transform = "scale(0.3) translateX(-1000px)";
  // slider.style.overflow = "visible";

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //slide next
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
  //EVENT HANDLERS
  btnright.addEventListener("click", nextSlide);
  btnleft.addEventListener("click", prevSlide);
  document.addEventListener("keydown", function (e) {
    console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
//0 100 200 300
// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener("mouseout", function (e) {
//   handleHover(e, 1);
// });
//Selecting element
//console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

//document.querySelector(".header");
// const allSection = document.querySelectorAll(".section");
// console.log(allSection);
// document.getElementById("section--1");
// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);
// console.log(document.getElementsByClassName("btn"));
//Creating and inserting
//.insertAdjacentHtml
const msg = document.createElement("div");
msg.classList.add("cookie-message");
// msg.textContent = "WE use cookies for improved functionality and analytics";
msg.innerHTML =
  "WE use cookies for improved functionality and analytics<button class='btn btn--close-cookie'>Got it!</button>";
//header.prepend(msg);
header.append(msg);
//header.append(msg.cloneNode(true));
// header.before(msg);
// header.after(msg);
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    msg.remove();
    /*msg.parentElement.removeChild(msg);*/
  });
//STYLES
msg.style.background = "#37383d";
msg.style.width = "120%";
// console.log(getComputedStyle(msg).color);
// console.log(getComputedStyle(msg).height);
msg.style.height =
  Number.parseFloat(getComputedStyle(msg).height, 10) + 40 + "px";
// document.documentElement.style.setProperty("--color-primary", "orangered");

//ATTRIBUTES
const logo = document.querySelector(".nav__logo");
logo.alt = "Beautiful minimalist logo";
//console.log(logo.alt);
logo.setAttribute("company", "Bankist");
// console.log(logo.src);
// console.log(logo.getAttribute("src"));
//onst link = document.querySelector(".twitter-link");
// onsole.log(link.href);
// consolce.log(link.getAttribute("href"));
//DATA ATTRIBUTES
//console.log(logo.dataset.versionNumber);
//CLASSES
// logo.classList.add("c", "j");
// logo.classList.remove("c", "j");
// logo.classList.toggle("c");
// logo.classList.contains("c");
//console.log(logo.className);
logo.className = "munna";
console.log(logo.className);

const h1 = document.querySelector("h1");
const alertH1 = function (e) {
  alert("addEventListener:Great you are reading heading");
  //h1.removeEventListener("mouseenter", alertH1);
};
h1.addEventListener("mouseenter", alertH1);
setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 1000);
// h1.onmouseenter = function (e) {
//   alert("addEventListener:Great you are reading heading");
// };
//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("LINK", e.target, e.currentTarget);
//   e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("LINK", e.target, e.currentTarget);
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("LINK", e.target, e.currentTarget);
// });
// const h12 = document.querySelector("h1");
// console.log(h12.querySelectorAll(".highlight"));
// console.log(h12.childNodes);
// console.log(h12.children);
// h12.firstElementChild.style.color = "white";
// h12.lastElementChild.style.color = "black";
// //going upwards:parents
// console.log(h12.parentElement);
// h1.closest(".header").style.background = "var(--gradient-secondary)";
// h1.closest("h1").style.background = "var(--gradient-primary)";
// //going sideways:siblings
// console.log(h12.previousElementSibling);
// console.log(h12.nextElementSibling);
// console.log(h12.previousSibling);
// console.log(h12.parentElement.children);
// [...h12.parentElement.children].forEach(function (el) {
//   if (el != h1) el.style.transform = "scale(0.5)";
// });
