(defproject a2png "0.1.0-SNAPSHOT"
  :description "asciinema PNG generator"
  :url "http://example.com/FIXME"
  :license {:name "MIT"}

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.494"]
                 [org.clojure/core.async "0.3.442"]
                 [prismatic/schema "1.1.5"]
                 [org.clojure/core.match "0.3.0-alpha4"]
                 [reagent "0.6.0"]]

  :plugins [[lein-cljsbuild "1.1.5"]]

  :source-paths ["src" "asciinema-player/src"]
  :resource-paths ["resources" "asciinema-player/resources"]

  :cljsbuild {:builds {:main {:source-paths ["src"]
                              :compiler {:output-to "main.js"
                                         :foreign-libs [{:file "public/codepoint-polyfill.js"
                                                         :provides ["asciinema.player.codepoint-polyfill"]}]
                                         :optimizations :simple
                                         :elide-asserts true
                                         :target :nodejs
                                         :main "asciinema.png.main"}}
                       :page {:source-paths ["src"]
                              :compiler {:output-to "page/page.js"
                                         :foreign-libs [{:file "public/codepoint-polyfill.js"
                                                         :provides ["asciinema.player.codepoint-polyfill"]}]
                                         :optimizations :simple
                                         :elide-asserts true
                                         :main "asciinema.png.page"}}}})
