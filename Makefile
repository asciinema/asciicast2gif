all: main.js page/page.js

main.js: src/asciinema/gif/main.cljs src/asciinema/gif/helpers.cljs src/asciinema/gif/macros.clj project.clj
	lein cljsbuild once main

page/page.js: src/asciinema/gif/page.cljs project.clj
	lein cljsbuild once page
