(defproject asciicast2gif "0.1.0-SNAPSHOT"
  :description "asciinema GIF generator"
  :url "http://example.com/FIXME"
  :license {:name "MIT"}

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.671"]
                 [org.clojure/core.async "0.3.442"]
                 [prismatic/schema "1.1.6"]
                 [org.clojure/core.match "0.3.0-alpha4"]
                 [cljsjs/nodejs-externs "1.0.4-1"]
                 [reagent "0.7.0"]]

  :plugins [[lein-cljsbuild "1.1.6"]]

  :source-paths ["src" "asciinema-player/src"]
  :resource-paths ["resources" "asciinema-player/resources"]

  :clean-targets ^{:protect false} ["target" "main.js" "page/page.js"]

  :cljsbuild {:builds {:main {:source-paths ["src"]
                              :compiler {:output-to "main.js"
                                         :foreign-libs [{:file "public/codepoint-polyfill.js"
                                                         :provides ["asciinema.player.codepoint-polyfill"]}]
                                         :optimizations :advanced
                                         :pretty-print false
                                         :elide-asserts true
                                         :target :nodejs
                                         :externs ["externs/child_process.js"]
                                         :main "asciinema.gif.main"}}
                       :page {:source-paths ["src"]
                              :compiler {:output-to "page/page.js"
                                         :foreign-libs [{:file "public/codepoint-polyfill.js"
                                                         :provides ["asciinema.player.codepoint-polyfill"]}]
                                         :optimizations :advanced
                                         :pretty-print false
                                         :elide-asserts true
                                         :main "asciinema.gif.page"}}}})
