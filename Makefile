all: main.js page/page.js

main.js: project.clj src/asciinema/gif/*.cljs src/asciinema/gif/*.clj
	lein cljsbuild once main

page/page.js: project.clj src/asciinema/gif/*.cljs src/asciinema/gif/*.clj
	lein cljsbuild once page

publish: all
	npm publish

.PHONY: all publish
