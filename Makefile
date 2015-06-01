npm_install:
	npm install

build: npm_install
	mkdir -p dist
	cp human-date.js dist/
	./node_modules/.bin/uglifyjs --compress --mangle -- human-date.js > dist/human-date.min.js

test: npm_install
	./node_modules/.bin/mocha --reporter spec

.PHONY: test
