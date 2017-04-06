(ns asciinema.png.main
  (:require [cljs.nodejs :as nodejs]
            [asciinema.player.source :as source]
            [asciinema.player.frames :as frames]
            [asciinema.player.screen :as screen]
            [cljs.core.async :refer [<! put! chan timeout]]
            [clojure.string :as str])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(nodejs/enable-util-print!)

(def fs (nodejs/require "fs"))
(def phantomjs (nodejs/require "phantomjs-prebuilt"))
(def path (nodejs/require "path"))

(def html-path (.resolve path (js* "__dirname") "page" "a2png.html"))
(def js-path (.resolve path (js* "__dirname") "a2png.js"))

(defn- parse-json [json]
  (-> json
      JSON.parse
      (js->clj :keywordize-keys true)))

(defn- to-json [obj]
  (-> obj
      clj->js
      JSON.stringify))

(defn- http-get [url ch]
  (let [proto (-> url (str/split #":") first)
        client (nodejs/require proto)]
    (.get client url (fn [res]
                       (let [status (.-statusCode res)]
                         (if (contains? #{301 302} status)
                           (let [url (-> res .-headers (aget "location"))]
                             (http-get url ch))
                           (let [data (atom "")]
                             (.setEncoding res "utf8")
                             (.on res "data" (fn [chunk]
                                               (swap! data str chunk)))
                             (.on res "end" (fn []
                                              (put! ch @data))))))))))

(defn- read-file [path ch]
  (let [data (.readFileSync fs path "utf8")]
    (put! ch data)))

(defn- load-asciicast [url]
  (let [ch (chan 1 (map (comp source/initialize-asciicast parse-json)))]
    (if (str/starts-with? url "http")
      (http-get url ch)
      (read-file url ch))
    ch))

(defn -main [& args]
  (let [url (first args)
        out-path (nth args 1)
        time (js/parseInt (nth args 2))
        theme (nth args 3 "asciinema")
        scale (nth args 4 1)]
    (println (str "loading " url "..."))
    (go
      (let [{:keys [width height frames]} (<! (load-asciicast url))]
        (println (str "generating screen at " time "..."))
        (let [screen (->> frames (frames/frame-at time) last)
              poster (to-json {:lines (screen/lines screen)
                               :cursor (screen/cursor screen)})
              program (.exec phantomjs js-path html-path poster out-path width height theme scale)]
          (.pipe (.-stdout program) (.-stdout nodejs/process))
          (.pipe (.-stderr program) (.-stderr nodejs/process)))))))

(set! *main-cli-fn* -main)
