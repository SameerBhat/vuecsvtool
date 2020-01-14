(function() {
  
    "use strict";
  

    function clickInsideElement( e, className ) {
      var el = e.srcElement || e.target;
      
      if ( el.classList.contains(className) ) {
        return el;
      } else {
        while ( el = el.parentNode ) {
          if ( el.classList && el.classList.contains(className) ) {
            return el;
          }
        }
      }
  
      return false;
    }
  
   
    function getPosition(e) {
      var posx = 0;
      var posy = 0;
  
      if (!e) var e = window.event;
      
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
  
      return {
        x: posx,
        y: posy
      }
    }
  

    var contextMenuClassName = "context-menu";
    var contextMenuItemClassName = "context-menu__item";


    var contextMenuLinkClassName = "context-menu__link";
    var contextMenuActive = "context-menu--active";
  
    var taskItemParagraphClassName = "col3";
    var taskItemSpeakerClassName = "col2";
    var taskItemParagaphInContext;
    var taskItemSpeakerInContext;
  
    var clickCoords;
    var clickCoordsX;
    var clickCoordsY;
  
    var menu = document.querySelector("#context-menu");

    
    var menuItems = menu.querySelectorAll(".context-menu__item");
    var menuState = 0;
    var menuWidth;
    var menuHeight;
    var menuPosition;
    var menuPositionX;
    var menuPositionY;
  
    var windowWidth;
    var windowHeight;
  
    /**
     * Initialise our application's code.
     */
    function init() {
      contextListener();
      clickListener();
      keyupListener();
      resizeListener();
    }
  
    /**
     * Listens for contextmenu events.
     */
    function contextListener() {
      document.addEventListener( "contextmenu", function(e) {

        taskItemParagaphInContext = clickInsideElement( e, taskItemParagraphClassName );
        taskItemSpeakerInContext = clickInsideElement( e, taskItemSpeakerClassName );

       
        if ( taskItemParagaphInContext ) {
          e.preventDefault();
          toggleMenuOn();
          positionMenu(e);
          document.getElementById('speakerColSelected').value = false;
        }else if(taskItemSpeakerInContext){
          e.preventDefault();
          toggleMenuOn();
          positionMenu(e);
          document.getElementById('speakerColSelected').value = true;

        } else {
          taskItemParagaphInContext = null;
          taskItemSpeakerInContext = null;
          toggleMenuOff();
        }


      






      });
    }
  
    /**
     * Listens for click events.
     */
    function clickListener() {
      document.addEventListener( "click", function(e) {
        var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );
  
        if ( clickeElIsLink ) {
          e.preventDefault();
          menuItemListener( clickeElIsLink );
        } else {
          var button = e.which || e.button;
          if ( button === 1 ) {
            toggleMenuOff();
          }
        }
      });
    }
  
    /**
     * Listens for keyup events.
     */
    function keyupListener() {
      window.onkeyup = function(e) {
        if ( e.keyCode === 27 ) {
          toggleMenuOff();
        }
      }
    }
  
   
    function resizeListener() {
      window.onresize = function(e) {
        toggleMenuOff();
      };
    }
  
  
    function toggleMenuOn() {
      if ( menuState !== 1 ) {
        menuState = 1;
        menu.classList.add( contextMenuActive );
      }
    }
  
   
    function toggleMenuOff() {
      if ( menuState !== 0 ) {
        menuState = 0;
        menu.classList.remove( contextMenuActive );
      }
    }
  
   
    function positionMenu(e) {
      clickCoords = getPosition(e);
      clickCoordsX = clickCoords.x;
      clickCoordsY = clickCoords.y;


      document.getElementById('selectedRow').value = e.target.getAttribute('data-row');
        //console.log(document.getElementById('selectedRow').value);
      //console.log(e.target.getAttribute('data-row'));
  
      menuWidth = menu.offsetWidth + 4;
      menuHeight = menu.offsetHeight + 4;
  

     
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;

      menu.style.top = clickCoordsY+ "px";
      menu.style.left = clickCoordsX+20+ "px";
  
    //   if ( (windowWidth - clickCoordsX) < menuWidth ) {
    //     menu.style.left = windowWidth - menuWidth + "px";
    //   } else {
    //     menu.style.left = clickCoordsX + "px";
    //   }
  
    //   if ( (windowHeight - clickCoordsY) < menuHeight ) {
    //     menu.style.top = windowHeight - menuHeight + "px";
    //   } else {
    //     menu.style.top = clickCoordsY + "px";
    //   }
    }
  
   
    function menuItemListener( link ) {
      //console.log( "Task ID - " + taskItemParagaphInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
      toggleMenuOff();
    }
  
    
    init();
  
  })();