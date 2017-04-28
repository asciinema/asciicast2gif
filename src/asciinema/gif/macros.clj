(ns asciinema.gif.macros)

(defmacro <?
  "Actively throw an exception if something goes wrong when waiting on a channel message."
  [expr]
  `(asciinema.gif.helpers/throw-err (cljs.core.async/<! ~expr)))
