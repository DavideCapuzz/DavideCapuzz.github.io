(function($) {
  "use strict";
  var timer =2000;
  /*--------------------------
  preloader
  ---------------------------- */
  $(window).on('load', function() {
    var pre_loader = $('#preloader');
    pre_loader.fadeOut('slow', function() {
      $(this).remove();
    });
  });

  /*---------------------
   TOP Menu Stick
  --------------------- */
  // var s = $("#sticker");
  // var pos = s.position();
  // $(window).on('scroll', function() {
  //   var windowpos = $(window).scrollTop() > 300;
  //   if (windowpos > pos.top) {
  //     s.addClass("stick");
  //   } else {
  //     s.removeClass("stick");
  //   }
  // });

  /*----------------------------
   Navbar nav
  ------------------------------ */
  // var main_menu = $(".main-menu ul.navbar-nav li ");
  // main_menu.on('click', function() {
  //   main_menu.removeClass("active");
  //   $(this).addClass("active");
  // });

  /*----------------------------
   wow js active
  ------------------------------ */
  new WOW().init();

  $(".navbar-collapse a:not(.dropdown-toggle)").on('click', function() {
    $(".navbar-collapse.collapse").removeClass('in');
  });

  //---------------------------------------------
  //Nivo slider
  //---------------------------------------------
  // $('#ensign-nivoslider').nivoSlider({
  //   effect: 'random',
  //   slices: 15,
  //   boxCols: 12,
  //   boxRows: 8,
  //   animSpeed: 500,
  //   pauseTime: 5000,
  //   startSlide: 0,
  //   directionNav: true,
  //   controlNavThumbs: false,
  //   pauseOnHover: true,
  //   manualAdvance: false,
  // });

  /*----------------------------
   Scrollspy js
  ------------------------------ */
  // var Body = $('body');
  // Body.scrollspy({
  //   target: '.navbar-collapse',
  //   offset: 80
  // });

  /*---------------------
    Venobox
  --------------------- */
  // var veno_box = $('.venobox');
  // veno_box.venobox();

  /*----------------------------
  Page Scroll
  ------------------------------ */
  var page_scroll = $('a.page-scroll');
  page_scroll.on('click', function(event) {
    var $anchor = $(this);
    if ($anchor.attr('href')=="#about")
    {
      timer = 4000;
    } else
    { timer = 2000;}
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });

  /*--------------------------
    Back to top button
  ---------------------------- */
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });
  
  // $('[data-toggle="popover"]').popover();
  // $('[data-bs-toggle="popover"]').each(function () {
  //   new bootstrap.Popover(this);
  // }); 
  // initialize the popvoer on competences 
  $('[data-bs-toggle="popover"]').each(function () {
    // Initialize the popover using Bootstrap 5's native API (not jQuery)
    new bootstrap.Popover(this, {
      html: true, // Allow HTML content in the popover
      trigger: 'click', // Trigger the popover on click
      placement: 'left' // Set popover placement to the left
    });
  });

  $('.navbar-nav .nav-link').click(function() {
    // Check if the screen width is less than or equal to 768px (mobile view)
    if ($(window).width() <= 768) {
      // Set a timeout to close the menu after 2 seconds
      
      setTimeout(function() {
        $('#navbarNav').collapse('hide');  // Close the navbar menu
      }, timer); // 2000 milliseconds = 2 seconds
    }
  });

  // hide menu if we touck inside the menu
    // add element on the menu only if we are in the mobile mode and in the about page
    function isElementInViewport(el) {
      var rect = el[0].getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
      );
    }

    // Function to add an element if in mobile mode and the About section is in the viewport
    function addElementIfMobileAndInAbout() {
      // Check if the screen width is less than or equal to 768px (mobile mode) and the #about div is in the viewport
      if ($(window).width() <= 768 && $('#about').length > 0 && isElementInViewport($('#about'))) {
        // Only add the new element if it's not already added
        if ($('#navbarNav #extra-item-dwnld-cv').length === 0) {
          var newItem = $('<li class="nav-item" id="extra-item-dwnld-cv"><a class="nav-link" href="#about">Download CV</a></li>');
          // $('#navbar-items').append('<li class="nav-item" id="extra-item-dwnld-cv"><a class="nav-link" href="#about">Download CV</a></li>');
          $('#navbar-items').append(newItem); 
          newItem.hide().fadeIn(1000);
          document.getElementById('extra-item-dwnld-cv').addEventListener('click', downloadCV);
        }
      } else {
        $('#navbarNav #extra-item-dwnld-cv').fadeOut(1500, function() {
          // After fading out, remove the element from the DOM
          $(this).remove();  // This refers to the element that just faded out
        });
      }
    }

    // Check when the document is ready
    addElementIfMobileAndInAbout();

    // Check on window resize to ensure the element is added/removed when resizing
    $(window).resize(function() {
      addElementIfMobileAndInAbout();
    });
    // Check on scroll
    $(window).scroll(function() {
      addElementIfMobileAndInAbout();
    });
  /*----------------------------
   Parallax maybe not nececcesry
  ------------------------------ */
  // Add event listener on nav links
  
  // var well_lax = $('.wellcome-area');
  // well_lax.parallax("50%", 0.4);
  // var well_text = $('.wellcome-text');
  // well_text.parallax("50%", 0.6);

  /*--------------------------
   collapse
  ---------------------------- */
  // var panel_test = $('.panel-heading a');
  // panel_test.on('click'ta-bs-toggle="popover"]').each(function () {
  //   new bootstrap.Popover(this);
  // }); , function() {
  //   panel_test.removeClass('active');
  //   $(this).addClass('active');
  // });

  /*---------------------
   Testimonial carousel
  ---------------------*/
  // var test_carousel = $('.testimonial-carousel');
  // test_carousel.owlCarousel({
  //   loop: true,
  //   nav: false,
  //   dots: true,
  //   autoplay: true,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     768: {
  //       items: 1
  //     },
  //     1000: {
  //       items: 1
  //     }
  //   }
  // });
  /*----------------------------
   isotope active
  ------------------------------ */
  // portfolio start
  // $(window).on("load", function() {
  //   var $container = $('.awesome-project-content');
  //   $container.isotope({
  //     filter: '*',
  //     animationOptions: {
  //       duration: 750,
  //       easing: 'linear',
  //       queue: false
  //     }
  //   });
  //   var pro_menu = $('.project-menu li a');
  //   pro_menu.on("click", function() {
  //     var pro_menu_active = $('.project-menu li a.active');
  //     pro_menu_active.removeClass('active');
  //     $(this).addClass('active');
  //     var selector = $(this).attr('data-filter');
  //     $container.isotope({
  //       filter: selector,
  //       animationOptions: {
  //         duration: 750,
  //         easing: 'linear',
  //         queue: false
  //       }
  //     });
  //     return false;
  //   });

  // });
  //portfolio end

  /*---------------------
   Circular Bars - Knob
  --------------------- */
  if (typeof($.fn.knob) != 'undefined') {
    var knob_tex = $('.knob');
    knob_tex.each(function() {
      var $this = $(this),
        knobVal = $this.attr('data-rel');

      $this.knob({
        'draw': function() {
          $(this.i).val(this.cv + '%')
        }
      });

      $this.appear(function() {
        $({
          value: 0
        }).animate({
          value: knobVal
        }, {
          duration: 2000,
          easing: 'swing',
          step: function() {
            $this.val(Math.ceil(this.value)).trigger('change');
          }
        });
      }, {
        accX: 0,
        accY: -150
      });
    });
  }

  // $(document).ready(function () {
    
  //   $("#news-slider").owlCarousel({
  //     items: 3,
  //     itemsDesktop: [1199, 3],
  //     itemsDesktopSmall: [980, 2],
  //     itemsMobile: [600, 1],
  //     navigation: true,
  //     navigationText: ["", ""],
  //     pagination: true,
  //     autoPlay: true
  //   });
  // });

  $(document).ready(function() {

    var owl = $("#news-slider");

    owl.owlCarousel({
        stagePadding:1,
        startPosition:7,
        loop:false,
        margin:10,
        nav:true,
        navText: [
          "<div class='nav-btn prev-slide'></div>",
          "<div class='nav-btn next-slide'></div>"],
        autoplay:false,
        dots:true,
        items: 3, //10 items above 1000px browser width
        responsiveClass:true,
        responsive:{
          0:{
            items:1,
            dots:false
          },
          600:{
            items:2,
            dots:false
          },
          1000:{
              items:3
          }
        }
      })

    });

    // to debug
  //   owl.on('mousewheel', '.owl-stage', function (e) {
  //     if (e.deltaY>0) {
  //         owl.trigger('next.owl');
  //     } else {
  //         owl.trigger('prev.owl');
  //     }
  //     e.preventDefault();
  // });

  function downloadCV (event) {
    const pdfUrl = 'assets/pdf/resume_Capuzzo_2024.pdf'; // Replace with your PDF file URL
    
    // Fetch the PDF file
    fetch(pdfUrl)
        .then(response => response.blob()) // Convert the response to a Blob
        .then(blob => {
            // Create a link element
            const link = document.createElement('a');
            
            // Create a URL for the Blob and set it as the href attribute
            link.href = URL.createObjectURL(blob);
            
            // Set the download attribute with the desired filename
            link.download = 'resume_Capuzzo_2024.pdf'; // You can change the filename here
            
            // Programmatically click the link to trigger the download
            link.click();
        })
        .catch(error => {
            console.error('Error downloading the PDF:', error);
        });
  }

})(jQuery);


