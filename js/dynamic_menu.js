(function() {
  /*
    Dynamic Menu 1.0
    Autor: Gusaar
    Type: CoffeeScript
    Designed for: Ruby on Rails
    Requirements: JQuery(Created with version 1.6.4)
    Specifications:
      Call:
        selector.dynamicMenu(params)
      Params Available:
        Position: Specify where do you want to place the menu. (Default: TOP)
          position: "top"|"right"|"bottom"|"left"
        Speed: Specify the speed of the animation.
          speed: anyone available for jquery animate (Ex. "slow" or 300) (Default: 300)
        Type: Specify the behavior of selecting tabs. To specify URL's set in list elements a data-url attribute (Ex. data-url="http://www.google.com") and for params in data-params (Ex. data-params="firstname=Joan&lastname=Arc") (Default: SIMPLE)
          type: simple|iframe|ajax|ajax-once
          Simple    - Just showing the right div element.
          Iframe    - Renders an URL into a iframe.
          Ajax      - Send a GET call through AJAX and lets the server do the rendering.
          Ajax-Once - Renders the AJAX just once per tab and then do only JQuery changing (Combination of Ajax and Simple).
        Event: TODO
        Ajax-Call: Specify type of Ajax call. (Default: GET)
          ajax_call: "get"|"post"
    Notes: If you create a div container with the class container_# were # is the position number, it won't be created or replaced.
  */  jQuery.fn.dynamicMenu = function() {
    /*
        Variables
      */
    var ajax_call, ajax_display, ajax_once_display, animate_to, args, call_ajax, call_display, change_tab, div, dropdown, dynamic_container, dynamic_subcontainers, dynamic_tabs, dynamic_tabs_li, event, iframe, iframe_display, load_params, params, position, pullup, simple_display, speed, tab_fix, type, ul, url;
    args = arguments[0] || {};
    position = args.position !== void 0 ? args.position : "top";
    speed = args.speed !== void 0 ? args.speed : 300;
    event = args.event !== void 0 ? args.event : "click";
    animate_to = position === "top" || position === "bottom" ? "height" : "width";
    tab_fix = position === "bottom" ? "-2px" : "-1px";
    type = args.type !== void 0 ? args.type : "simple";
    /*
        Initializing Elements
      */
    this.addClass("dynamic_menu");
    this.children('ul').addClass("dynamic_tabs");
    if (this.children('div').length > 0) {
      this.children('div').addClass("dynamic_container");
    } else {
      div = document.createElement("div");
      div.className = "dynamic_container";
      this.append(div);
    }
    ul = this.find('ul');
    this.remove('.dynamic_tabs');
    if (position === "bottom") {
      this.prepend(ul);
    } else {
      this.append(ul);
    }
    dynamic_tabs = this.children('.dynamic_tabs');
    dynamic_container = this.children('.dynamic_container');
    dynamic_tabs_li = dynamic_tabs.find('li');
    dynamic_tabs_li.each(function(index, element) {
      $(element).attr("data-tab-id", index);
      $(element).addClass("dynamic_li");
      $(element).addClass("tab_" + index);
      if (type !== "iframe") {
        if (dynamic_container.children(".container_" + index).length === 0) {
          div = document.createElement("div");
          div.className = "container_" + index;
          dynamic_container.append(div);
        }
        return dynamic_container.children(".container_" + index).addClass("dynamic_subcontainers");
      }
    });
    if (type === "iframe") {
      iframe = document.createElement("iframe");
      iframe.className = "dynamic_iframe";
      dynamic_container.html(iframe);
      dynamic_container.css("text-align", "center");
    }
    dynamic_subcontainers = dynamic_container.children(".dynamic_subcontainers");
    /*
        Applying styles
      */
    this.css(position, "-1px");
    if (position === "left" || position === "right") {
      dynamic_container.css("float", position);
      dynamic_tabs.css("float", position);
    }
    dynamic_tabs_li.css(position, "-1px");
    dynamic_tabs_li.addClass(position);
    /*
        Handling Tabs events
      */
    call_display = function(index) {
      switch (type) {
        case "iframe":
          return iframe_display(index);
        case "ajax":
          return ajax_display(index);
        case "ajax-once":
          return ajax_once_display(index);
        default:
          return simple_display(index);
      }
    };
    url = params = ajax_call = "";
    load_params = function(index) {
      url = dynamic_tabs.children(".tab_" + index).attr("data-url");
      params = dynamic_tabs.children(".tab_" + index).attr("data-params");
      return ajax_call = args.ajax_call !== void 0 ? args.ajax_call : "get";
    };
    call_ajax = function(index, url, params) {
      params = params !== void 0 ? "&" + params : "";
      return $.ajax({
        url: url,
        data: "tab=" + index + params,
        type: ajax_call,
        dataType: "script"
      });
    };
    simple_display = function(index) {
      dynamic_subcontainers.hide();
      return dynamic_container.children(".container_" + index).show();
    };
    iframe_display = function(index) {
      load_params(index);
      dynamic_container.children("iframe");
      return iframe.src = url;
    };
    ajax_display = function(index) {
      load_params(index);
      call_ajax(index, url, params);
      return simple_display(index);
    };
    ajax_once_display = function(index) {
      if (dynamic_container.children(".container_" + index).html().length > 0) {
        return simple_display(index);
      } else {
        return ajax_display(index);
      }
    };
    change_tab = function() {
      var $this;
      $this = $(this);
      dynamic_tabs_li.removeClass("" + position + "_selected");
      $this.addClass("" + position + "_selected");
      dynamic_tabs_li.css(position, "-1px");
      $this.css(position, tab_fix);
      dynamic_tabs_li.unbind(event, pullup);
      $this.bind(event, pullup);
      dynamic_tabs_li.bind(event, change_tab);
      $this.unbind(event, change_tab);
      return call_display($this.attr("data-tab-id"));
    };
    pullup = function() {
      var $this, animation;
      $this = $(this);
      if (animate_to === "height") {
        animation = {
          height: "hide"
        };
      } else {
        animation = {
          width: "hide"
        };
      }
      dynamic_tabs_li.unbind(event, pullup);
      dynamic_tabs_li.unbind(event, change_tab);
      return dynamic_container.animate(animation, speed, function() {
        dynamic_tabs_li.removeClass("" + position + "_selected");
        $this.css(position, "-1px");
        return dynamic_tabs_li.bind(event, dropdown);
      });
    };
    dropdown = function() {
      var $this, animation;
      $this = $(this);
      $this.addClass("" + position + "_selected");
      $this.css(position, tab_fix);
      if (animate_to === "height") {
        animation = {
          height: "show"
        };
      } else {
        animation = {
          width: "show"
        };
      }
      dynamic_tabs_li.unbind(event, dropdown);
      call_display($this.attr("data-tab-id"));
      return dynamic_container.animate(animation, speed, function() {
        $this.bind(event, pullup);
        dynamic_tabs_li.bind(event, change_tab);
        return $this.unbind(event, change_tab);
      });
    };
    /*
        Setting states
      */
    dynamic_subcontainers.hide();
    return dynamic_tabs_li.bind(event, dropdown);
  };
}).call(this);

