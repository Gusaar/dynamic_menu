###
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
###

jQuery.fn.dynamicMenu = () ->
  ###
    Variables
  ###
  args = arguments[0] || {}
  position = if args.position isnt undefined then args.position else "top"
  speed = if args.speed isnt undefined then args.speed else 300
  event = if args.event isnt undefined then args.event else "click"
  animate_to = if position is "top" or position is "bottom" then "height" else "width"
  tab_fix = if position is "bottom" then "-2px" else "-1px"
  type = if args.type isnt undefined then args.type else "simple"

  ###
    Initializing Elements
  ###
  this.addClass("dynamic_menu")
  this.children('ul').addClass("dynamic_tabs")
  if this.children('div').length > 0
    this.children('div').addClass("dynamic_container")
  else
    div = document.createElement("div")
    div.className = "dynamic_container"
    this.append(div)

  ul = this.find('ul')
  this.remove('.dynamic_tabs')
  if position is "bottom"
    this.prepend(ul)
  else
    this.append(ul)

  dynamic_tabs = this.children('.dynamic_tabs')
  dynamic_container = this.children('.dynamic_container')
  dynamic_tabs_li = dynamic_tabs.find('li')

  dynamic_tabs_li.each (index, element) ->
    $(element).attr("data-tab-id", index)
    $(element).addClass("dynamic_li")
    $(element).addClass("tab_#{index}")
    if type isnt "iframe"
      if dynamic_container.children(".container_#{index}").length is 0
        div = document.createElement("div")
        div.className = "container_#{index}"
        dynamic_container.append(div)
      dynamic_container.children(".container_#{index}").addClass("dynamic_subcontainers")
  if type is "iframe"
    iframe = document.createElement("iframe")
    iframe.className = "dynamic_iframe"
    dynamic_container.html(iframe)
    dynamic_container.css("text-align", "center")

  dynamic_subcontainers = dynamic_container.children(".dynamic_subcontainers")

  ###
    Applying styles
  ###
  this.css(position, "-1px")
  if position is "left" or position is "right"
    dynamic_container.css("float", position)
    dynamic_tabs.css("float", position)
  dynamic_tabs_li.css(position, "-1px")
  dynamic_tabs_li.addClass(position)

  ###
    Handling Tabs events
  ###
  call_display = (index) ->
    switch type
      when "iframe"    then iframe_display(index)
      when "ajax"      then ajax_display(index)
      when "ajax-once" then ajax_once_display(index)
      else simple_display(index)

  url = params = ajax_call = ""

  load_params = (index) ->
    url = dynamic_tabs.children(".tab_#{index}").attr("data-url")
    params = dynamic_tabs.children(".tab_#{index}").attr("data-params")
    ajax_call = if args.ajax_call isnt undefined then args.ajax_call else "get"

  call_ajax = (index, url, params) ->
    params = if params isnt undefined then "&#{params}" else ""
    $.ajax({
      url: url,
      data: "tab=#{index}#{params}",
      type: ajax_call,
      dataType: "script"
    });

  simple_display = (index) ->
    dynamic_subcontainers.hide()
    dynamic_container.children(".container_#{index}").show()

  iframe_display = (index) ->
    load_params(index)
    dynamic_container.children("iframe")
    iframe.src = url

  ajax_display = (index) ->
    load_params(index)
    call_ajax(index, url, params)
    simple_display(index)

  ajax_once_display = (index) ->
    if dynamic_container.children(".container_#{index}").html().length > 0
      simple_display(index)
    else
      ajax_display(index)

  change_tab = () ->
    $this = $(this)
    dynamic_tabs_li.removeClass("#{position}_selected")
    $this.addClass("#{position}_selected")
    dynamic_tabs_li.css(position, "-1px")
    $this.css(position, tab_fix)
    dynamic_tabs_li.unbind(event, pullup)
    $this.bind(event, pullup)
    dynamic_tabs_li.bind(event, change_tab)
    $this.unbind(event, change_tab)
    call_display($this.attr("data-tab-id"))

  pullup = () ->
    $this = $(this)
    if animate_to is "height"
      animation = { height: "hide" }
    else
      animation = { width: "hide" }
    dynamic_tabs_li.unbind(event, pullup)
    dynamic_tabs_li.unbind(event, change_tab)
    dynamic_container.animate(animation, speed, () ->
      dynamic_tabs_li.removeClass("#{position}_selected")
      $this.css(position, "-1px")
      dynamic_tabs_li.bind(event, dropdown)
    )

  dropdown = () ->
    $this = $(this)
    $this.addClass("#{position}_selected")
    $this.css(position, tab_fix)
    if animate_to is "height"
      animation = { height: "show" }
    else
      animation = { width: "show" }
    dynamic_tabs_li.unbind(event, dropdown)
    call_display($this.attr("data-tab-id"))
    dynamic_container.animate(animation, speed, () ->
      $this.bind(event, pullup)
      dynamic_tabs_li.bind(event, change_tab)
      $this.unbind(event, change_tab)
    )

  ###
    Setting states
  ###
  dynamic_subcontainers.hide()
  dynamic_tabs_li.bind(event, dropdown)

