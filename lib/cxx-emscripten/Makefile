# Copyright 2017 ChaiShushan <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

TARG:=guetzli

GUETZLI_ROOT:=../../third_party/guetzli-1.0.1

INC+=-I../cxx
INC+=-I$(GUETZLI_ROOT)
INC+=-I$(GUETZLI_ROOT)/third_party/butteraugli

CPP_FILES+=../cxx/guetzli_api.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/butteraugli_comparator.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/dct_double.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/debug_print.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/entropy_encode.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/fdct.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/gamma_correct.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/idct.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/jpeg_data.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/jpeg_data_decoder.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/jpeg_data_encoder.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/jpeg_data_reader.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/jpeg_data_writer.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/jpeg_huffman_decode.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/output_image.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/preprocess_downsample.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/processor.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/quality.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/quantize.cc
CPP_FILES+=$(GUETZLI_ROOT)/guetzli/score.cc
CPP_FILES+=$(GUETZLI_ROOT)/third_party/butteraugli/butteraugli/butteraugli.cc

EMCC:=emcc
EMCCFLAGS+=$(INC)
EMCCFLAGS+=-DGUETZLI_BUILD_FOR_BROWSER
EMCCFLAGS+=--memory-init-file 0
EMCCFLAGS+=-std=c++14
EMLDFLAGS+=-O3

$(TARG).out.js: $(CPP_FILES) Makefile pre.js post.js
	$(EMCC) $(EMCCFLAGS) $(EMLDFLAGS) --pre-js pre.js --post-js post.js $(CPP_FILES) -o $@

run: $(TARG).out.js
	node main.js

clean:
	-rm $(TARG).out.js
