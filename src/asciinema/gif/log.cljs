(ns asciinema.gif.log
  (:require [cljs.nodejs :as nodejs]
            [clojure.string :as str]))

(defn debug [& args]
  (when (= (.. nodejs/process -env -DEBUG) "1")
    (apply println args)))

(defn info [& args]
  (println (str "\u001b[32m==> \u001b[0m" (str/join " " args))))

(defn error [& args]
  (println (str "\u001b[31m==> \u001b[0m" (str/join " " args))))
