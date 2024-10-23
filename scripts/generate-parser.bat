@echo off
setlocal
cd "%~dp0"
antlr4 -Dlanguage=Python3 .\MarkupLexer.g4 || goto :error
antlr4 -Dlanguage=Python3 .\MarkupParser.g4 || goto :error
exit 0
endlocal
:error
exit 1