// const scrollContainer = document.querySelector("cv_area");

// scrollContainer.addEventListener("wheel", (evt) => {
//     evt.preventDefault();
//     scrollContainer.scrollLeft += evt.deltaY;
// });


function createPostCard(imageUrl, Role, Company, tag, descriptionText, Data, Loc) {
  // Create the post card container (table)
  var postSlide = document.createElement('div');
  postSlide.classList.add('post-slide');

  var postImg = document.createElement('div');
  postImg.classList.add('post-img');
  var img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Post Image';
  postImg.appendChild(img);

  var postContent = document.createElement('div');
  postContent.classList.add('post-content');
  
  // Create the table to hold the post content
  var postTable = document.createElement('table');
  postTable.classList.add('post-table');
  var tableBody = document.createElement('tbody');

  // Create the table row for Role and Company titles
  var titleRow = document.createElement('tr');
  var roleCell = document.createElement('td');
  titleRow.classList.add('post-role-cell');
  roleCell.classList.add('post-role-cell');
  roleCell.setAttribute("colspan", 2);
  var roleDiv = document.createElement('div');
  roleDiv.classList.add('table-card-div');
  var roleTitle = document.createElement('h3');
  roleTitle.textContent = Role;
  roleDiv.appendChild(roleTitle);
  roleCell.appendChild(roleDiv);
  
  var titleRow2 = document.createElement('tr')
  var companyCell = document.createElement('td');
  companyCell.classList.add('post-company-cell');
  titleRow2.classList.add('post-company-cell');
  // companyCell.classList.add('.post-content');
  companyCell.setAttribute("colspan", 2);
  var companyDiv = document.createElement('div');
  companyDiv.classList.add('table-card-div');
  var companyTitle = document.createElement('h4');
  companyTitle.textContent = Company;
  companyDiv.appendChild(companyTitle);
  companyCell.appendChild(companyDiv);

  titleRow.appendChild(roleCell);
  titleRow2.appendChild(companyCell);
  tableBody.appendChild(titleRow);
  tableBody.appendChild(titleRow2);

  // Create the table row for the description
  var descriptionRow = document.createElement('tr');
  var descriptionCell = document.createElement('td');
  descriptionCell.classList.add('post-description-cell');
  descriptionRow.classList.add('post-description-cell');
  descriptionCell.setAttribute("colspan", 2);
  var descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('table-card-div');
  var postDescription = document.createElement('p');
  postDescription.classList.add('post-description');
  postDescription.textContent = descriptionText;
  descriptionDiv.appendChild(postDescription);
  descriptionCell.appendChild(descriptionDiv);
  descriptionRow.appendChild(descriptionCell);
  tableBody.appendChild(descriptionRow);

  // Create the table row for Date and Location
  var dateLocRow = document.createElement('tr');
  var dateCell = document.createElement('td');
  dateCell.classList.add('post-date-cell');
  dateLocRow.classList.add('post-date-cell');
  var dateIcon = document.createElement('i');
  dateIcon.classList.add('fa', 'fa-clock-o');
  dateCell.appendChild(dateIcon);
  dateCell.appendChild(document.createTextNode(Data));
  
  var locCell = document.createElement('td');
  locCell.classList.add('post-loc-cell');
  var locIcon = document.createElement('i');
  locIcon.classList.add('fa', 'fa-location-dot');
  locCell.appendChild(locIcon);
  locCell.appendChild(document.createTextNode(Loc));

  dateLocRow.appendChild(dateCell);
  // dateLocRow.appendChild(locCell);
  tableBody.appendChild(dateLocRow);

  // Create the table row for the "read more" link
  var readMoreRow = document.createElement('tr');
  var emptyCell = document.createElement('td');
  emptyCell.classList.add('read-more-cell');
  var readMoreCell = document.createElement('td');
  readMoreCell.classList.add('read-more-cell');
  readMoreRow.classList.add('read-more-cell');
  var readMore = document.createElement('button');

  readMore.classList.add('read-more');
  readMore.textContent = 'Read more';
  // readMore.classList.add('btn', 'btn-info', 'btn-lg', 'post-slide', 'read-more');
  readMore.setAttribute('data-bs-toggle', 'modal');  // Enable modal functionality
  readMore.setAttribute('data-bs-target', '#'+ tag);

  readMoreCell.appendChild(readMore);
  readMoreRow.appendChild(locCell);
  readMoreRow.appendChild(readMoreCell);
  tableBody.appendChild(readMoreRow);

  // Append the table body to the table
  postTable.appendChild(tableBody);
  postContent.appendChild(postTable);
  
  // Append the table to the postSlide
  postSlide.appendChild(postImg);
  postSlide.appendChild(postContent);

  // Append the postSlide to the main container
  document.getElementById('news-slider').appendChild(postSlide);
}
  

