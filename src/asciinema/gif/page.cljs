(ns asciinema.gif.page
  (:require [asciinema.player.view :as view]
            [reagent.core :as reagent]))

(enable-console-print!)

(defn- component [width height theme screen]
  (let [player-class-name (view/player-class-name theme)
        width (atom width)
        height (atom height)
        font-size (atom "small")
        cursor-on (atom true)]
    [:div.asciinema-player-wrapper
     [:div.asciinema-player {:class-name player-class-name}
      [view/terminal width height font-size screen cursor-on]]]))

(defn ^:export InitTerminal [dom-node options]
  (let [dom-node (if (string? dom-node) (.getElementById js/document dom-node) dom-node)
        {:keys [width height theme]} (js->clj options :keywordize-keys true)]
    (let [screen (reagent/atom {})]
      (reagent/render-component [component width height theme screen] dom-node)
      (reagent/flush)
      (clj->js (fn [new-screen]
                 (reset! screen (js->clj new-screen :keywordize-keys true))
                 (reagent/flush))))))
