parser grammar MarkupParser;

options {
    tokenVocab = MarkupLexer;
}

lines: line+ ;

line: (template EOF) | (template? NL) ;

template : (placeholder | text | sep)+ ;

sep: WSEP ;

placeholder : OPEN ctrl_seq* template CLOSE ;

ctrl_seq: CTRL_START M_CTRL_KIND M_CTRL_CONT* M_CTRL_END;

text : TEXT ;
