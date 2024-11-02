lexer grammar MarkupLexer;

OPEN: '[' ;

CLOSE: ']' ;

WSEP: '/' ;

NL: '\n' ;

CTRL_START: '==' -> pushMode(M_CTRL);

TEXT: (F_NON_CTRL_TEXT F_TEXT*)
    | (F_TEXT F_NON_CTRL_TEXT+ F_TEXT*);

fragment F_NON_CTRL_TEXT: ~('[' | ']' | '/' | '\n') ;

fragment F_TEXT: ~('[' | ']' | '/' | '\n' | '=') ;

mode M_CTRL;

M_CTRL_KIND: [a-z] -> pushMode(M_CTRLCONT);

mode M_CTRLCONT;

M_CTRL_CONT: ~(' ' | '[')+;

M_CTRL_END: ' ' -> popMode, popMode;
