(ns asciinema.gif.helpers)

(defn wrap-catch-err [f]
  (fn [x]
    (try
      (f x)
      (catch js/Error e
        e))))

(defn throw-err [x]
  (if (instance? js/Error x)
    (throw x)
    x))

(defn safe-map [f]
  (map (wrap-catch-err f)))
