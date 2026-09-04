/*=============== SHOW SIDEBAR ===============*/
const navMenu = document.getElementById("sidebar"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== SIDEBAR SHOW =====*/
/* Validate If Constant Exists */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-sidebar");
  });
}

/*===== SIDEBAR HIDDEN =====*/
/* Validate If Constant Exists */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-sidebar");
  });
}

/*=============== SKILLS TABS ===============*/
const tabs = document.querySelectorAll("[data-target]"),
  tabContent = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContent.forEach((tabContents) => {
      tabContents.classList.remove("skills__active");
    });

    target.classList.add("skills__active");

    tabs.forEach((tab) => {
      tab.classList.remove("skills__active");
    });

    tab.classList.add("skills__active");
  });
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/*===== Link Active Work =====*/
const linkWork = document.querySelectorAll(".work__item");

function activeWork() {
  linkWork.forEach((l) => l.classList.remove("active-work"));
  this.classList.add("active-work");
}

linkWork.forEach((l) => l.addEventListener("click", activeWork));

/*===== Work Popup =====*/
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("work__button")) {
    togglePortfolioPopup();
    portfolioItemDetails(e.target.parentElement);
  }
});

function togglePortfolioPopup() {
  document.querySelector(".portfolio__popup").classList.toggle("open");
}

document
  .querySelector(".portfolio__popup-close")
  .addEventListener("click", togglePortfolioPopup);

function portfolioItemDetails(portfolioItem) {
  document.querySelector(".pp__thumbnail img").src =
    portfolioItem.querySelector(".work__img").src;
  document.querySelector(".portfolio__popup-subtitle span").innerHTML =
    portfolioItem.querySelector(".work__title").innerHTML;
  document.querySelector(".portfolio__popup-body").innerHTML =
    portfolioItem.querySelector(".portfolio__item-details").innerHTML;
}
/*=============== SERVICES MODAL ===============*/
const modalViews = document.querySelectorAll(".services__modal"),
  modelBtns = document.querySelectorAll(".services__button"),
  modalCloses = document.querySelectorAll(".services__modal-close");

let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modelBtns.forEach((modelBtn, i) => {
  modelBtn.addEventListener("click", () => {
    modal(i);
  });
});

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove("active-modal");
    });
  });
});

/*=============== SWIPER TESTIMONIAL ===============*/
let swiper = new Swiper(".testimonials__container", {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
  },
});

/*=============== INPUT ANIMATION ===============*/
const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
// get all sections that have an id defined
const sections = document.querySelectorAll("section[id]");

// add an event listener listening for scroll
window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
  // get current scroll position
  let scrollY = window.pageYOffset;
  // Now we loop through sections to get height, top and ID values for each
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute("id");
    /* - If our current scroll position enters the space where current section on screen is, add .active class to corresponding navigation link, else remove it
    - To know which link needs an active class, we use sectionId variable we are getting while looping through sections as an selector */
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}

/*=============== SHOW SCROLL UP ===============*/
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // when the scroll is higher than 350 viewport height, add the show-scroll class to a tag with the scroll-top class
  if (this.scrollY >= 350) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/* EMAIL MANAGEMENT */
/* const publicKey = creds.publicKey;
const serviceId = creds.serviceId;

console.log(publicKey);

emailjs.init({
  publicKey,
});

document
  .querySelector(".contact__form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const phone = document.querySelector('input[type="tel"]').value;
    const message = document.querySelector("textarea").value;

    // Validate form data
    if (!username || !email || !phone || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = {
      username: username,
      email: email,
      phone: phone,
      message: message,
    };

    console.log(formData);

    // Send email using EmailJS
    emailjs.send(serviceId, "contact__form", formData).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Message sent successfully!");
      },
      function (error) {
        console.log("FAILED...");
        console.error(error);
        alert("Failed to send message. Please try again later.");
      }
    );
  }); */

/*=============== THEME SWITCHER ===============*/
const themeButton = document.getElementById('theme-switcher');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme or default to dark
const currentTheme = localStorage.getItem('selected-theme') || 'dark';
const currentIcon = localStorage.getItem('selected-icon') || 'uil-moon';

// Apply saved theme
if (currentTheme === 'light') {
  body.classList.add('light-theme');
  themeIcon.classList.replace('uil-moon', 'uil-sun');
}

// Theme toggle function
themeButton?.addEventListener('click', () => {
  // Toggle theme
  body.classList.toggle('light-theme');
  
  // Change icon
  const isLightTheme = body.classList.contains('light-theme');
  themeIcon.classList.replace(
    isLightTheme ? 'uil-moon' : 'uil-sun',
    isLightTheme ? 'uil-sun' : 'uil-moon'
  );
  
  // Save theme preference
  localStorage.setItem('selected-theme', isLightTheme ? 'light' : 'dark');
  localStorage.setItem('selected-icon', isLightTheme ? 'uil-sun' : 'uil-moon');
});

/*=============== CHATBOT SECTION ===============*/
// ✅ Chatbot functionality is loaded from chatbot.js
// Features: Smart LLM integration with Groq API + reliable fallback responses
// Setup: Get free API key from https://console.groq.com for AI responses

/*=============== SMOOTH SECTION ANIMATIONS ===============*/
// Intersection Observer for smooth fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      entry.target.style.animationDelay = '0.2s';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections for smooth animations
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section:not(.chatbot)');
  const cards = document.querySelectorAll('.skills__card, .services__card, .work__card, .testimonial__card');
  
  // Add fade-in classes to sections (excluding chatbot)
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
    setTimeout(() => observer.observe(section), index * 100);
  });
  
  // Add staggered animations to cards
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    setTimeout(() => observer.observe(card), index * 150);
  });

  // Ensure chatbot section is visible and animated properly
  const chatbotSection = document.querySelector('.chatbot');
  if (chatbotSection) {
    chatbotSection.style.opacity = '1';
    chatbotSection.style.transform = 'translateY(0)';
  }
});

