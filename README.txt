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

