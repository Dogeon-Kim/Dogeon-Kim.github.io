SHELL=bash
cmd:
	@cd $(CWD); $(CMD)
	     
c_run:
	@/bin/date +%s%N > $(LOG)
	@./$(PROG) $(RUN_OPTION)
	@/bin/date +%s%N >> $(LOG)
		     
cpp_run:
	@/bin/date +%s%N > $(LOG)
	@./$(PROG) $(RUN_OPTION)
	@/bin/date +%s%N >> $(LOG)
		     
py_run:
	@/bin/date +%s%N > $(LOG)
	@python $(PROG) $(RUN_OPTION)
	@/bin/date +%s%N >> $(LOG)
		      
py3_run:
	@/bin/date +%s%N > $(LOG)
	@python3 $(PROG) $(RUN_OPTION)
	@/bin/date +%s%N >> $(LOG)
		     
java_run:
	@/bin/date +%s%N > $(LOG)
	@java -jar $(PROG) $(RUN_OPTION)
	@/bin/date +%s%N >> $(LOG)
		     
go_run:
	@/bin/date +%s%N > $(LOG)
	@./$(PROG) $(RUN_OPTION)
	@/bin/date +%s%N >> $(LOG)
		     
python_console_run:
	python
	     
python3_console_run:
	python3
