BIN := node_modules/.bin
TYPESCRIPT := batcher.ts eventsource.ts filter.ts index.ts json.ts mapper.ts property.ts queue.ts sink.ts splitter.ts timeout.ts transformer.ts vm.ts
JAVASCRIPT := $(TYPESCRIPT:%.ts=%.js)

all: $(JAVASCRIPT)

$(BIN)/mocha $(BIN)/tsc:
	npm install

compile:
	$(BIN)/tsc

%.js: %.ts $(BIN)/tsc
	$(BIN)/tsc

test: $(JAVASCRIPT) $(BIN)/mocha
	$(BIN)/mocha --compilers js:babel-core/register tests/
