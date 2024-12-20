(function($) {
  "use strict";

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
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 55
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

  /*----------------------------
   Parallax maybe not nececcesry
  ------------------------------ */
  // var well_lax = $('.wellcome-area');
  // well_lax.parallax("50%", 0.4);
  // var well_text = $('.wellcome-text');
  // well_text.parallax("50%", 0.6);

  /*--------------------------
   collapse
  ---------------------------- */
  // var panel_test = $('.panel-heading a');
  // panel_test.on('click', function() {
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

  console.log("oh");

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
        startPosition:6,
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
    owl.on('mousewheel', '.owl-stage', function (e) {
      if (e.deltaY>0) {
          owl.trigger('next.owl');
      } else {
          owl.trigger('prev.owl');
      }
      e.preventDefault();
  });

})(jQuery);


// const scrollContainer = document.querySelector("cv_area");

// scrollContainer.addEventListener("wheel", (evt) => {
//     evt.preventDefault();
//     scrollContainer.scrollLeft += evt.deltaY;
// });



function createPostCard(imageUrl, Role, Company, descriptionText, Data, Loc) {
  // Create the post card container
  var postSlide = document.createElement('div');
  postSlide.classList.add('post-slide');
  
  // Create the image section
  var postImg = document.createElement('div');
  postImg.classList.add('post-img');
  var img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Post Image';
  postImg.appendChild(img);

  // Create overlay link
  // var overLayer = document.createElement('a');
  // // overLayer.href = '';
  // overLayer.classList.add('over-layer');
  // var overIcon = document.createElement('i');
  // overIcon.classList.add('fa', 'fa-link');
  // overLayer.appendChild(overIcon);
  // postImg.appendChild(overLayer);

  // Create the content section
  var postContent = document.createElement('div');
  postContent.classList.add('post-content');

  // Create post title
  var postTitle = document.createElement('h3');
  postTitle.classList.add('post-title');
  var postLink = document.createElement('a');
  // postLink.href = '';
  postLink.textContent = Role;
  postTitle.appendChild(postLink);

  var secondPostTitle = document.createElement('h4');  // Use h4 for the second title
  secondPostTitle.classList.add('second-post-title');
  var secondPostLink = document.createElement('a');
  // secondPostLink.href = '';
  secondPostLink.textContent = Company;
  secondPostTitle.appendChild(secondPostLink);

  // Create post description
  var postDescription = document.createElement('p');
  postDescription.classList.add('post-description');
  postDescription.textContent = descriptionText;

  // Create post date
  var postDate = document.createElement('span');
  postDate.classList.add('post-date');
  var dateIcon = document.createElement('i');
  dateIcon.classList.add('fa', 'fa-clock-o');
  postDate.appendChild(dateIcon);
  postDate.appendChild(document.createTextNode(Data));

  var postLoc = document.createElement('span');
  postLoc.classList.add('post-loc');
  var dateLoc = document.createElement('i');
  dateLoc.classList.add('fa', 'fa-location-dot');
  postLoc.appendChild(dateLoc);
  postLoc.appendChild(document.createTextNode(Loc));

  // Create read more link
  var readMore = document.createElement('a');
  // readMore.href = '';
  readMore.classList.add('read-more');
  readMore.textContent = 'read more';

  // Append all sections to postContent
  postContent.appendChild(postTitle);
  postContent.appendChild(secondPostTitle); 
  postContent.appendChild(postDescription);
  postContent.appendChild(postDate);
  postContent.appendChild(postLoc);
  postContent.appendChild(readMore);

  // Append the image and content to the postSlide
  postSlide.appendChild(postImg);
  postSlide.appendChild(postContent);

  // Append the postSlide to the main container
  document.getElementById('news-slider').appendChild(postSlide);
}

  
