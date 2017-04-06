(ns asciinema.png.page
  (:require [asciinema.player.view :as view]
            [reagent.core :as reagent]))

(enable-console-print!)

(defn- component [{:keys [theme width height font-size poster]}]
  (let [player-class-name (view/player-class-name theme)
        width (atom width)
        height (atom height)
        font-size (atom "small")
        screen (atom poster)
        cursor-on (atom true)]
    [:div.asciinema-player-wrapper
     [:div.asciinema-player {:class-name player-class-name}
      [view/terminal width height font-size screen cursor-on]
      [view/start-overlay nil]]]))

(defn ^:export RenderTerminal [dom-node options]
  (let [dom-node (if (string? dom-node) (.getElementById js/document dom-node) dom-node)
        options (js->clj options :keywordize-keys true)]
    (reagent/render-component [component options] dom-node)
    (reagent/flush)))