function createModal(imageUrl, Role, Company, tag, descriptionText, Listdescrip, Data, Loc) {
  // Create the outer modal container (div with modal class)
  var modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = tag;
  modal.setAttribute('tabIndex', -1);
  modal.setAttribute('aria-labelledby', 'myModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  // Create the modal dialog container
  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-scrollable', 
    'modal-dialog-centered', 'modal-lg');
  
  // Create the modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  
  // Create the modal header
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');
  
  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.id = 'myModalLabel';
  modalTitle.innerText = Role;
  
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('btn-close');
  closeButton.setAttribute('data-bs-dismiss', 'modal');
  closeButton.setAttribute('aria-label', 'Close');

  // Create the modal body
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  // modalBody.innerText = descriptionText;
  
  const row = document.createElement('div');
  row.classList.add('row');

  const comapnycol = document.createElement('div');
  comapnycol.classList.add("col-md-8","col-sm-8","col-xs-12");

  const modalCompany = document.createElement('h6');
  // modalCompany.classList.add('modal-title');
  modalCompany.innerText = Company;
  comapnycol.appendChild(modalCompany);
  
  var dateCell = document.createElement('div');
  dateCell.classList.add("col-md-2","col-sm-2","col-xs-12");
  var dateIcon = document.createElement('i');
  dateIcon.classList.add('fa', 'fa-clock-o');
  dateCell.appendChild(dateIcon);
  dateCell.appendChild(document.createTextNode(Data));
  
  var locCell = document.createElement('div');
  locCell.classList.add("col-md-2","col-sm-2","col-xs-12");
  var locIcon = document.createElement('i');
  locIcon.classList.add('fa', 'fa-location-dot');
  locCell.appendChild(locIcon);
  locCell.appendChild(document.createTextNode(Loc));
  
  row.appendChild(comapnycol);
  row.appendChild(dateCell);
  row.appendChild(locCell);

  var modalImg = document.createElement('div');
  modalImg.classList.add('modal-img');
  var img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Modal Image';
  modalImg.appendChild(img);

  var modalDescription = document.createElement('div');
  modalDescription.classList.add('modal-description');
  var modalFirstRow = document.createElement('div');
  modalFirstRow.innerText = descriptionText;
  modalFirstRow.classList.add('modal-first-row');
  modalDescription.appendChild(modalFirstRow);

  var modalList = document.createElement('div');
  const ulElement = document.createElement('ul');
  ulElement.classList.add('modal-list'); 
  // Loop through the array and create a list item (li) for each one
  Listdescrip.forEach(item => {
      const liElement = document.createElement('li');
      liElement.textContent = item;
      ulElement.appendChild(liElement);
  });

  modalList.appendChild(ulElement);
  // modalList.classList.add('modal-list');  
  modalDescription.appendChild(modalList);
  
  // Assemble the modal structure
  modalBody.appendChild(row);
  // modalBody.appendChild(modalCompany);
  modalBody.appendChild(modalImg);
  modalBody.appendChild(modalDescription);

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  
  modalDialog.appendChild(modalContent);
  
  modal.appendChild(modalDialog);
  
  // Append modal to a specific part of the page
  document.getElementById('about').appendChild(modal);
}

document.getElementById('downloadCV').addEventListener('click', downloadCV);

function createList(Title,ListTitle,ListContent,dir, id)
{
  // Create the <li> element
var li = document.createElement('li');

// Create the <button> element
var button = document.createElement('button');
button.type = 'button';
button.classList.add('empty-button');
button.setAttribute('data-bs-toggle', 'popover');
button.setAttribute('data-bs-trigger', 'hover');
button.setAttribute('data-bs-placement', dir);
button.setAttribute('title', Title);
button.setAttribute('data-bs-original-title', Title);
var s = "<div class ='inpop'><b>" + ListTitle + "</b><ul>";
ListContent.forEach(item => {
  s += "<li>" + item + "</li>";
});
s += "</ul></div>";

button.setAttribute('data-bs-content', s);

// Create the <h4> element and set its text
var h4 = document.createElement('h4');
h4.textContent = Title;

// Append the <h4> element to the button
button.appendChild(h4);

// Append the <button> to the <li>
li.appendChild(button);

// Append the <li> to a parent container (e.g., a <ul> with id 'myList')
document.getElementById(id).appendChild(li);
// var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
// var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
//   return new bootstrap.Popover(popoverTriggerEl)
// })
// var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
// var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
//   return new bootstrap.Popover(popoverTriggerEl, {
//     html: true, // Allow HTML content
//     trigger: 'hover', // Trigger popover on focus
//     content: function() {
//       var content = $(popoverTriggerEl).attr("data-bs-content");
//       return $(content).children(".popover-body").html(); // Extract content from the targeted element
//     }
//   });
// });
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    
    // Initialize popovers for each element
    popoverTriggerList.forEach(function (popoverTriggerEl) {
      new bootstrap.Popover(popoverTriggerEl, {
        html: true
      });
    });
}
